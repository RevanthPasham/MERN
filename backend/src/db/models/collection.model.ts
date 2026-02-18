import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface CollectionAttributes {
  id: string;
  name: string;
  image_url: string;
  description: string;
  category: string[];
}

type CollectionCreationAttributes = Optional<CollectionAttributes, "id">;

export class Collection
  extends Model<CollectionAttributes, CollectionCreationAttributes>
  implements CollectionAttributes
{
  declare id: string;
  declare name: string;
  declare image_url: string;
  declare description: string;
  declare category: string[];
}

Collection.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "image_url",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: "collections",
    timestamps: false,
    underscored: true,
  }
);
