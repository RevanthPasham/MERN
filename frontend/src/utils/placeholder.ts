// Inline SVG data URL so images never fail with network/DNS errors (e.g. ERR_NAME_NOT_RESOLVED)
const SVG = (w: number, h: number, label: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect fill="#e5e7eb" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="14">${label}</text></svg>`
  )}`;

export const PLACEHOLDER_PRODUCT = SVG(300, 400, "Product");
export const PLACEHOLDER_PRODUCT_LARGE = SVG(600, 800, "Product");
export const PLACEHOLDER_PRODUCT_THUMB = SVG(80, 80, "Product");
export const PLACEHOLDER_COLLECTION = SVG(400, 300, "Collection");
