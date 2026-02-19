import { Router } from "express";
import { getAllProducts } from "../controllers/product.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { verifyStore } from "../middlewares/verifyStore.middleware.js";

const router = Router();

/**
 * @openapi
 * /products/store:
 *   get:
 *     summary: Get All Products (Store View)
 *     tags: [Store - Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/store", verifyStore, getAllProducts);

export default router;
