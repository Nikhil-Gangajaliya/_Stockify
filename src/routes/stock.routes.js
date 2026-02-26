import { Router } from "express";
import {
    increaseAdminStock
} from "../controllers/stock.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router();

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
