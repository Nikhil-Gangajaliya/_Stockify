import { Store } from "../models/store.model.js";
import { Product } from "../models/product.model.js";
import { AdminStock } from "../models/adminStock.model.js";
import { OrderRequest } from "../models/orderRequest.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAdminDashboard = asyncHandler(async (req, res) => {

  const [
    totalStores,
    totalProducts,
    pendingRequests,
    lowAdminStock,
    stockValue,
    recentRequests,
    adminStockSummary
  ] = await Promise.all([

    Store.countDocuments(),

    Product.countDocuments(),

    OrderRequest.countDocuments({ status: "pending" }),

    AdminStock.countDocuments({ qty: { $lt: 20 } }),

    AdminStock.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: { $multiply: ["$qty", "$product.costPrice"] }
          }
        }
      }
    ]),

    OrderRequest.find()
      .populate("storeId", "storeId firmName")
      .populate("productId", "productId productName")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    AdminStock.find()
      .populate("productId", "productId productName")
      .sort({ qty: 1 })
      .limit(5)
      .lean()
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      totalStores,
      totalProducts,
      pendingRequests,
      lowAdminStock,
      totalStockValue: stockValue[0]?.totalValue || 0,
      recentRequests,
      adminStockSummary
    }, "Admin dashboard data fetched")
  );
});

export { getAdminDashboard };
