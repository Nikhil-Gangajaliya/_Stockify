import { StoreStock } from "../models/storeStock.model.js";
import { OrderRequest } from "../models/orderRequest.model.js";
import { Invoice } from "../models/invoices.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getStoreDashboard = asyncHandler(async (req, res) => {
  const storeId = req.store._id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalProducts,
    lowStockCount,
    pendingRequests,
    approvedRequests,
    todaySales,
    recentRequests,
    recentInvoices
  ] = await Promise.all([

    StoreStock.countDocuments({ storeId, qty: { $gt: 0 } }),

    StoreStock.countDocuments({ storeId, qty: { $lt: 10 } }),

    OrderRequest.countDocuments({ storeId, status: "pending" }),

    OrderRequest.countDocuments({ storeId, status: "approved" }),

    Invoice.aggregate([
      {
        $match: {
          storeId,
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]),

    OrderRequest.find({ storeId })
      .populate("productId", "productId productName")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Invoice.find({ storeId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      totalProducts,
      lowStockCount,
      pendingRequests,
      approvedRequests,
      todaySales: todaySales[0]?.total || 0,
      recentRequests,
      recentInvoices
    }, "Store dashboard data fetched")
  );
});

export { getStoreDashboard };
