import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface OrderAttributes {
  id: string;
  userId: string | null;
  addressId: string | null;
  razorpayOrderId: string;
  amountPaise: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  status: string; // legacy, kept for backward compatibility
  createdAt: Date;
  updatedAt: Date;
}

export type OrderCreationAttributes = Optional<
  OrderAttributes,
  "id" | "userId" | "addressId" | "status" | "paymentMethod" | "paymentStatus" | "orderStatus" | "createdAt" | "updatedAt"
>;

export class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  declare id: string;
  declare userId: string | null;
  declare addressId: string | null;
  declare razorpayOrderId: string;
  declare amountPaise: number;
  declare totalAmount: number;
  declare paymentMethod: string;
  declare paymentStatus: string;
  declare orderStatus: string;
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
    addressId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "address_id",
      references: { model: "addresses", key: "id" },
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
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: "total_amount",
    },
    paymentMethod: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "razorpay",
      field: "payment_method",
    },
    paymentStatus: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "paid",
      field: "payment_status",
    },
    orderStatus: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "Processing",
      field: "order_status",
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
    indexes: [{ fields: ["user_id"] }, { fields: ["address_id"] }, { fields: ["razorpay_order_id"] }],
  }
);
