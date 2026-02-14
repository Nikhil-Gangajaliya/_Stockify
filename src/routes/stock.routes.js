import { Router } from "express";
import { transferStockToStore } from "../controllers/stock.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router();

/* ========= ADMIN → TRANSFER ========= */
router.post("/stores/:storeId/stock", verifyAdmin, transferStockToStore);

export default router;
