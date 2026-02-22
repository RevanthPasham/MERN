import { Banner } from "../db/models";

export async function list() {
  const rows = await Banner.findAll({
    where: { isActive: true },
    order: [["sortOrder", "ASC"]],
    raw: false,
  });
  return rows.map((b: any) => ({
    id: b.id,
    title: b.title,
    highlight: b.highlight,
    subtitle: b.subtitle || "",
    cta: b.cta,
    collectionSlug: b.collectionSlug,
    imageUrl: b.imageUrl,
    sortOrder: b.sortOrder,
  }));
}
