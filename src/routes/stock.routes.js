import { Router } from "express";
import { transferStockToStore } from "../controllers/stock.controller.js";
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

export default router;
