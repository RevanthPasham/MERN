import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface CartItemAttributes {
  id: string;
  userId: string;
  productId: string;
  size: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CartItemCreationAttributes = Optional<
  CartItemAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  declare id: string;
  declare userId: string;
  declare productId: string;
  declare size: string;
  declare quantity: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
      references: { model: "products", key: "id" },
      onDelete: "CASCADE",
    },
    size: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
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
    tableName: "cart_items",
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ["user_id", "product_id", "size"], unique: true },
      { fields: ["user_id"] },
    ],
  }
);
