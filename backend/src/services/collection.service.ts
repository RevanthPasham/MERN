import { Collection, Product, ProductVariant, ProductImage, Category } from "../db/models";
import type { CollectionCreationAttributes } from "../db/models/collection.model";

const CollectionModel = Collection as typeof Collection & {
  findAll: (opts?: object) => Promise<InstanceType<typeof Collection>[]>;
  findOne: (opts?: object) => Promise<InstanceType<typeof Collection> | null>;
  create: (values: CollectionCreationAttributes) => Promise<InstanceType<typeof Collection>>;
  findByPk: (id: string) => Promise<InstanceType<typeof Collection> | null>;
};

export async function list() {
  const rows = await CollectionModel.findAll({
    order: [["name", "ASC"]],
    where: { isActive: true },
  });
  return rows.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? null,
    bannerImage: c.bannerImage ?? null,
  }));
}

export async function create(body: CollectionCreationAttributes) {
  return CollectionModel.create(body);
}

export async function getById(id: string) {
  return CollectionModel.findByPk(id);
}

export async function getBySlugWithProducts(slug: string) {
  const col = await CollectionModel.findOne({
    where: { slug, isActive: true },
    include: [
      {
        model: Product,
        as: "products",
        through: { attributes: [] },
        where: { isActive: true },
        required: false,
        include: [
          { model: Category, as: "category", attributes: ["id", "name", "slug"] },
          {
            model: ProductVariant,
            as: "variants",
            include: [
              {
                model: ProductImage,
                as: "images",
                attributes: ["url"],
              },
            ],
          },
        ],
      },
    ],
  });
  if (!col) return null;
  const c = col as any;
  const products = (c.products || []).map((p: any) => {
    const sorted = (p.variants || []).sort((a: any, b: any) => Number(a.price) - Number(b.price));
    const v = sorted[0];
    const img = (v?.images || [])[0];
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description || null,
      categoryId: p.categoryId || null,
      category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : null,
      price: v ? Number(v.price) : null,
      compareAtPrice: v?.compareAtPrice ? Number(v.compareAtPrice) : null,
      imageUrl: img?.url || null,
    };
  });
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    bannerImage: c.bannerImage,
    products,
  };
}
