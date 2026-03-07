import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export type AdminRole = "super_admin" | "admin" | "sub_admin";

export interface AdminAttributes {
  id: string;
  email: string;
  passwordHash: string;
  name: string | null;
  role: AdminRole;
  createdAt: Date;
  updatedAt: Date;
}

export type AdminCreationAttributes = Optional<
  AdminAttributes,
  "id" | "name" | "role" | "createdAt" | "updatedAt"
>;

export class Admin
  extends Model<AdminAttributes, AdminCreationAttributes>
  implements AdminAttributes
{
  declare id: string;
  declare email: string;
  declare passwordHash: string;
  declare name: string | null;
  declare role: AdminRole;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Admin.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: "admin",
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
    tableName: "admins",
    underscored: true,
    timestamps: true,
    indexes: [{ fields: ["email"], unique: true }],
  }
);
