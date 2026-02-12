import { pool } from "../../config/db";
import { initializeCollectionsTable } from "./collection";

/**
 * Table definitions derived from models only (no separate SQL files).
 * Products table matches ProductRow in product.model.ts
 * Collections table is created from collection.ts model
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

export async function initializeTables(): Promise<void> {
  await pool.query(createProductsTable);
  await initializeCollectionsTable();
  console.log("Tables initialized from models");
}
