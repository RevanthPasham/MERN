import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface AttributeAttributes {
  id: string;
  name: string;
}

export type AttributeCreationAttributes = Optional<AttributeAttributes, "id">;

export class Attribute
  extends Model<AttributeAttributes, AttributeCreationAttributes>
  implements AttributeAttributes
{
  declare id: string;
  declare name: string;
}

Attribute.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "attributes",
    timestamps: false,
  }
);
