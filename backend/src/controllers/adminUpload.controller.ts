import { Response, NextFunction } from "express";
import type { AdminRequest } from "../middleware/auth";
import * as cloudinaryService from "../services/cloudinary.service";

export async function upload(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    if (!cloudinaryService.isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        error: "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env",
      });
    }
    const { image, folder } = req.body;
    if (!image || typeof image !== "string") {
      return res.status(400).json({ success: false, error: "image (base64 data URI or URL) required" });
    }
    const url = await cloudinaryService.uploadImage(image, (folder && typeof folder === "string" ? folder : "houseof").trim() || "houseof");
    return res.json({ success: true, data: { url } });
  } catch (e: unknown) {
    const err = e as Error;
    console.error("Cloudinary upload error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message || "Image upload failed. Check Cloudinary credentials and .env.",
    });
  }
}

export async function deleteUpload(req: AdminRequest, res: Response, next: NextFunction) {
  try {
    if (!cloudinaryService.isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        error: "Cloudinary is not configured.",
      });
    }
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ success: false, error: "url (Cloudinary image URL) required" });
    }
    await cloudinaryService.deleteImage(url);
    return res.json({ success: true });
  } catch (e: unknown) {
    const err = e as Error;
    if (err.message?.includes("Invalid Cloudinary")) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next(e);
  }
}
