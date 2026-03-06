import { Banner } from "../db/models";
import type { BannerCreationAttributes } from "../db/models/banner.model";

export async function listAll() {
  const rows = await Banner.findAll({
    order: [
      ["sortOrder", "ASC"],
      ["createdAt", "ASC"],
    ],
  });
  return rows.map((b: any) => ({
    id: b.id,
    title: b.title,
    highlight: b.highlight,
    subtitle: b.subtitle ?? "",
    cta: b.cta,
    collectionSlug: b.collectionSlug,
    imageUrl: b.imageUrl,
    sortOrder: b.sortOrder,
    isActive: b.isActive,
    createdAt: b.createdAt,
  }));
}

export async function getById(id: string) {
  const b = await Banner.findByPk(id);
  if (!b) return null;
  const row = b as any;
  return {
    id: row.id,
    title: row.title,
    highlight: row.highlight,
    subtitle: row.subtitle ?? "",
    cta: row.cta,
    collectionSlug: row.collectionSlug,
    imageUrl: row.imageUrl,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    createdAt: row.createdAt,
  };
}

export async function create(body: Partial<BannerCreationAttributes>) {
  const b = await Banner.create({
    title: body.title!,
    highlight: body.highlight!,
    subtitle: body.subtitle ?? "",
    cta: body.cta!,
    collectionSlug: body.collectionSlug!,
    imageUrl: body.imageUrl ?? null,
    sortOrder: body.sortOrder ?? 0,
    isActive: body.isActive !== false,
  });
  return getById(b.id);
}

export async function update(id: string, body: Partial<BannerCreationAttributes>) {
  const b = await Banner.findByPk(id);
  if (!b) return null;
  await (b as any).update({
    ...(body.title !== undefined && { title: body.title }),
    ...(body.highlight !== undefined && { highlight: body.highlight }),
    ...(body.subtitle !== undefined && { subtitle: body.subtitle }),
    ...(body.cta !== undefined && { cta: body.cta }),
    ...(body.collectionSlug !== undefined && { collectionSlug: body.collectionSlug }),
    ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl === "" ? null : body.imageUrl }),
    ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
    ...(body.isActive !== undefined && { isActive: !!body.isActive }),
  });
  return getById(id);
}
