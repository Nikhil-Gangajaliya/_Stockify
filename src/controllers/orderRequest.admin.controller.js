import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { Store } from "../models/store.model.js";
import { AdminStock } from "../models/adminStock.model.js";
import { StoreStock } from "../models/storeStock.model.js";
import { OrderRequest } from "../models/orderRequest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ========= ADMIN → VIEW ALL REQUESTS ========= */
const getAllOrderRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = status ? { status } : {};

  const requests = await OrderRequest.find(filter)
    .populate("storeId", "storeId firmName")
    .populate("productId", "productId productName")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(
    new ApiResponse(200, requests, "Order requests fetched")
  );
});

/* ========= ADMIN → APPROVE REQUEST (URL BASED) ========= */
const approveOrderRequest = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const request = await OrderRequest.findOne({ orderId });
  if (!request) throw new ApiError(404, "Order request not found");

  if (request.status !== "pending") {
    throw new ApiError(400, "Order already processed");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    /* STEP 1: Validate Store */
    const store = await Store.findById(request.storeId).session(session);
    if (!store) throw new ApiError(404, "Store not found");

    /* STEP 2: Validate Product */
    const product = await Product.findById(request.productId).session(session);
    if (!product) throw new ApiError(404, "Product not found");

    const qty = request.requestedQty;

    if (!qty || qty <= 0) {
      throw new ApiError(400, "Invalid requested quantity");
    }

    /* STEP 3: Check Admin Stock */
    const adminStock = await AdminStock.findOne({
      adminId: req.admin._id,
      productId: product._id
    }).session(session);

    if (!adminStock || adminStock.qty < qty) {
      throw new ApiError(400, "Insufficient admin stock");
    }

    /* STEP 4: Reduce Admin Stock (Atomic) */
    await AdminStock.findOneAndUpdate(
      {
        adminId: req.admin._id,
        productId: product._id
      },
      { $inc: { qty: -qty } },
      { session }
    );

    /* STEP 5: Increase Store Stock (Atomic) */
    await StoreStock.findOneAndUpdate(
      {
        storeId: store._id,
        productId: product._id
      },
      { $inc: { qty: qty } },
      { upsert: true, new: true, session }
    );

    /* STEP 6: Update Request Status */
    request.status = "approved";
    await request.save({ session });

    await session.commitTransaction();

    res.status(200).json(
      new ApiResponse(
        200,
        {
          orderId: request.orderId,
          productId: product.productId,
          transferredQty: qty
        },
        "Order approved and stock transferred successfully"
      )
    );

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/* ========= ADMIN → REJECT REQUEST (URL BASED) ========= */
const rejectOrderRequest = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const request = await OrderRequest.findOne({ orderId });
  if (!request) throw new ApiError(404, "Order request not found");

  if (request.status !== "pending") {
    throw new ApiError(400, "Order already processed");
  }

  request.status = "rejected";
  await request.save();

  res.status(200).json(
    new ApiResponse(200, request, "Order rejected")
  );
});

export {
  getAllOrderRequests,
  approveOrderRequest,
  rejectOrderRequest
};
