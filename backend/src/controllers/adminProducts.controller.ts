import { Response, NextFunction } from "express";
import type { AdminRequest } from "../middleware/auth";
import * as adminProductsService from "../services/adminProducts.service";

export async function list(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminProductsService.listAll();
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getById(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminProductsService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: "Product not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function create(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    if (!body?.title || !body?.slug) {
      return res.status(400).json({ success: false, error: "title and slug required" });
    }
    const data = await adminProductsService.create({
      title: body.title,
      slug: body.slug,
      description: body.description ?? null,
      categoryId: body.categoryId ?? null,
      brand: body.brand ?? null,
      material: body.material ?? null,
      isActive: body.isActive !== false,
    });
    return res.status(201).json({ success: true, data });
  } catch (e: unknown) {
    const err = e as Error;
    if (err.message?.includes("unique") || err.message?.includes("slug")) {
      return res.status(400).json({ success: false, error: "Slug already exists" });
    }
    next(e);
  }
}

export async function update(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    const data = await adminProductsService.update(req.params.id, {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
      ...(body.brand !== undefined && { brand: body.brand }),
      ...(body.material !== undefined && { material: body.material }),
      ...(body.isActive !== undefined && { isActive: !!body.isActive }),
    });
    if (!data) return res.status(404).json({ success: false, error: "Product not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
