import mongoose from "mongoose";
import { Store } from "../models/store.model.js";
import { Product } from "../models/product.model.js";
import { AdminStock } from "../models/adminStock.model.js";
import { StoreStock } from "../models/storeStock.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ========= ADMIN → TRANSFER STOCK ========= */
/* URL: /admin/stores/:storeId/stock */
const transferStockToStore = asyncHandler(async (req, res) => {
  const { storeId } = req.params;        // str_001
  const { productId, qty } = req.body;   // prd_001

  if (!productId || qty <= 0) {
    throw new ApiError(400, "ProductId and valid quantity are required");
  }

  /* STEP 1: Find Store by custom storeId */
  const store = await Store.findOne({ storeId });
  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  /* STEP 2: Find Product by custom productId */
  const product = await Product.findOne({ productId });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    /* STEP 3: Check Admin Stock */
    const adminStock = await AdminStock.findOne({
      adminId: req.admin._id,
      productId: product._id
    }).session(session);

    if (!adminStock || adminStock.qty < qty) {
      throw new ApiError(400, "Insufficient admin stock");
    }

    /* STEP 4: Reduce Admin Stock */
    adminStock.qty -= qty;
    await adminStock.save({ session });

    /* STEP 5: Increase Store Stock */
    const storeStock = await StoreStock.findOneAndUpdate(
      {
        storeId: store._id,
        productId: product._id
      },
      { $inc: { qty } },
      { upsert: true, new: true, session }
    );

    await session.commitTransaction();

    res.status(200).json(
      new ApiResponse(200, {
        storeId: store.storeId,
        productId: product.productId,
        transferredQty: qty,
        storeStock
      }, "Stock transferred successfully")
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/* ========= INCREASE ADMIN STOCK ========= */
const increaseAdminStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;

  if (!qty || qty <= 0) {
    throw new ApiError(400, "Quantity must be greater than 0");
  }

  const product = await Product.findOne({ productId });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const stock = await AdminStock.findOneAndUpdate(
    {
      adminId: req.admin._id,
      productId: product._id
    },
    { $inc: { qty } },
    { new: true }
  );

  if (!stock) {
    throw new ApiError(404, "Stock record not found");
  }

  res.status(200).json(
    new ApiResponse(200, stock, "Stock increased successfully")
  );
});

export { 
  transferStockToStore,
  increaseAdminStock
};
