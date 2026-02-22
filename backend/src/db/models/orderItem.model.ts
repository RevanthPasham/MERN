import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface OrderItemAttributes {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderItemCreationAttributes = Optional<
  OrderItemAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes
{
  declare id: string;
  declare orderId: string;
  declare productId: string;
  declare quantity: number;
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
    tableName: "order_items",
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ["order_id"] },
      { fields: ["product_id"] },
    ],
  }
);
