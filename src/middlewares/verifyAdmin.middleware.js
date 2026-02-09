import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw new ApiError(401, "Admin unauthorized");

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const admin = await Admin.findById(decoded._id).select("-password");

  if (!admin) throw new ApiError(401, "Invalid admin token");

  req.admin = admin;
  next();
});
