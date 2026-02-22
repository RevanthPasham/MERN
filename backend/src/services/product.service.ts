import { Op } from "sequelize";
import {
  Product,
  ProductVariant,
  ProductImage,
  Category,
  Collection,
  AttributeValue,
  Attribute,
} from "../db/models";
import type { ProductCreationAttributes } from "../db/models/product.model";

const ProductModel = Product as typeof Product & {
  findAll: (opts?: object) => Promise<InstanceType<typeof Product>[]>;
  create: (values: ProductCreationAttributes) => Promise<InstanceType<typeof Product>>;
  findByPk: (id: string, opts?: object) => Promise<InstanceType<typeof Product> | null>;
};

export async function list(search?: string) {
  const term = search?.trim() || "";
  const where = term
    ? {
        isActive: true,
        [Op.or]: [
          { title: { [Op.iLike]: `%${term}%` } },
          { description: { [Op.iLike]: `%${term}%` } },
        ],
      }
    : { isActive: true };
  const products = await ProductModel.findAll({
    where: where as object,
    order: [["title", "ASC"]],
    include: [
      { model: Category, as: "category", attributes: ["id", "name", "slug"], required: false },
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
  });
  let result = products.map((p: any) => {
    const sorted = (p.variants || []).sort((a: any, b: any) => Number(a.price) - Number(b.price));
    const v = sorted[0];
    const img = (v?.images || [])[0];
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      categoryId: p.categoryId,
      category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : null,
      price: v ? Number(v.price) : null,
      compareAtPrice: v ? (v.compareAtPrice ? Number(v.compareAtPrice) : null) : null,
      imageUrl: img?.url || null,
    };
  });
  if (term) {
    const categories = await Category.findAll({
      where: { name: { [Op.iLike]: `%${term}%` } },
      attributes: ["id"],
    });
    const categoryIds = categories.map((c: any) => c.id);
    if (categoryIds.length > 0) {
      const byCategory = await ProductModel.findAll({
        where: { isActive: true, categoryId: { [Op.in]: categoryIds } },
        order: [["title", "ASC"]],
        include: [
          { model: Category, as: "category", attributes: ["id", "name", "slug"] },
          {
            model: ProductVariant,
            as: "variants",
            include: [{ model: ProductImage, as: "images", attributes: ["url"] }],
          },
        ],
      });
      const existingIds = new Set(result.map((r: any) => r.id));
      const mapped = byCategory.map((p: any) => {
        const sorted = (p.variants || []).sort((a: any, b: any) => Number(a.price) - Number(b.price));
        const v = sorted[0];
        const img = (v?.images || [])[0];
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          categoryId: p.categoryId,
          category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : null,
          price: v ? Number(v.price) : null,
          compareAtPrice: v ? (v.compareAtPrice ? Number(v.compareAtPrice) : null) : null,
          imageUrl: img?.url || null,
        };
      });
      mapped.forEach((r: any) => {
        if (!existingIds.has(r.id)) {
          result.push(r);
          existingIds.add(r.id);
        }
      });
    }
  }
  return result;
}

export async function create(body: ProductCreationAttributes) {
  return ProductModel.create(body);
}

export async function getById(id: string) {
  const product = await ProductModel.findByPk(id, {
    include: [
      { model: Category, as: "category", attributes: ["id", "name", "slug"] },
      {
        model: ProductVariant,
        as: "variants",
        include: [
          { model: ProductImage, as: "images", order: [["sortOrder", "ASC"]] },
          {
            model: AttributeValue,
            as: "attributeValues",
            through: { attributes: [] },
            include: [{ model: Attribute, as: "attribute", attributes: ["name"] }],
          },
        ],
      },
    ],
  });
  if (!product) return null;
  const p = product as any;
  const variants = (p.variants || []).map((v: any) => ({
    id: v.id,
    sku: v.sku,
    price: Number(v.price),
    compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
    stockQuantity: v.stockQuantity,
    images: (v.images || []).map((i: any) => ({ url: i.url, altText: i.altText })),
    sizes: (v.attributeValues || [])
      .filter((av: any) => av.attribute?.name === "Size")
      .map((av: any) => av.value),
  }));
  const allImages = (p.variants || []).flatMap((v: any) => (v.images || []).map((i: any) => i.url));
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : null,
    variants,
    images: allImages.length ? allImages : [],
    price: variants[0] ? variants[0].price : null,
    compareAtPrice: variants[0]?.compareAtPrice || null,
  };
}

export async function getRelated(productId: string, limit = 6) {
  const product = await ProductModel.findByPk(productId, {
    attributes: ["categoryId"],
    include: [{ model: Collection, as: "collections", through: { attributes: [] }, attributes: ["id"] }],
  });
  if (!product) return [];
  const p = product as any;
  const categoryId = p.categoryId;
  const collectionIds = (p.collections || []).map((c: any) => c.id);
  const where: any = { isActive: true, id: { [Op.ne]: productId } };
  if (categoryId) where.categoryId = categoryId;
  const products = await ProductModel.findAll({
    where,
    order: [["title", "ASC"]],
    limit: limit + 10,
    include: [
      { model: Category, as: "category", attributes: ["id", "name", "slug"], required: false },
      {
        model: ProductVariant,
        as: "variants",
        include: [{ model: ProductImage, as: "images", attributes: ["url"] }],
      },
    ],
  });
  let result = products.map((p: any) => {
    const sorted = (p.variants || []).sort((a: any, b: any) => Number(a.price) - Number(b.price));
    const v = sorted[0];
    const img = (v?.images || [])[0];
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      categoryId: p.categoryId,
      category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : null,
      price: v ? Number(v.price) : null,
      compareAtPrice: v?.compareAtPrice ? Number(v.compareAtPrice) : null,
      imageUrl: img?.url || null,
    };
  });
  if (result.length > limit && collectionIds.length > 0) {
    const withCollection = await ProductModel.findAll({
      where: { isActive: true, id: { [Op.ne]: productId } },
      include: [
        { model: Category, as: "category", attributes: ["id", "name", "slug"], required: false },
        { model: ProductVariant, as: "variants", include: [{ model: ProductImage, as: "images", attributes: ["url"] }] },
        { model: Collection, as: "collections", through: { attributes: [] }, where: { id: { [Op.in]: collectionIds } }, required: true },
      ],
      limit,
    });
    const ids = new Set(result.slice(0, limit).map((r: any) => r.id));
    for (const p of withCollection) {
      const x = p as any;
      if (ids.has(x.id)) continue;
      const sorted = (x.variants || []).sort((a: any, b: any) => Number(a.price) - Number(b.price));
      const v = sorted[0];
      const img = (v?.images || [])[0];
      result.push({
        id: x.id,
        title: x.title,
        slug: x.slug,
        description: x.description,
        categoryId: x.categoryId,
        category: x.category ? { id: x.category.id, name: x.category.name, slug: x.category.slug } : null,
        price: v ? Number(v.price) : null,
        compareAtPrice: v?.compareAtPrice ? Number(v.compareAtPrice) : null,
        imageUrl: img?.url || null,
      });
      ids.add(x.id);
      if (result.length >= limit) break;
    }
  }
  return result.slice(0, limit);
}
