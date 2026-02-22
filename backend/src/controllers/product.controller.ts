import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";
import { createProductBodySchema } from "../utils/validation";
import { isValidUUID } from "../utils/uuid";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const data = await productService.list(search);
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
    const id = req.params.id;
    if (!isValidUUID(id)) return res.status(400).json({ success: false, error: "Invalid product id" });
    const data = await productService.getById(id);
    if (!data) return res.status(404).json({ success: false, error: "Product not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

export const getRelated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!isValidUUID(id)) return res.json({ success: true, data: [] });
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 6));
    const data = await productService.getRelated(id, limit);
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
