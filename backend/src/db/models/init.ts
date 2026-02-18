import { sequelize } from "../../config/db";

import { Category } from "./category.model";
import { Product } from "./product.model";
import { ProductVariant } from "./productVariant.model";
import { ProductImage } from "./productImage.model";

/* ================= RELATIONS ================= */

// Category → Products
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// Product → Variants
Product.hasMany(ProductVariant, { foreignKey: "product_id", as: "variants" });
ProductVariant.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Product → Images
Product.hasMany(ProductImage, { foreignKey: "product_id", as: "images" });
ProductImage.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Variant → Images
ProductVariant.hasMany(ProductImage, { foreignKey: "variant_id", as: "variantImages" });
ProductImage.belongsTo(ProductVariant, { foreignKey: "variant_id", as: "variant" });

/* ================= INIT ================= */

export const initModels = async () => {
  await sequelize.sync({ alter: true });
  console.log("Models initialized");
};
