import { sql } from "../../config/neon";

import {
  createProductTable,
  getProductsByCategory,
  insertProduct,
  Product
} from "./product";

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

/* ---------- RE-EXPORT EVERYTHING ---------- */

export {
  // types
  Product,
  Collection,

  // product
  getProductsByCategory,
  insertProduct,

  // collection
  getCollectionCategories,
  insertCollection
};
