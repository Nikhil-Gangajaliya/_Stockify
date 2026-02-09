import jwt from "jsonwebtoken";
import { Store } from "../models/store.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyStore = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw new ApiError(401, "Store unauthorized");

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const store = await Store.findById(decoded._id).select("-password");

  if (!store) throw new ApiError(401, "Invalid store token");

  req.store = store;
  next();
});
