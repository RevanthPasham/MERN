import { pool } from "../../config/db";
import { Product, ProductRow } from "./product.model";

export const createProduct = async (product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<ProductRow> => {
  const query = `
    INSERT INTO products (name, description, categories, price, discount, links, images, size_chart, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    product.name,
    product.description || null,
    product.categories,
    product.price,
    product.discount,
    product.links,
    product.images,
    JSON.stringify(product.sizeChart),
    product.isActive,
  ];

  const result = await pool.query<ProductRow>(query, values);
  return result.rows[0];
};

export const getProductById = async (id: string): Promise<ProductRow | null> => {
  const query = `SELECT * FROM products WHERE id = $1`;
  const result = await pool.query<ProductRow>(query, [id]);
  return result.rows[0] || null;
};

export const getAllProducts = async (
  limit: number,
  offset: number,
  category?: string,
  search?: string
): Promise<ProductRow[]> => {
  let query = `SELECT * FROM products WHERE is_active = true`;
  const values: any[] = [];
  let paramCount = 0;

  if (category) {
    paramCount++;
    query += ` AND $${paramCount} = ANY(categories)`;
    values.push(category);
  }

  if (search) {
    paramCount++;
    query += ` AND to_tsvector('english', name) @@ plainto_tsquery('english', $${paramCount})`;
    values.push(search);
  }

  query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
  values.push(limit, offset);

  const result = await pool.query<ProductRow>(query, values);
  return result.rows;
};

export const getProductsCount = async (category?: string, search?: string): Promise<number> => {
  let query = `SELECT COUNT(*) as count FROM products WHERE is_active = true`;
  const values: any[] = [];
  let paramCount = 0;

  if (category) {
    paramCount++;
    query += ` AND $${paramCount} = ANY(categories)`;
    values.push(category);
  }

  if (search) {
    paramCount++;
    query += ` AND to_tsvector('english', name) @@ plainto_tsquery('english', $${paramCount})`;
    values.push(search);
  }

  const result = await pool.query<{ count: string }>(query, values);
  return parseInt(result.rows[0].count, 10);
};

export const updateProduct = async (
  id: string,
  product: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
): Promise<ProductRow | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCount = 0;

  if (product.name !== undefined) {
    paramCount++;
    fields.push(`name = $${paramCount}`);
    values.push(product.name);
  }

  if (product.description !== undefined) {
    paramCount++;
    fields.push(`description = $${paramCount}`);
    values.push(product.description || null);
  }

  if (product.categories !== undefined) {
    paramCount++;
    fields.push(`categories = $${paramCount}`);
    values.push(product.categories);
  }

  if (product.price !== undefined) {
    paramCount++;
    fields.push(`price = $${paramCount}`);
    values.push(product.price);
  }

  if (product.discount !== undefined) {
    paramCount++;
    fields.push(`discount = $${paramCount}`);
    values.push(product.discount);
  }

  if (product.links !== undefined) {
    paramCount++;
    fields.push(`links = $${paramCount}`);
    values.push(product.links);
  }

  if (product.images !== undefined) {
    paramCount++;
    fields.push(`images = $${paramCount}`);
    values.push(product.images);
  }

  if (product.sizeChart !== undefined) {
    paramCount++;
    fields.push(`size_chart = $${paramCount}`);
    values.push(JSON.stringify(product.sizeChart));
  }

  if (product.isActive !== undefined) {
    paramCount++;
    fields.push(`is_active = $${paramCount}`);
    values.push(product.isActive);
  }

  if (fields.length === 0) {
    return getProductById(id);
  }

  paramCount++;
  values.push(id);
  const query = `UPDATE products SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`;

  const result = await pool.query<ProductRow>(query, values);
  return result.rows[0] || null;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const query = `DELETE FROM products WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rowCount !== null && result.rowCount > 0;
};
