import { Router } from "express";
import { createInvoice } from "../controllers/invoice.controller.js";
import { verifyStore } from "../middlewares/verifyStore.middleware.js";

const router = Router();

/* ========= CREATE INVOICE ========= */

/**
 * @openapi
 * /invoice:
 *   post:
 *     summary: Create Invoice (Store)
 *     tags: [Store - Invoice]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               custName:
 *                 type: string
 *                 example: Ramesh Patel
 *               custContact:
 *                 type: string
 *                 example: "9876543210"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - qty
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: prd_001
 *                     qty:
 *                       type: number
 *                       example: 2
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       400:
 *         description: Validation error or low stock
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.post("/", verifyStore, createInvoice);

export default router;
