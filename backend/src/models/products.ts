export type Product = {
  id: string;
  name: string;
  price: number;
  urls: string[];
  weight: string;
  discount: number;
  category: string;
};

export type CreateProduct = Omit<Product, "id">;

export const productSchema = `
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  urls TEXT[] NOT NULL,
  weight TEXT NOT NULL,
  discount NUMERIC NOT NULL,
  category TEXT NOT NULL
);
`;
