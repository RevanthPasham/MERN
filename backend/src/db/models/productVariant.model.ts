import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface ProductVariantAttributes {
  id: string;
  productId: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  stockQuantity: number;
  weight: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductVariantCreationAttributes = Optional<
  ProductVariantAttributes,
  "id" | "compareAtPrice" | "costPrice" | "weight" | "createdAt" | "updatedAt"
>;

export class ProductVariant
  extends Model<ProductVariantAttributes, ProductVariantCreationAttributes>
  implements ProductVariantAttributes
{
  declare id: string;
  declare productId: string;
  declare sku: string;
  declare price: number;
  declare compareAtPrice: number | null;
  declare costPrice: number | null;
  declare stockQuantity: number;
  declare weight: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ProductVariant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
      references: { model: "products", key: "id" },
      onDelete: "CASCADE",
    },
    sku: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    compareAtPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: "compare_at_price",
    },
    costPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      field: "cost_price",
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "stock_quantity",
    },
    weight: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "product_variants",
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ["sku"], unique: true },
      { fields: ["product_id"] },
    ],
  }
);
