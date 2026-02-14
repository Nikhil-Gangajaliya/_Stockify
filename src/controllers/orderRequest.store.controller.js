import { OrderRequest } from "../models/orderRequest.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ========= STORE → CREATE ORDER REQUEST ========= */
const createOrderRequest = asyncHandler(async (req, res) => {
  const storeId = req.store._id;

  const { productId, qty } = req.body || {};

  if (!productId || !qty || qty <= 0) {
    throw new ApiError(400, "Invalid product or quantity");
  }

  /* Convert custom productId → Mongo _id */
  const product = await Product.findOne({ productId });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const request = await OrderRequest.create({
    storeId,
    productId: product._id,
    requestedQty: qty
  });

  res.status(201).json(
    new ApiResponse(201, request, "Order request sent to admin")
  );
});


/* ========= STORE → VIEW OWN REQUESTS ========= */
const getMyOrderRequests = asyncHandler(async (req, res) => {
  const storeId = req.store._id;

  const requests = await OrderRequest.find({ storeId })
    .populate("productId", "productId productName")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(
    new ApiResponse(200, requests, "My order requests fetched")
  );
});

export {
  createOrderRequest,
  getMyOrderRequests
};
