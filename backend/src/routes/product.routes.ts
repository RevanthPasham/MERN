import { Router } from "express";
import {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
} from "../controllers/product.controller";

const router = Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);

export default router;
