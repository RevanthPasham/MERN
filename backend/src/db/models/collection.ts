import { pool } from "../../config/db";

export type Collection = {
  id: string;
  name: string;
  image_url: string;
  description: string;
  category: string[];
};

/* ---------- TABLE ---------- */

export const createCollectionTable = `
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  category TEXT[] NOT NULL
);
`;

/* ---------- QUERIES ---------- */

export async function getCollectionCategories(id: string) {
  const result = await pool.query(
    `SELECT category FROM collections WHERE id = $1`,
    [id]
  );

  return result.rows as { category: string[] }[];
}

export async function insertCollection(c: Omit<Collection, "id">) {
  const result = await pool.query(
    `INSERT INTO collections (id, name, image_url, description, category)
     VALUES (gen_random_uuid()::text, $1, $2, $3, $4)
     RETURNING *`,
    [c.name, c.image_url, c.description, c.category]
  );

  return result.rows[0];
}
