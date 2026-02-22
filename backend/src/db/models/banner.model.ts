import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface BannerAttributes {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  cta: string;
  collectionSlug: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BannerCreationAttributes = Optional<
  BannerAttributes,
  "id" | "subtitle" | "sortOrder" | "isActive" | "createdAt" | "updatedAt"
>;

export class Banner
  extends Model<BannerAttributes, BannerCreationAttributes>
  implements BannerAttributes
{
  declare id: string;
  declare title: string;
  declare highlight: string;
  declare subtitle: string;
  declare cta: string;
  declare collectionSlug: string;
  declare imageUrl: string;
  declare sortOrder: number;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Banner.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    highlight: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING(120),
      allowNull: true,
      defaultValue: "",
    },
    cta: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    collectionSlug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "collection_slug",
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "image_url",
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "sort_order",
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
    tableName: "banners",
    underscored: true,
    timestamps: true,
    indexes: [{ fields: ["is_active", "sort_order"] }],
  }
);
