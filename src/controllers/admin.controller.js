// Admin login

// Create store

// Create product

// Initial admin stock creation

import { Admin } from "../models/admin.model.js";
import { Store } from "../models/store.model.js";
import { Product } from "../models/product.model.js";
import { AdminStock } from "../models/adminStock.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ================= ADMIN LOGIN ================= */
const adminLogin = asyncHandler(async (req, res) => {
  const { adminId, password } = req.body;

  const admin = await Admin.findOne({ adminId });
  if (!admin) throw new ApiError(404, "Admin not found");

  const isValid = await admin.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

  const accessToken = admin.generateAccessToken();

  res
    .cookie("accessToken", accessToken, { httpOnly: true })
    .status(200)
    .json(new ApiResponse(200, { accessToken }, "Admin logged in"));
});

/* ================= CREATE STORE ================= */
const createStore = asyncHandler(async (req, res) => {
  const store = await Store.create(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, store, "Store created successfully"));
});

/* ================= CREATE PRODUCT ================= */
const createProduct = asyncHandler(async (req, res) => {
  const { initialQty = 0 } = req.body;

  const product = await Product.create(req.body);

  await AdminStock.create({
    adminId: req.admin._id,
    productId: product._id,
    qty: initialQty
  });

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created"));
});

export {
  adminLogin,
  createStore,
  createProduct
}