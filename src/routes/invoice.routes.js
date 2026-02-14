import { Router } from "express";
import { createInvoice } from "../controllers/invoice.controller.js";
import { verifyStore } from "../middlewares/verifyStore.middleware.js";

const router = Router();

/* ========= CREATE INVOICE ========= */
router.post("/", verifyStore, createInvoice);

export default router;
