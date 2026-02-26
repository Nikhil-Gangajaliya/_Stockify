import mongoose from "mongoose";
import { Store } from "../models/store.model.js";
import { Product } from "../models/product.model.js";
import { AdminStock } from "../models/adminStock.model.js";
import { StoreStock } from "../models/storeStock.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
  increaseAdminStock
};
