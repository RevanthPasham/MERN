import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface CategoryAttributes {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  createdAt?: Date;
}

type CategoryCreationAttributes = Optional<CategoryAttributes, "id" | "parentId" | "createdAt">;

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  declare id: string;
  declare name: string;
  declare slug: string;
  declare parentId: string | null;
  declare createdAt: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },

    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "parent_id",
      references: { model: "categories", key: "id" },
      onDelete: "SET NULL",
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    sequelize,
    tableName: "categories",
    timestamps: false,
    underscored: true,
  }
);
