import { Category } from "./category.model";
import { Collection } from "./collection.model";
import { Product } from "./product.model";
import { ProductVariant } from "./productVariant.model";
import { Attribute } from "./attribute.model";
import { AttributeValue } from "./attributeValue.model";
import { VariantAttributeValue } from "./variantAttributeValue.model";
import { ProductImage } from "./productImage.model";
import { ProductCollection } from "./productCollection.model";
import { SizeChart } from "./sizeChart.model";
import { sequelize } from "../../config/db";

/* ================= ASSOCIATIONS ================= */

export function associate(): void {
  // Category: self-reference (parent/children)
  Category.hasMany(Category, { foreignKey: "parentId", as: "children" });
  Category.belongsTo(Category, { foreignKey: "parentId", as: "parent" });

  // Category → Products
  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  // Category → SizeChart (one per category)
  Category.hasOne(SizeChart, { foreignKey: "categoryId", as: "sizeChart" });
  SizeChart.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  // Product → Variants
  Product.hasMany(ProductVariant, { foreignKey: "productId", as: "variants" });
  ProductVariant.belongsTo(Product, { foreignKey: "productId", as: "product" });

  // Product ↔ Collections (many-to-many)
  Product.belongsToMany(Collection, {
    through: ProductCollection,
    foreignKey: "productId",
    otherKey: "collectionId",
    as: "collections",
  });
  Collection.belongsToMany(Product, {
    through: ProductCollection,
    foreignKey: "collectionId",
    otherKey: "productId",
    as: "products",
  });

  // ProductVariant → Images
  ProductVariant.hasMany(ProductImage, { foreignKey: "variantId", as: "images" });
  ProductImage.belongsTo(ProductVariant, { foreignKey: "variantId", as: "variant" });

  // Attribute → AttributeValues
  Attribute.hasMany(AttributeValue, { foreignKey: "attributeId", as: "values" });
  AttributeValue.belongsTo(Attribute, { foreignKey: "attributeId", as: "attribute" });

  // ProductVariant ↔ AttributeValues (many-to-many via variant_attribute_values)
  ProductVariant.belongsToMany(AttributeValue, {
    through: VariantAttributeValue,
    foreignKey: "variantId",
    otherKey: "attributeValueId",
    as: "attributeValues",
  });
  AttributeValue.belongsToMany(ProductVariant, {
    through: VariantAttributeValue,
    foreignKey: "attributeValueId",
    otherKey: "variantId",
    as: "variants",
  });
}

/* ================= INIT ================= */

export async function initModels(): Promise<void> {
  associate();
  // force: true = drop and recreate all tables on startup (no manual SQL needed)
  await sequelize.sync({ force: true });
  console.log("Models initialized and synced");
}

/* ================= RE-EXPORTS ================= */

export { Category } from "./category.model";
export { Collection } from "./collection.model";
export { Product } from "./product.model";
export { ProductVariant } from "./productVariant.model";
export { Attribute } from "./attribute.model";
export { AttributeValue } from "./attributeValue.model";
export { VariantAttributeValue } from "./variantAttributeValue.model";
export { ProductImage } from "./productImage.model";
export { ProductCollection } from "./productCollection.model";
export { SizeChart } from "./sizeChart.model";
