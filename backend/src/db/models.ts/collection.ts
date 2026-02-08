import { sql } from "../../config/neon";

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
  return sql<{ category: string[] }[]>`
    SELECT category
    FROM collections
    WHERE id = ${id}
  `;
}

export async function insertCollection(c: Omit<Collection, "id">) {
  return sql`
    INSERT INTO collections
    (id, name, image_url, description, category)
    VALUES (
      gen_random_uuid()::text,
      ${c.name},
      ${c.image_url},
      ${c.description},
      ${c.category}
    )
  `;
}
