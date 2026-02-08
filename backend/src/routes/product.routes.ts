import { Router } from "express";
import { createProduct, getProductsByCategory } from "../controllers/product.controller";

const router = Router();

router.post("/", createProduct);
router.get("/category/:category", getProductsByCategory);

export default router;
