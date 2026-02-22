import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import * as cartService from "../services/cart.service";

export async function getCart(req: AuthRequest, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
  try {
    const items = await cartService.getCart(userId);
    return res.json({ success: true, data: items });
  } catch (e) {
    return res.status(500).json({ success: false, error: "Failed to load cart" });
  }
}

export async function addItem(req: AuthRequest, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
  const { productId, size, quantity } = req.body;
  if (!productId) return res.status(400).json({ success: false, error: "productId required" });
  try {
    const items = await cartService.addItem(
      userId,
      productId,
      size ?? "S",
      quantity ?? 1
    );
    return res.json({ success: true, data: items });
  } catch (e: any) {
    return res.status(400).json({ success: false, error: e?.message ?? "Failed to add item" });
  }
}

export async function updateItem(req: AuthRequest, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
  const { productId, size, delta } = req.body;
  if (!productId) return res.status(400).json({ success: false, error: "productId required" });
  try {
    const items = await cartService.updateItem(
      userId,
      productId,
      size ?? "S",
      Number(delta) ?? 0
    );
    return res.json({ success: true, data: items });
  } catch (e: any) {
    return res.status(400).json({ success: false, error: e?.message ?? "Failed to update" });
  }
}

export async function removeItem(req: AuthRequest, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
  const { productId, size } = req.body;
  if (!productId) return res.status(400).json({ success: false, error: "productId required" });
  try {
    const items = await cartService.removeItem(userId, productId, size ?? "S");
    return res.json({ success: true, data: items });
  } catch (e: any) {
    return res.status(400).json({ success: false, error: e?.message ?? "Failed to remove" });
  }
}

export async function clearCart(req: AuthRequest, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
  try {
    await cartService.clearCart(userId);
    return res.json({ success: true, data: [] });
  } catch {
    return res.status(500).json({ success: false, error: "Failed to clear cart" });
  }
}

export async function mergeCart(req: AuthRequest, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
  const items = req.body?.items;
  if (!Array.isArray(items)) return res.status(400).json({ success: false, error: "items array required" });
  try {
    const cart = await cartService.mergeCart(userId, items);
    return res.json({ success: true, data: cart });
  } catch (e: any) {
    return res.status(400).json({ success: false, error: e?.message ?? "Failed to merge cart" });
  }
}
