import { Schema, model, InferSchemaType } from "mongoose";

const CollectionsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


export type ICollection = InferSchemaType<typeof CollectionsSchema>;

const CollectionsModel = model("Collections", CollectionsSchema);

export default CollectionsModel;
