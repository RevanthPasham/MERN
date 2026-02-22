import { Router } from "express";
import * as productController from "../controllers/product.controller";
import * as reviewController from "../controllers/review.controller";
import { requireAuth, optionalAuth } from "../middleware/auth";

const router = Router();
router.get("/", productController.list);
router.post("/", productController.create);
router.get("/:id/related", productController.getRelated);
router.get("/:id/reviews", reviewController.getByProductId);
router.get("/:id/can-review", optionalAuth, reviewController.canReview);
router.post("/:id/reviews", requireAuth, reviewController.create);
router.get("/:id", productController.getById);

export default router;
