import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface ProductVariantAttributes {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  discountPercent: number | null;
  isActive: boolean;
}

type ProductVariantCreationAttributes = Optional<
  ProductVariantAttributes,
  "id" | "comparePrice" | "discountPercent" | "isActive"
>;

export class ProductVariant
  extends Model<ProductVariantAttributes, ProductVariantCreationAttributes>
  implements ProductVariantAttributes
{
  declare id: string;
  declare productId: string;
  declare sku: string;
  declare size: string;
  declare color: string;
  declare price: number;
  declare comparePrice: number | null;
  declare stock: number;
  declare discountPercent: number | null;
  declare isActive: boolean;
}

ProductVariant.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
      references: { model: "products", key: "id" },
      onDelete: "CASCADE",
    },

    sku: { type: DataTypes.STRING, allowNull: false, unique: true },

    size: { type: DataTypes.STRING(10), allowNull: false },
    color: { type: DataTypes.STRING(30), allowNull: false },

    price: { type: DataTypes.FLOAT, allowNull: false },
    comparePrice: { type: DataTypes.FLOAT, allowNull: true, field: "compare_price" },

    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },

    discountPercent: { type: DataTypes.FLOAT, allowNull: true, field: "discount_percent" },

    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: "is_active" },
  },
  {
    sequelize,
    tableName: "product_variants",
    timestamps: false,
    underscored: true,
  }
);
