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
import { User } from "./user.model";
import { Banner } from "./banner.model";
import { ProductReview } from "./productReview.model";
import { Order } from "./order.model";
import { OrderItem } from "./orderItem.model";
import { CartItem } from "./cartItem.model";
import { Address } from "./address.model";
import { Admin } from "./admin.model";
import { sequelize } from "../../config/db";

/* ================= ASSOCIATIONS ================= */

let associationsRegistered = false;

export function associate(): void {
  if (associationsRegistered) return;
  associationsRegistered = true;
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

  Product.hasMany(ProductReview, { foreignKey: "productId", as: "reviews" });
  ProductReview.belongsTo(Product, { foreignKey: "productId", as: "product" });
  User.hasMany(ProductReview, { foreignKey: "userId", as: "reviews" });
  ProductReview.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
  Address.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(Order, { foreignKey: "userId", as: "orders" });
  Order.belongsTo(User, { foreignKey: "userId", as: "user" });
  Order.belongsTo(Address, { foreignKey: "addressId", as: "address" });
  Address.hasMany(Order, { foreignKey: "addressId", as: "orders" });
  Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
  OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });
  OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
  Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });

  User.hasMany(CartItem, { foreignKey: "userId", as: "cartItems" });
  CartItem.belongsTo(User, { foreignKey: "userId", as: "user" });
  CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
  Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems" });
}

/* ================= INIT ================= */

/** Associations + authenticate only. No sync here (use migrations / local server.ts / seed). */
export async function initModels(): Promise<void> {
  associate();
  await sequelize.authenticate();
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
export { User } from "./user.model";
export { Banner } from "./banner.model";
export { ProductReview } from "./productReview.model";
export { Order } from "./order.model";
export { OrderItem } from "./orderItem.model";
export { CartItem } from "./cartItem.model";
export { Address } from "./address.model";
export { Admin } from "./admin.model";