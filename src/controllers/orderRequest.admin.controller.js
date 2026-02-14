import { OrderRequest } from "../models/orderRequest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ========= ADMIN → VIEW ALL REQUESTS ========= */
const getAllOrderRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = status ? { status } : {};

  const requests = await OrderRequest.find(filter)
    .populate("storeId", "storeId firmName")
    .populate("productId", "productId productName")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(
    new ApiResponse(200, requests, "Order requests fetched")
  );
});

/* ========= ADMIN → APPROVE REQUEST (URL BASED) ========= */
const approveOrderRequest = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const request = await OrderRequest.findOne({ orderId });
  if (!request) throw new ApiError(404, "Order request not found");

  if (request.status !== "pending") {
    throw new ApiError(400, "Order already processed");
  }

  request.status = "approved";
  await request.save();

  res.status(200).json(
    new ApiResponse(200, request, "Order approved")
  );
});

/* ========= ADMIN → REJECT REQUEST (URL BASED) ========= */
const rejectOrderRequest = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const request = await OrderRequest.findOne({ orderId });
  if (!request) throw new ApiError(404, "Order request not found");

  if (request.status !== "pending") {
    throw new ApiError(400, "Order already processed");
  }

  request.status = "rejected";
  await request.save();

  res.status(200).json(
    new ApiResponse(200, request, "Order rejected")
  );
});

export {
  getAllOrderRequests,
  approveOrderRequest,
  rejectOrderRequest
};
