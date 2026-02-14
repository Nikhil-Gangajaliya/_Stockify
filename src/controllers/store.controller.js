import { Store } from "../models/store.model.js";
import { StoreStock } from "../models/storeStock.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ========= STORE LOGIN ========= */
const storeLogin = asyncHandler(async (req, res) => {
  const { storeId, password } = req.body;

  const store = await Store.findOne({ storeId });
  if (!store) throw new ApiError(404, "Store not found");

  const isValid = await store.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

  const accessToken = store.generateAccessToken();

  res
    .cookie("accessToken", accessToken, { httpOnly: true })
    .status(200)
    .json(new ApiResponse(200, { accessToken }, "Store logged in"));
});

/* ========= STORE LOGOUT ========= */
const storeLogout = asyncHandler(async (req, res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    })
    .status(200)
    .json(new ApiResponse(200, null, "Store logged out successfully"));
});

/* ========= STORE → VIEW OWN STOCK ========= */
const getMyStoreStock = asyncHandler(async (req, res) => {
  const storeId = req.store._id; // from verifyStore middleware

  const stock = await StoreStock.find({ storeId })
    .populate("productId", "productId productName weight sellPrice")
    .lean();

  res.status(200).json(
    new ApiResponse(200, stock, "Store stock fetched successfully")
  );
});

export { 
  storeLogin,
  storeLogout,
  getMyStoreStock
};
