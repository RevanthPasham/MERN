import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface CollectionAttributes {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bannerImage: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CollectionCreationAttributes = Optional<
  CollectionAttributes,
  "id" | "description" | "bannerImage" | "isActive" | "createdAt" | "updatedAt"
>;

export class Collection
  extends Model<CollectionAttributes, CollectionCreationAttributes>
  implements CollectionAttributes
{
  declare id: string;
  declare name: string;
  declare slug: string;
  declare description: string | null;
  declare bannerImage: string | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Collection.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bannerImage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "banner_image",
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
    tableName: "collections",
    underscored: true,
    timestamps: true,
    indexes: [{ fields: ["slug"], unique: true }, { fields: ["is_active"] }],
  }
);
