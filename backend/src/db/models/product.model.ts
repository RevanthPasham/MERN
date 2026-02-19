import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface ProductAttributes {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  categoryId: string | null;
  brand: string | null;
  material: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCreationAttributes = Optional<
  ProductAttributes,
  "id" | "description" | "categoryId" | "brand" | "material" | "isActive" | "createdAt" | "updatedAt"
>;

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: string;
  declare title: string;
  declare slug: string;
  declare description: string | null;
  declare categoryId: string | null;
  declare brand: string | null;
  declare material: string | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "category_id",
      references: { model: "categories", key: "id" },
      onDelete: "SET NULL",
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
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
    tableName: "products",
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ["slug"], unique: true },
      { fields: ["category_id"] },
      { fields: ["is_active"] },
    ],
  }
);
