import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface ProductImageAttributes {
  id: string;
  productId: string;
  variantId: string | null;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

type ProductImageCreationAttributes = Optional<ProductImageAttributes, "id" | "variantId" | "isPrimary" | "sortOrder">;

export class ProductImage
  extends Model<ProductImageAttributes, ProductImageCreationAttributes>
  implements ProductImageAttributes
{
  declare id: string;
  declare productId: string;
  declare variantId: string | null;
  declare imageUrl: string;
  declare isPrimary: boolean;
  declare sortOrder: number;
}

ProductImage.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
      references: { model: "products", key: "id" },
      onDelete: "CASCADE",
    },

    variantId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "variant_id",
      references: { model: "product_variants", key: "id" },
      onDelete: "CASCADE",
    },

    imageUrl: { type: DataTypes.TEXT, allowNull: false, field: "image_url" },

    isPrimary: { type: DataTypes.BOOLEAN, defaultValue: false, field: "is_primary" },

    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: "sort_order" },
  },
  {
    sequelize,
    tableName: "product_images",
    timestamps: false,
    underscored: true,
  }
);
