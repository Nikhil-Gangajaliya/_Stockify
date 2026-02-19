import { Router } from "express";
import { 
  storeLogin,
  storeLogout,
  getMyStoreStock,
  getMyInvoices
} from "../controllers/store.controller.js";
import {
  createOrderRequest,
  getMyOrderRequests
} from "../controllers/orderRequest.store.controller.js";
import { getStoreDashboard } from "../controllers/store.dashboard.controller.js";
import { verifyStore } from "../middlewares/verifyStore.middleware.js";

const router = Router();

/* ========= AUTH ========= */

/**
 * @openapi
 * /store/login:
 *   post:
 *     summary: Store Login
 *     tags: [Store - Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeId
 *               - password
 *             properties:
 *               storeId:
 *                 type: string
 *                 example: str_001
 *               password:
 *                 type: string
 *                 example: store123
 *     responses:
 *       200:
 *         description: Store logged in successfully
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: Store not found
 */
router.post("/login", storeLogin);

/**
 * @openapi
 * /store/logout:
 *   post:
 *     summary: Store Logout
 *     tags: [Store - Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Store logged out successfully
 */
router.post("/logout", verifyStore, storeLogout);

/**
 * @openapi
 * /store/dashboard:
 *   get:
 *     summary: Get Store Dashboard Data
 *     tags: [Store - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Store dashboard data fetched
 */
router.get("/dashboard", verifyStore, getStoreDashboard);

/* ========= STORE SELF ========= */

/**
 * @openapi
 * /store/profile:
 *   get:
 *     summary: Get Store Profile
 *     tags: [Store - Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Store profile fetched
 */
router.get("/profile", verifyStore, (req, res) => {
  res.status(200).json(req.store);
});

/* ========= STORE STOCK ========= */

/**
 * @openapi
 * /store/stock:
 *   get:
 *     summary: Get Store Stock
 *     tags: [Store - Stock]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Store stock fetched successfully
 */
router.get("/stock", verifyStore, getMyStoreStock);

/**
 * @openapi
 * /store/invoices:
 *   get:
 *     summary: Get Store Invoices
 *     tags: [Store - Invoice]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Store invoices fetched
 */
router.get("/invoices", verifyStore, getMyInvoices);

/**
 * @openapi
 * /store/order-requests:
 *   post:
 *     summary: Create Order Request
 *     tags: [Store - Order Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - qty
 *             properties:
 *               productId:
 *                 type: string
 *                 example: prd_001
 *               qty:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Order request created successfully
 *       400:
 *         description: Invalid quantity
 *       404:
 *         description: Product not found
 */
router.post("/order-requests", verifyStore, createOrderRequest);

/**
 * @openapi
 * /store/order-requests:
 *   get:
 *     summary: Get My Order Requests
 *     tags: [Store - Order Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order requests fetched successfully
 */
router.get("/order-requests", verifyStore, getMyOrderRequests);

export default router;
