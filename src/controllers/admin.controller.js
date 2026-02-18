import { Admin } from "../models/admin.model.js";
import { Store } from "../models/store.model.js";
import { Product } from "../models/product.model.js";
import { AdminStock } from "../models/adminStock.model.js";
import { StoreStock } from "../models/storeStock.model.js";
import { Invoice } from "../models/invoices.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ========= ADMIN LOGIN ========= */
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

/* ========= ADMIN LOGOUT ========= */
const adminLogout = asyncHandler(async (req, res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    })
    .status(200)
    .json(new ApiResponse(200, null, "Admin logged out successfully"));
});


/* ========= CREATE STORE (str_001) ========= */
const createStore = asyncHandler(async (req, res) => {
  const store = await Store.create(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, store, "Store created"));
});

/* ========= GET ALL STORES ========= */
const getAllStores = asyncHandler(async (req, res) => {
  const stores = await Store.find().select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, stores, "Stores fetched"));
});

/* ========= GET STORE BY storeId ========= */
const getStoreByStoreId = asyncHandler(async (req, res) => {
  const { storeId } = req.params;

  const store = await Store.findOne({ storeId }).select("-password");
  if (!store) throw new ApiError(404, "Store not found");

  res
    .status(200)
    .json(new ApiResponse(200, store, "Store fetched"));
});

/* ========= CREATE PRODUCT (prd_001) ========= */
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

/* ========= GET ALL PRODUCTS ========= */
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();

  res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched"));
});

/* ========= GET PRODUCT BY productId ========= */
const getProductByProductId = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({ productId });
  if (!product) throw new ApiError(404, "Product not found");

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched"));
});

/* ========= GET ADMIN STOCK ========= */
const getAdminStock = asyncHandler(async (req, res) => {
  const stock = await AdminStock.find({ adminId: req.admin._id })
    .populate("productId");

  res
    .status(200)
    .json(new ApiResponse(200, stock, "Admin stock fetched"));
});

/* ========= GET STORE STOCK ========= */
const getStoreStockByStoreId = asyncHandler(async (req, res) => {
  const { storeId } = req.params;

  const store = await Store.findOne({ storeId });
  if (!store) throw new ApiError(404, "Store not found");

  const stock = await StoreStock.find({ storeId: store._id })
    .populate("productId");

  res
    .status(200)
    .json(new ApiResponse(200, stock, "Store stock fetched"));
});

/* ========= GET STORE INVOICES ========= */
const getStoreInvoicesByStoreId = asyncHandler(async (req, res) => {
  const { storeId } = req.params;

  const store = await Store.findOne({ storeId });
  if (!store) throw new ApiError(404, "Store not found");

  const invoices = await Invoice.find({ storeId: store._id })
    .populate("storeId", "storeId storeName")
    .populate("items.productId", "productId name")
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(
      200,
      invoices.map(formatInvoiceResponse),
      "Store invoices fetched"
    )
  );
});


const getAllInvoices = asyncHandler(async (req, res) => {

  const invoices = await Invoice.find()
    .populate("storeId", "storeId storeName")
    .populate("items.productId", "productId name")
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(
      200,
      invoices.map(formatInvoiceResponse),
      "All invoices fetched"
    )
  );
});


export {
  adminLogin,
  adminLogout,
  createStore,
  getAllStores,
  getStoreByStoreId,
  createProduct,
  getAllProducts,
  getProductByProductId,
  getAdminStock,
  getStoreStockByStoreId,
  getStoreInvoicesByStoreId,
  getAllInvoices
};
