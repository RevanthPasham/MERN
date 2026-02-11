import { pool } from "../../config/db";

export type ProductDB = {
  id: string;
  name: string;
  price: number;
  urls: string[];
  weight: string;
  discount: number;
  category: string[];
};

/* Table is created in init.ts from model definitions */

/* ---------- QUERIES ---------- */

export async function getProductsByCategory(cat: string) {
  const result = await pool.query(
    `SELECT * FROM products WHERE $1 = ANY(category)`,
    [cat]
  );

  return result.rows as ProductDB[];
}

export async function insertProduct(p: Omit<ProductDB, "id">) {
  const result = await pool.query(
    `INSERT INTO products (id, name, price, urls, weight, discount, category)
     VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [p.name, p.price, p.urls, p.weight, p.discount, p.category]
  );

  return result.rows[0];
}
