import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

/**
 * BannerAttributes defines all fields stored in the database
 */
export interface BannerAttributes {
  id: string;
  title: string; // Main banner title
  highlight: string; // Highlighted text (e.g., bold/colored part)
  subtitle: string; // Optional subtitle text
  cta: string; // Call-to-action text (e.g., "Shop Now")
  collectionSlug: string; // Slug to link banner to a collection
  imageUrl: string | null; // Banner image URL
  sortOrder: number; // Order for displaying banners
  isActive: boolean; // Whether banner is active or not
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fields that are optional when creating a new Banner
 */
export type BannerCreationAttributes = Optional<
  BannerAttributes,
  "id" | "subtitle" | "sortOrder" | "isActive" | "createdAt" | "updatedAt"
>;

/**
 * Banner model class extending Sequelize Model
 */
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

/**
 * Initialize Banner model with schema definition
 */
Banner.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // Main title of the banner
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },

    // Highlighted portion of the title
    highlight: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },

    // Optional subtitle text
    subtitle: {
      type: DataTypes.STRING(120),
      allowNull: true,
      defaultValue: "",
    },

    // CTA button text
    cta: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },

    // Slug referencing a collection
    collectionSlug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "collection_slug",
    },

    // Banner image URL
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "image_url",
    },

    // Determines display order of banners
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "sort_order",
    },

    // Whether banner is active
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },

    // Timestamp when created
    createdAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      field: "created_at",
    },

    // Timestamp when updated
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

    // Index for faster filtering by active status and sorting
    indexes: [{ fields: ["is_active", "sort_order"] }],
  }
);
