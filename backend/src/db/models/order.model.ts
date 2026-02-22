import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface OrderAttributes {
  id: string;
  userId: string | null;
  razorpayOrderId: string;
  amountPaise: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderCreationAttributes = Optional<
  OrderAttributes,
  "id" | "userId" | "status" | "createdAt" | "updatedAt"
>;

export class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  declare id: string;
  declare userId: string | null;
  declare razorpayOrderId: string;
  declare amountPaise: number;
  declare status: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "user_id",
      references: { model: "users", key: "id" },
      onDelete: "SET NULL",
    },
    razorpayOrderId: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "razorpay_order_id",
    },
    amountPaise: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "amount_paise",
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "paid",
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
    tableName: "orders",
    underscored: true,
    timestamps: true,
    indexes: [{ fields: ["user_id"] }, { fields: ["razorpay_order_id"] }],
  }
);
