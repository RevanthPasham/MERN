import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface OrderItemAttributes {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderItemCreationAttributes = Optional<
  OrderItemAttributes,
  "id" | "productName" | "productPrice" | "subtotal" | "createdAt" | "updatedAt"
>;

export class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes
{
  declare id: string;
  declare orderId: string;
  declare productId: string;
  declare productName: string;
  declare productPrice: number;
  declare quantity: number;
  declare subtotal: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "order_id",
      references: { model: "orders", key: "id" },
      onDelete: "CASCADE",
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
      references: { model: "products", key: "id" },
      onDelete: "CASCADE",
    },
    productName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      field: "product_name",
    },
    productPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: "product_price",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: "subtotal",
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
    tableName: "order_items",
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ["order_id"] },
      { fields: ["product_id"] },
    ],
  }
);
