import { pool } from "../../config/db";

/**
 * Table definitions derived from models only (no separate SQL files).
 * Products table matches ProductRow in product.model.ts
 * Collections table matches Collection in collection.ts
 */

const createProductsTable = `
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  categories TEXT[] NOT NULL DEFAULT '{}',
  price NUMERIC[] NOT NULL DEFAULT '{}',
  discount NUMERIC[] NOT NULL DEFAULT '{}',
  links TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  size_chart JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

const createCollectionsTable = `
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  category TEXT[] NOT NULL
);
`;

export async function initializeTables(): Promise<void> {
  await pool.query(createProductsTable);
  await pool.query(createCollectionsTable);
  console.log("Tables initialized from models");
}
