import { sql } from "../../config/neon";

export type Collection = {
  id: string;
  name: string;
  image_url: string;
  description: string;
  categories: string[];
};

/* ---------- TABLE ---------- */

export const createCollectionTable = `
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  categories TEXT[] NOT NULL
);
`;

/* ---------- QUERIES ---------- */

export async function getCollectionCategories(id: string) {
  return sql<{ categories: string[] }[]>`
    SELECT categories
    FROM collections
    WHERE id = ${id}
  `;
}

export async function insertCollection(c: Omit<Collection, "id">) {
  return sql`
    INSERT INTO collections
    VALUES (
      gen_random_uuid()::text,
      ${c.name},
      ${c.image_url},
      ${c.description},
      ${c.categories}
    )
  `;
}
