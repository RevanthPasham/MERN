import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import * as cartController from "../controllers/cart.controller";

const router = Router();

router.use(requireAuth);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.patch("/items", cartController.updateItem);
router.delete("/items", cartController.removeItem);
router.post("/clear", cartController.clearCart);
router.post("/merge", cartController.mergeCart);

export default router;
