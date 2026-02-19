import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface ProductImageAttributes {
  id: string;
  variantId: string;
  url: string;
  sortOrder: number;
  altText: string | null;
}

export type ProductImageCreationAttributes = Optional<
  ProductImageAttributes,
  "id" | "sortOrder" | "altText"
>;

export class ProductImage
  extends Model<ProductImageAttributes, ProductImageCreationAttributes>
  implements ProductImageAttributes
{
  declare id: string;
  declare variantId: string;
  declare url: string;
  declare sortOrder: number;
  declare altText: string | null;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    variantId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "variant_id",
      references: { model: "product_variants", key: "id" },
      onDelete: "CASCADE",
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "sort_order",
    },
    altText: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "alt_text",
    },
  },
  {
    sequelize,
    tableName: "product_images",
    timestamps: false,
    underscored: true,
    indexes: [{ fields: ["variant_id"] }],
  }
);
