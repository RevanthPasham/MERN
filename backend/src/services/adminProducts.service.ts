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

/** Set the primary (first) image for a product (first variant's first image). Creates image row if none. */
export async function setProductPrimaryImage(productId: string, url: string): Promise<boolean> {
  const product = await Product.findByPk(productId, {
    include: [{ model: ProductVariant, as: "variants", include: [{ model: ProductImage, as: "images" }] }],
  });
  if (!product) return false;
  const p = product as any;
  const variants = (p.variants || []).sort((a: any, b: any) => Number(a.price) - Number(b.price));
  const variant = variants[0];
  if (!variant) return false;
  const images = (variant.images || []).sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const first = images[0];
  if (first) {
    await (first as any).update({ url });
  } else {
    await ProductImage.create({
      variantId: variant.id,
      url,
      sortOrder: 0,
    });
  }
  return true;
}

/** Remove the primary image (delete first image of first variant). */
export async function clearProductPrimaryImage(productId: string): Promise<boolean> {
  const product = await Product.findByPk(productId, {
    include: [{ model: ProductVariant, as: "variants", include: [{ model: ProductImage, as: "images" }] }],
  });
  if (!product) return false;
  const p = product as any;
  const variants = (p.variants || []).sort((a: any, b: any) => Number(a.price) - Number(b.price));
  const variant = variants[0];
  if (!variant) return false;
  const images = (variant.images || []).sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const first = images[0];
  if (first) await (first as any).destroy();
  return true;
}
