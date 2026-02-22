import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";
import { createProductBodySchema } from "../utils/validation";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await productService.list();
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = createProductBodySchema.parse(req.body);
    const title = (body.title ?? body.name ?? "").trim();
    const slug = (body.slug ?? slugify(title)).trim() || slugify(title);
    const data = await productService.create({
      title,
      slug,
      description: body.description ?? null,
      categoryId: body.categoryId ?? null,
      brand: body.brand ?? null,
      material: body.material ?? null,
      isActive: body.isActive ?? true,
    });
    res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await productService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: "Product not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
