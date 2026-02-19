import { Router } from "express";
import * as productController from "../controllers/product.controller";

const router = Router();
router.get("/", productController.list);
router.post("/", productController.create);
router.get("/:id", productController.getById);

export default router;
