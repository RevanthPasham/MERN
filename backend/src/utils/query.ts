import { pool } from "../config/db";

export async function query<T>(text: string, params?: any[]): Promise<T[]> {
  const { rows } = await pool.query(text, params);
  return rows;
}
