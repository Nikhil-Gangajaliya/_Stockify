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
  getStoreInvoicesByStoreId,
  getAllInvoices
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


/**
 * @openapi
 * /admin/login:
 *   post:
 *     summary: Admin Login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adminId
 *               - password
 *             properties:
 *               adminId:
 *                 type: string
 *                 example: admin_001
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       401:
 *         description: Invalid credentials
 */

router.post("/login", adminLogin);

/**
 * @openapi
 * /admin/logout:
 *   post:
 *     summary: Admin Logout
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin logged out successfully
 */
router.post("/logout", verifyAdmin, adminLogout);

/**
 * @openapi
 * /admin/dashboard:
 *   get:
 *     summary: Get Admin Dashboard Data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard statistics fetched
 */
router.get("/dashboard", verifyAdmin, getAdminDashboard);

/* ========= STORES ========= */

/**
 * @openapi
 * /admin/stores:
 *   post:
 *     summary: Create New Store
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firmName
 *               - address
 *               - city
 *               - contact
 *               - commission
 *               - password
 *             properties:
 *               firmName:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               contact:
 *                 type: number
 *               commission:
 *                 type: number
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Store created successfully
 *       400:
 *         description: Validation error
 */
router.post("/stores", verifyAdmin, createStore);

/**
 * @openapi
 * /admin/stores:
 *   get:
 *     summary: Get All Stores
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stores fetched successfully
 */
router.get("/stores", verifyAdmin, getAllStores);

/**
 * @openapi
 * /admin/stores/{storeId}:
 *   get:
 *     summary: Get Store By Store ID
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store fetched successfully
 *       404:
 *         description: Store not found
 */
router.get("/stores/:storeId", verifyAdmin, getStoreByStoreId);

/**
 * @openapi
 * /admin/stores/{storeId}/stock:
 *   get:
 *     summary: Get Stock Of Specific Store
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store stock fetched
 */
router.get("/stores/:storeId/stock", verifyAdmin, getStoreStockByStoreId);

/**
 * @openapi
 * /admin/invoices:
 *   get:
 *     summary: Get All Invoices
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All invoices fetched
 */
router.get("/invoices", verifyAdmin, getAllInvoices);

/**
 * @openapi
 * /admin/stores/{storeId}/invoices:
 *   get:
 *     summary: Get Invoices For Specific Store
 *     tags: [Invoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store invoices fetched
 */
router.get("/stores/:storeId/invoices", verifyAdmin, getStoreInvoicesByStoreId);

/* ========= PRODUCTS ========= */

/**
 * @openapi
 * /admin/products:
 *   post:
 *     summary: Create Product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/products", verifyAdmin, createProduct);

/**
 * @openapi
 * /admin/products:
 *   get:
 *     summary: Get All Products
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products fetched successfully
 */
router.get("/products", verifyAdmin, getAllProducts);

/**
 * @openapi
 * /admin/products/{productId}:
 *   get:
 *     summary: Get Product By Product ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *       404:
 *         description: Product not found
 */
router.get("/products/:productId", verifyAdmin, getProductByProductId);

/* ========= ADMIN STOCK ========= */

/**
 * @openapi
 * /admin/stock:
 *   get:
 *     summary: Get Admin Stock
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin stock fetched successfully
 */
router.get("/stock", verifyAdmin, getAdminStock);

/**
 * @openapi
 * /admin/order-requests:
 *   get:
 *     summary: Get All Order Requests
 *     tags: [Order Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order requests fetched
 */
router.get("/order-requests", verifyAdmin, getAllOrderRequests);

/* URL-BASED ACTION */

/**
 * @openapi
 * /admin/order-requests/{orderId}/approve:
 *   post:
 *     summary: Approve Order Request
 *     tags: [Order Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order approved successfully
 */
router.post("/order-requests/:orderId/approve", verifyAdmin, approveOrderRequest);

/**
 * @openapi
 * /admin/order-requests/{orderId}/reject:
 *   post:
 *     summary: Reject Order Request
 *     tags: [Order Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order rejected successfully
 */
router.post("/order-requests/:orderId/reject", verifyAdmin, rejectOrderRequest);

export default router;
