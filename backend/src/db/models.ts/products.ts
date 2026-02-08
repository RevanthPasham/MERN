import { sql } from "../../config/neon";

export type Product = {
  id: string;
  name: string;
  price: number;
  urls: string[];
  weight: string;
  discount: number;
  category: string;
};

/* ---------- TABLE ---------- */

export const createProductTable = `
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

/* ---------- QUERIES ---------- */

export async function getProductsByCategory(category: string) {
  return sql<Product[]>`
    SELECT * FROM products
    WHERE category ILIKE ${category}
  `;
}

export async function insertProduct(p: Omit<Product, "id">) {
  return sql`
    INSERT INTO products
    VALUES (
      gen_random_uuid()::text,
      ${p.name},
      ${p.price},
      ${p.urls},
      ${p.weight},
      ${p.discount},
      ${p.category}
    )
  `;
}
