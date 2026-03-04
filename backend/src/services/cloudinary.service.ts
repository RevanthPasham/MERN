import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfig() {
  if (configured) return;
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (name && key && secret) {
    cloudinary.config({
      cloud_name: name.trim(),
      api_key: key.trim(),
      api_secret: secret.trim(),
    });
    configured = true;
  }
}

export function isCloudinaryConfigured(): boolean {
  ensureConfig();
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

export async function uploadImage(dataUriOrUrl: string, folder = "houseof"): Promise<string> {
  ensureConfig();
  if (!configured) throw new Error("Cloudinary is not configured");
  const result = await cloudinary.uploader.upload(dataUriOrUrl, {
    folder,
    resource_type: "image",
  });
  return result.secure_url;
}
