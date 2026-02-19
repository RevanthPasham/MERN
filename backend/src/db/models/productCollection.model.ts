import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/db";

export interface ProductCollectionAttributes {
  id: string;
  productId: string;
  collectionId: string;
}

export type ProductCollectionCreationAttributes = Optional<
  ProductCollectionAttributes,
  "id"
>;

export class ProductCollection
  extends Model<
    ProductCollectionAttributes,
    ProductCollectionCreationAttributes
  >
  implements ProductCollectionAttributes
{
  declare id: string;
  declare productId: string;
  declare collectionId: string;
}

ProductCollection.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "product_id",
      references: { model: "products", key: "id" },
      onDelete: "CASCADE",
    },
    collectionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "collection_id",
      references: { model: "collections", key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "product_collections",
    timestamps: false,
    underscored: true,
    indexes: [
      { fields: ["product_id"] },
      { fields: ["collection_id"] },
      { unique: true, fields: ["product_id", "collection_id"] },
    ],
  }
);
