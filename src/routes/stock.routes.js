import { Router } from "express";
import { 
    transferStockToStore,
    increaseAdminStock
} from "../controllers/stock.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router();

/* ========= ADMIN → TRANSFER ========= */

/**
 * @openapi
 * /stock/stores/{storeId}/stock:
 *   post:
 *     summary: Transfer Stock From Admin To Store
 *     tags: [Admin - Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom Store ID (e.g., str_001)
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
 *                 example: 10
 *     responses:
 *       200:
 *         description: Stock transferred successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       404:
 *         description: Store or Product not found
 */
router.post("/stores/:storeId/stock", verifyAdmin, transferStockToStore);

/* ========= ADMIN → INCREASE STOCK ========= */

/**
 * @openapi
 * /stock/products/{productId}/increase-stock:
 *   patch:
 *     summary: Increase Admin Stock Quantity for a Product
 *     tags: [Admin - Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom Product ID (e.g., prd_001)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qty
 *             properties:
 *               qty:
 *                 type: number
 *                 minimum: 1
 *                 example: 50
 *     responses:
 *       200:
 *         description: Admin stock increased successfully
 *       400:
 *         description: Invalid quantity provided
 *       401:
 *         description: Unauthorized (Admin token required)
 *       404:
 *         description: Product or stock record not found
 */
router.patch("/products/:productId/increase-stock", verifyAdmin, increaseAdminStock);

export default router;
