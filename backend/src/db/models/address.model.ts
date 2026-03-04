import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export const ADDRESS_TYPES = ["Home", "Work", "Other"] as const;
export type AddressType = (typeof ADDRESS_TYPES)[number];

export interface AddressAttributes {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  area: string;
  streetAddress: string;
  landmark: string | null;
  postalCode: string;
  addressType: AddressType;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AddressCreationAttributes = Optional<
  AddressAttributes,
  "id" | "landmark" | "isDefault" | "createdAt" | "updatedAt"
>;

export class Address
  extends Model<AddressAttributes, AddressCreationAttributes>
  implements AddressAttributes
{
  declare id: string;
  declare userId: string;
  declare fullName: string;
  declare phoneNumber: string;
  declare country: string;
  declare state: string;
  declare city: string;
  declare area: string;
  declare streetAddress: string;
  declare landmark: string | null;
  declare postalCode: string;
  declare addressType: AddressType;
  declare isDefault: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Address.init(
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
    fullName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: "full_name",
    },
    phoneNumber: {
      type: DataTypes.STRING(24),
      allowNull: false,
      field: "phone_number",
    },
    country: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    streetAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "street_address",
    },
    landmark: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "postal_code",
    },
    addressType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "Home",
      field: "address_type",
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_default",
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
    tableName: "addresses",
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["user_id", "is_default"] },
    ],
  }
);
