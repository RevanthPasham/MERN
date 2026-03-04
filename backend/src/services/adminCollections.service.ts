import { Collection, Product, ProductVariant, ProductImage, ProductCollection } from "../db/models";
import type { CollectionCreationAttributes } from "../db/models/collection.model";

export async function listAll() {
  const rows = await Collection.findAll({
    order: [["name", "ASC"]],
  });
  return rows.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? null,
    bannerImage: c.bannerImage ?? null,
    isActive: c.isActive,
    createdAt: c.createdAt,
  }));
}

export async function getById(id: string) {
  const c = await Collection.findByPk(id);
  if (!c) return null;
  const row = c as any;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    bannerImage: row.bannerImage,
    isActive: row.isActive,
    createdAt: row.createdAt,
  };
}

export async function create(body: CollectionCreationAttributes) {
  const c = await Collection.create(body);
  return getById(c.id);
}

export async function update(id: string, body: Partial<CollectionCreationAttributes>) {
  const c = await Collection.findByPk(id);
  if (!c) return null;
  await (c as any).update(body);
  return getById(id);
}

export async function getCollectionProducts(id: string) {
  const collection = await Collection.findByPk(id, {
    include: [
      {
        model: Product,
        as: "products",
        through: { attributes: [] },
        include: [
          {
            model: ProductVariant,
            as: "variants",
            attributes: ["id", "price"],
            include: [{ model: ProductImage, as: "images", attributes: ["url"], limit: 1 }],
          },
        ],
      },
    ],
  });
  if (!collection) return null;
  const c = collection as any;
  const products = (c.products || []).map((p: any) => {
    const v = (p.variants || [])[0];
    const img = (v?.images || [])[0];
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: v ? Number(v.price) : null,
      imageUrl: img?.url || null,
    };
  });
  return { collection: await getById(id), products };
}

export async function setCollectionProducts(collectionId: string, productIds: string[]) {
  await ProductCollection.destroy({ where: { collectionId } });
  const ids = Array.isArray(productIds) ? productIds.filter(Boolean) : [];
  for (const productId of ids) {
    await ProductCollection.create({ collectionId, productId });
  }
  return getCollectionProducts(collectionId);
}
