import { Router } from "express";
import { getAllProducts } from "../controllers/product.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { verifyStore } from "../middlewares/verifyStore.middleware.js";

const router = Router();

/* Admin view */
router.get("/", verifyAdmin, getAllProducts);

/* Store view */
router.get("/store", verifyStore, getAllProducts);

export default router;
