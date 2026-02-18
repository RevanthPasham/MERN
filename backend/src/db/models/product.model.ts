import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export type GenderType = "MEN" | "WOMEN" | "UNISEX" | "KIDS";

export interface ProductAttributes {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  genderType: GenderType | null;
  categoryId: string | null;
  ratingAvg: number;
  ratingCount: number;
  createdAt?: Date;
}

type ProductCreationAttributes = Optional<
  ProductAttributes,
  "id" | "description" | "genderType" | "categoryId" | "ratingAvg" | "ratingCount" | "createdAt"
>;

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: string;
  declare name: string;
  declare slug: string;
  declare description: string | null;
  declare genderType: GenderType | null;
  declare categoryId: string | null;
  declare ratingAvg: number;
  declare ratingCount: number;
  declare createdAt: Date;
}

Product.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

    name: { type: DataTypes.STRING(150), allowNull: false },

    slug: { type: DataTypes.STRING(160), allowNull: false, unique: true },

    description: { type: DataTypes.TEXT, allowNull: true },

    genderType: {
      type: DataTypes.ENUM("MEN", "WOMEN", "UNISEX", "KIDS"),
      allowNull: true,
      field: "gender_type",
    },

    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "category_id",
      references: { model: "categories", key: "id" },
      onDelete: "SET NULL",
    },

    ratingAvg: { type: DataTypes.FLOAT, defaultValue: 0, field: "rating_avg" },
    ratingCount: { type: DataTypes.INTEGER, defaultValue: 0, field: "rating_count" },

    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: "created_at" },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: false,
    underscored: true,
  }
);
