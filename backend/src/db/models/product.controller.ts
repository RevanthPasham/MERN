// import { pool } from "../config/db";
// import { Product } from "../db/models";

// export const createProduct = async (data: Product) => {
//   const query = `
//     INSERT INTO products
//     (name, description, categories, price, discount, links, images, size_chart, is_active)
//     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
//     RETURNING *
//   `;

//   const values = [
//     data.name,
//     data.description,
//     data.categories,
//     data.price,
//     data.discount,
//     data.links,
//     data.images,
//     JSON.stringify(data.sizeChart),
//     data.isActive,
//   ];

//   const result = await pool.query(query, values);
//   return result.rows[0];
// };

// export const getAllProducts = async () => {
//   const result = await pool.query(`SELECT * FROM products`);
//   return result.rows;
// };

// export const getByCategory = async (cat: string) => {
//   const result = await pool.query(
//     `SELECT * FROM products WHERE $1 = ANY(categories)`,
//     [cat]
//   );

//   return result.rows;
// };
