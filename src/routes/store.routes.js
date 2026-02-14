import { Router } from "express";
import { 
  storeLogin,
  storeLogout,
  getMyStoreStock
} from "../controllers/store.controller.js";
import {
  createOrderRequest,
  getMyOrderRequests
} from "../controllers/orderRequest.store.controller.js";
import { getStoreDashboard } from "../controllers/store.dashboard.controller.js";
import { verifyStore } from "../middlewares/verifyStore.middleware.js";

const router = Router();

/* ========= AUTH ========= */
router.post("/login", storeLogin);
router.post("/logout", verifyStore, storeLogout);

router.get("/dashboard", verifyStore, getStoreDashboard);

/* ========= STORE SELF ========= */
router.get("/profile", verifyStore, (req, res) => {
  res.status(200).json(req.store);
});

/* ========= STORE STOCK ========= */
router.get("/stock", verifyStore, getMyStoreStock);

router.post("/order-requests", verifyStore, createOrderRequest);
router.get("/order-requests", verifyStore, getMyOrderRequests);

export default router;
