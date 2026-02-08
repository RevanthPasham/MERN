import { Request, Response } from "express";
import { createProductService, getByCategoryService } from "../services/product.service";

export async function createProduct(req: Request, res: Response) {
  try {
    await createProductService(req.body);
    res.status(201).json({ message: "product created" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getProductsByCategory(req: Request, res: Response) {
  try {
    const data = await getByCategoryService(req.params.category);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
