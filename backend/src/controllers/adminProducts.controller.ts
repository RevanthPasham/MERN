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
      initialPrice: body.initialPrice != null ? Number(body.initialPrice) : 0,
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
    const id = req.params.id;

    if (body.imageUrl !== undefined) {
      if (body.imageUrl === null || body.imageUrl === "") {
        await adminProductsService.clearProductPrimaryImage(id);
      } else {
        const ok = await adminProductsService.setProductPrimaryImage(id, String(body.imageUrl));
        if (!ok) return res.status(400).json({ success: false, error: "Product has no variant; add a variant first to set image" });
      }
    }

    const data = await adminProductsService.update(id, {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
      ...(body.brand !== undefined && { brand: body.brand }),
      ...(body.material !== undefined && { material: body.material }),
      ...(body.isActive !== undefined && { isActive: !!body.isActive }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.stockQuantity !== undefined && { stockQuantity: body.stockQuantity }),
    });
    if (!data) return res.status(404).json({ success: false, error: "Product not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getImages(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const images = await adminProductsService.getProductImages(req.params.id);
    return res.json({ success: true, data: { images } });
  } catch (e) {
    next(e);
  }
}

export async function addImage(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const url = req.body?.url;
    if (!url || typeof url !== "string" || !url.trim()) {
      return res.status(400).json({ success: false, error: "url required" });
    }
    const image = await adminProductsService.addProductImage(id, url.trim());
    return res.status(201).json({ success: true, data: image });
  } catch (e: unknown) {
    const err = e as Error;
    if (err.message?.includes("not found")) {
      return res.status(404).json({ success: false, error: err.message });
    }
    next(e);
  }
}

export async function removeImage(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const { id, imageId } = req.params;
    if (!imageId) return res.status(400).json({ success: false, error: "imageId required" });
    const ok = await adminProductsService.removeProductImage(id, imageId);
    if (!ok) return res.status(404).json({ success: false, error: "Image or product not found" });
    return res.json({ success: true, message: "Image removed" });
  } catch (e) {
    next(e);
  }
}
