import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface AttributeValueAttributes {
  id: string;
  attributeId: string;
  value: string;
}

export type AttributeValueCreationAttributes = Optional<
  AttributeValueAttributes,
  "id"
>;

export class AttributeValue
  extends Model<AttributeValueAttributes, AttributeValueCreationAttributes>
  implements AttributeValueAttributes
{
  declare id: string;
  declare attributeId: string;
  declare value: string;
}

AttributeValue.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    attributeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "attribute_id",
      references: { model: "attributes", key: "id" },
      onDelete: "CASCADE",
    },
    value: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "attribute_values",
    timestamps: false,
    underscored: true,
    indexes: [
      { fields: ["attribute_id"] },
      { unique: true, fields: ["attribute_id", "value"] },
    ],
  }
);
