import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface SizeChartAttributes {
  id: string;
  categoryId: string;
  imageUrl: string | null;
  description: string | null;
}

export type SizeChartCreationAttributes = Optional<
  SizeChartAttributes,
  "id" | "imageUrl" | "description"
>;

export class SizeChart
  extends Model<SizeChartAttributes, SizeChartCreationAttributes>
  implements SizeChartAttributes
{
  declare id: string;
  declare categoryId: string;
  declare imageUrl: string | null;
  declare description: string | null;
}

SizeChart.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "category_id",
      references: { model: "categories", key: "id" },
      onDelete: "CASCADE",
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "image_url",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "size_charts",
    timestamps: false,
    underscored: true,
    indexes: [{ fields: ["category_id"] }],
  }
);
