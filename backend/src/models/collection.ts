export type Collection = {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  categories: string[];
};

export type CreateCollection = Omit<Collection, "id">;

export const collectionSchema = `
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  categories TEXT[] NOT NULL
);
`;
