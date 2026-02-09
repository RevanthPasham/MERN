



import { sql } from "../../config/neon";

import { createProductTable } from "./products";
import { createCollectionTable } from "./collection";

/* ---------- INIT ALL TABLES ---------- */

export async function initModels() {
  await sql.unsafe(createProductTable);
  await sql.unsafe(createCollectionTable);
}

// Export query functions
export { insertProduct, getProductsByCategory } from "./products";
export { insertCollection, getCollectionCategories } from "./collection";
