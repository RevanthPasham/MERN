import { model, Schema, Document } from "mongoose";

export interface ICollection extends Document {
  name: string;
  imageUrl: string;
  category: string[];
  description: string;
}

const CollectionsSchema = new Schema<ICollection>(
  {
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    category: { type: [String], required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export default model<ICollection>("Collections", CollectionsSchema);
