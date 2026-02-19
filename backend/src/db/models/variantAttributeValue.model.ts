import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface VariantAttributeValueAttributes {
  id: string;
  variantId: string;
  attributeValueId: string;
}

export type VariantAttributeValueCreationAttributes = Optional<
  VariantAttributeValueAttributes,
  "id"
>;

export class VariantAttributeValue
  extends Model<
    VariantAttributeValueAttributes,
    VariantAttributeValueCreationAttributes
  >
  implements VariantAttributeValueAttributes
{
  declare id: string;
  declare variantId: string;
  declare attributeValueId: string;
}

VariantAttributeValue.init(
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
    attributeValueId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "attribute_value_id",
      references: { model: "attribute_values", key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "variant_attribute_values",
    timestamps: false,
    underscored: true,
    indexes: [
      { fields: ["variant_id"] },
      { fields: ["attribute_value_id"] },
      { unique: true, fields: ["variant_id", "attribute_value_id"] },
    ],
  }
);
