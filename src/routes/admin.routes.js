import { Router } from "express";
import {
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
  getStoreInvoicesByStoreId
} from "../controllers/admin.controller.js";
import {
  getAllOrderRequests,
  approveOrderRequest,
  rejectOrderRequest
} from "../controllers/orderRequest.admin.controller.js";
import { getAdminDashboard } from "../controllers/admin.dashboard.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router();

/* ========= AUTH ========= */
router.post("/login", adminLogin);
router.post("/logout", verifyAdmin, adminLogout);

router.get("/dashboard", verifyAdmin, getAdminDashboard);

/* ========= STORES ========= */
router.post("/stores", verifyAdmin, createStore);
router.get("/stores", verifyAdmin, getAllStores);
router.get("/stores/:storeId", verifyAdmin, getStoreByStoreId);
router.get("/stores/:storeId/stock", verifyAdmin, getStoreStockByStoreId);
router.get("/stores/:storeId/invoices", verifyAdmin, getStoreInvoicesByStoreId);

/* ========= PRODUCTS ========= */
router.post("/products", verifyAdmin, createProduct);
router.get("/products", verifyAdmin, getAllProducts);
router.get("/products/:productId", verifyAdmin, getProductByProductId);

/* ========= ADMIN STOCK ========= */
router.get("/stock", verifyAdmin, getAdminStock);

router.get("/order-requests", verifyAdmin, getAllOrderRequests);

/* URL-BASED ACTION */
router.post(
  "/order-requests/:orderId/approve",
  verifyAdmin,
  approveOrderRequest
);

router.post(
  "/order-requests/:orderId/reject",
  verifyAdmin,
  rejectOrderRequest
);

export default router;
