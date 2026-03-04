import { Response, NextFunction } from "express";
import type { AdminRequest } from "../middleware/auth";
import * as adminCollectionsService from "../services/adminCollections.service";

export async function list(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminCollectionsService.listAll();
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getById(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminCollectionsService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: "Collection not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function create(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    if (!body?.name || !body?.slug) {
      return res.status(400).json({ success: false, error: "name and slug required" });
    }
    const data = await adminCollectionsService.create({
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
      bannerImage: body.bannerImage ?? null,
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
    const data = await adminCollectionsService.update(req.params.id, {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.bannerImage !== undefined && { bannerImage: body.bannerImage }),
      ...(body.isActive !== undefined && { isActive: !!body.isActive }),
    });
    if (!data) return res.status(404).json({ success: false, error: "Collection not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getProducts(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const data = await adminCollectionsService.getCollectionProducts(req.params.id);
    if (!data) return res.status(404).json({ success: false, error: "Collection not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function setProducts(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    const productIds = req.body?.productIds;
    const data = await adminCollectionsService.setCollectionProducts(
      req.params.id,
      Array.isArray(productIds) ? productIds : []
    );
    if (!data) return res.status(404).json({ success: false, error: "Collection not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
