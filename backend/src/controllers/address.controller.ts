import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import * as addressService from "../services/address.service";

export async function list(req: AuthRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
  try {
    const data = await addressService.listByUserId(userId);
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
  try {
    const data = await addressService.getById(id, userId);
    if (!data) return res.status(404).json({ success: false, error: "Address not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
  const body = req.body;
  if (!body?.fullName || !body?.phoneNumber || !body?.country || !body?.state || !body?.city || !body?.area || !body?.streetAddress || !body?.postalCode) {
    return res.status(400).json({
      success: false,
      error: "fullName, phoneNumber, country, state, city, area, streetAddress, postalCode are required",
    });
  }
  try {
    const data = await addressService.create(userId, {
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
      country: body.country,
      state: body.state,
      city: body.city,
      area: body.area,
      streetAddress: body.streetAddress,
      landmark: body.landmark ?? null,
      postalCode: body.postalCode,
      addressType: body.addressType ?? "Home",
      isDefault: body.isDefault,
    });
    return res.status(201).json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
  try {
    const data = await addressService.update(id, userId, req.body);
    if (!data) return res.status(404).json({ success: false, error: "Address not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function setDefault(req: AuthRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
  try {
    const data = await addressService.setDefault(id, userId);
    if (!data) return res.status(404).json({ success: false, error: "Address not found" });
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
  try {
    const ok = await addressService.remove(id, userId);
    if (!ok) return res.status(404).json({ success: false, error: "Address not found" });
    return res.json({ success: true });
  } catch (e) {
    next(e);
  }
}
