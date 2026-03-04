import { Product, ProductVariant, ProductImage, Category, Collection } from "../db/models";
import type { ProductCreationAttributes } from "../db/models/product.model";
import * as productService from "./product.service";

export async function listAll() {
  const products = await Product.findAll({
    order: [["title", "ASC"]],
    include: [
      { model: Category, as: "category", attributes: ["id", "name", "slug"], required: false },
      {
        model: ProductVariant,
        as: "variants",
        include: [{ model: ProductImage, as: "images", attributes: ["url"] }],
      },
      { model: Collection, as: "collections", through: { attributes: [] }, attributes: ["id", "name", "slug"] },
    ],
  });
  return products.map((p: any) => {
    const variants = (p.variants || []).sort((a: any, b: any) => Number(a.price) - Number(b.price));
    const v = variants[0];
    const img = (v?.images || [])[0];
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      categoryId: p.categoryId,
      category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : null,
      brand: p.brand,
      material: p.material,
      isActive: p.isActive,
      price: v ? Number(v.price) : null,
      compareAtPrice: v?.compareAtPrice ? Number(v.compareAtPrice) : null,
      imageUrl: img?.url || null,
      variantCount: (p.variants || []).length,
      collectionIds: (p.collections || []).map((c: any) => c.id),
      collectionSlugs: (p.collections || []).map((c: any) => c.slug),
    };
  });
}

export async function getById(id: string) {
  return productService.getById(id);
}

export async function create(body: ProductCreationAttributes) {
  return productService.create(body);
}

export async function update(id: string, body: Partial<ProductCreationAttributes>) {
  const product = await Product.findByPk(id);
  if (!product) return null;
  await (product as any).update(body);
  return productService.getById(id);
}
