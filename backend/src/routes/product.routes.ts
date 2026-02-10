import { Router } from "express";
import * as controller from "../controllers/product.controller";

const router = Router();

router.post("/", async (req, res) => {
  const product = await controller.createProduct(req.body);
  res.json(product);
});

router.get("/", async (_, res) => {
  res.json(await controller.getAllProducts());
});

router.get("/category/:name", async (req, res) => {
  res.json(await controller.getByCategory(req.params.name));
});

export default router;
