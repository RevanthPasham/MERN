import { sql } from "../../config/neon";

import {
  createProductTable,
  getProductsByCategory,
  insertProduct,
  Product
} from "./products";

import {
  createCollectionTable,
  getCollectionCategories,
  insertCollection,
  Collection
} from "./collection";

/* ---------- INIT ALL TABLES ---------- */

export async function initModels() {
  await sql(createProductTable);
  await sql(createCollectionTable);
}

/* ---------- EXPORT ---------- */

export {
  Product,
  Collection,

  getProductsByCategory,
  insertProduct,

  getCollectionCategories,
  insertCollection
};
