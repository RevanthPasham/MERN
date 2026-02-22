import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.get("/payment-status", orderController.paymentStatus);
router.post("/create", orderController.createOrder);
router.post("/confirm", requireAuth, orderController.confirmOrder);

export default router;
