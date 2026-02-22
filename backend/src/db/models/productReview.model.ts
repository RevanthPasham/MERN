import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface ProductReviewAttributes {
  id: string;
  productId: string;
  userId: string | null;
  userName: string | null;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductReviewCreationAttributes = Optional<
  ProductReviewAttributes,
  "id" | "userId" | "userName" | "comment" | "createdAt" | "updatedAt"
>;

export class ProductReview
  extends Model<ProductReviewAttributes, ProductReviewCreationAttributes>
  implements ProductReviewAttributes
{
  declare id: string;
  declare productId: string;
  declare userId: string | null;
  declare userName: string | null;
  declare rating: number;
  declare comment: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ProductReview.init(
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
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "user_id",
      references: { model: "users", key: "id" },
      onDelete: "SET NULL",
    },
    userName: {
      type: DataTypes.STRING(120),
      allowNull: true,
      field: "user_name",
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    comment: {
      type: DataTypes.TEXT,
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
    tableName: "product_reviews",
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ["product_id"] },
      { fields: ["user_id"] },
    ],
  }
);
