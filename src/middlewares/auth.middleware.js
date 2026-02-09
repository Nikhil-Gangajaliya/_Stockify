import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/admin.model.js";
import { Store } from "../models/store.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  let user;

  if (decoded.role === "admin") {
    user = await Admin.findById(decoded._id).select("-password");
  } else if (decoded.role === "store") {
    user = await Store.findById(decoded._id).select("-password");
  }

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = user;
  req.user.role = decoded.role;

  next();
});
