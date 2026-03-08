import { Product, ProductVariant, ProductImage, Category, Collection } from "../db/models";
import type { ProductCreationAttributes } from "../db/models/product.model";
import * as productService from "./product.service";

/** Create product with a default variant so images can be set. */
export async function create(body: ProductCreationAttributes & { initialPrice?: number }) {
  const { initialPrice = 0, ...rest } = body;
  const product = await productService.create(rest);
  const sku = `${(product as any).slug}-S`.replace(/\s+/g, "-");
  await ProductVariant.create({
    productId: (product as any).id,
    sku: sku + "-" + Date.now(),
    price: Math.max(0, Number(initialPrice) || 0),
    stockQuantity: 0,
  });
  return productService.getById((product as any).id);
}

export async function listAll(search?: string) {
  const { Op } = await import("sequelize");
  const term = search && typeof search === "string" && search.trim() ? search.trim() : "";
  const where = term
    ? {
        [Op.or]: [
          { title: { [Op.iLike]: `%${term}%` } },
          { slug: { [Op.iLike]: `%${term}%` } },
          { brand: { [Op.iLike]: `%${term}%` } },
        ],
      }
    : undefined;
  const products = await Product.findAll({
    where,
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

export async function update(
  id: string,
  body: Partial<ProductCreationAttributes & { price?: number; stockQuantity?: number }>
) {
  const product = await Product.findByPk(id);
  if (!product) return null;

  const { price, stockQuantity, ...productFields } = body;
  if (Object.keys(productFields).length > 0) {
    await (product as any).update(productFields);
  }

  if (price !== undefined || stockQuantity !== undefined) {
    const variant = await ProductVariant.findOne({ where: { productId: id }, order: [["price", "ASC"]] });
    if (variant) {
      const updates: Record<string, unknown> = {};
      if (price !== undefined) updates.price = Math.max(0, Number(price));
      if (stockQuantity !== undefined) updates.stockQuantity = Math.max(0, Number(stockQuantity) || 0);
      if (Object.keys(updates).length > 0) await (variant as any).update(updates);
    }
  }

  return productService.getById(id);
}

/** Set the primary (first) image for a product (first variant's first image). Creates variant if none. */
export async function setProductPrimaryImage(productId: string, url: string): Promise<boolean> {
  const product = await Product.findByPk(productId, {
    include: [{ model: ProductVariant, as: "variants", include: [{ model: ProductImage, as: "images" }] }],
  });
  if (!product) return false;
  const p = product as any;
  let variants = (p.variants || []).sort((a: any, b: any) => Number(a.price) - Number(b.price));
  let variant = variants[0];
  if (!variant) {
    const sku = `${p.slug}-S-${Date.now()}`.replace(/\s+/g, "-");
    variant = await ProductVariant.create({
      productId,
      sku,
      price: 0,
      stockQuantity: 0,
    });
  }
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

/** Get all images for a product (first variant's images, sorted by sortOrder). */
export async function getProductImages(productId: string): Promise<{ id: string; url: string; sortOrder: number }[]> {
  const product = await Product.findByPk(productId, {
    include: [{ model: ProductVariant, as: "variants", include: [{ model: ProductImage, as: "images" }] }],
  });
  if (!product) return [];
  const p = product as any;
  const variants = (p.variants || []).sort((a: any, b: any) => Number(a.price) - Number(b.price));
  const variant = variants[0];
  if (!variant) return [];
  const images = (variant.images || []).sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return images.map((img: any) => ({ id: img.id, url: img.url, sortOrder: img.sortOrder ?? 0 }));
}

/** Add an image to the product (first variant). Creates variant if none. */
export async function addProductImage(productId: string, url: string): Promise<{ id: string; url: string; sortOrder: number }> {
  const product = await Product.findByPk(productId, {
    include: [{ model: ProductVariant, as: "variants", include: [{ model: ProductImage, as: "images" }] }],
  });
  if (!product) throw new Error("Product not found");
  const p = product as any;
  let variants = (p.variants || []).sort((a: any, b: any) => Number(a.price) - Number(b.price));
  let variant = variants[0];
  if (!variant) {
    const sku = `${p.slug}-S-${Date.now()}`.replace(/\s+/g, "-");
    variant = await ProductVariant.create({
      productId,
      sku,
      price: 0,
      stockQuantity: 0,
    });
  }
  const images = (variant.images || []).sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const maxOrder = images.length > 0 ? Math.max(...images.map((i: any) => i.sortOrder ?? 0)) : -1;
  const created = await ProductImage.create({
    variantId: variant.id,
    url,
    sortOrder: maxOrder + 1,
  });
  return { id: (created as any).id, url: (created as any).url, sortOrder: (created as any).sortOrder ?? 0 };
}

/** Remove one image by id. Image must belong to a variant of this product. */
export async function removeProductImage(productId: string, imageId: string): Promise<boolean> {
  const product = await Product.findByPk(productId, {
    include: [{ model: ProductVariant, as: "variants", include: [{ model: ProductImage, as: "images" }] }],
  });
  if (!product) return false;
  const p = product as any;
  const variants = p.variants || [];
  for (const v of variants) {
    const img = (v.images || []).find((i: any) => i.id === imageId);
    if (img) {
      await (img as any).destroy();
      return true;
    }
  }
  return false;
}
