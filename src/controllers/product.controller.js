import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ========= GET PRODUCTS (ADMIN / STORE) ========= */
const getAllProducts = asyncHandler(async (_, res) => {
  const products = await Product.find();

  res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched"));
});

export { getAllProducts };
