import { QueryTypes } from "sequelize";
import { sequelize } from "../config/db";

export interface RefundRequestRow {
  id: string;
  order_id: string;
  user_id: string | null;
  message: string;
  status: string;
  created_at: Date;
  order_total?: number;
  order_status?: string;
  user_email?: string | null;
  user_name?: string | null;
  phone_number?: string | null;
  address_full_name?: string | null;
  items?: { productName: string; quantity: number; subtotal: number; productId: string }[];
}

export async function createRefundRequest(orderId: string, userId: string | null, message: string): Promise<{ id: string }> {
  const msg = (message || "").trim().slice(0, 4000);
  const rows = await sequelize.query<{ id: string }>(
    `INSERT INTO refund_requests (order_id, user_id, message, status, updated_at)
     VALUES (:orderId, :userId, :message, 'pending', NOW())
     RETURNING id`,
    { type: QueryTypes.SELECT, replacements: { orderId, userId: userId || null, message: msg } }
  );
  const row = Array.isArray(rows) ? rows[0] : (rows as any)?.[0];
  if (!row?.id) throw new Error("Refund request could not be created");
  return { id: row.id };
}

export async function listRefundRequestsForAdmin(): Promise<RefundRequestRow[]> {
  const [rows] = await sequelize.query(
    `SELECT rr.id, rr.order_id, rr.user_id, rr.message, rr.status, rr.created_at,
            o.total_amount AS order_total, o.order_status, o.address_id,
            u.email AS user_email, u.name AS user_name,
            a.phone_number AS phone_number, a.full_name AS address_full_name
     FROM refund_requests rr
     JOIN orders o ON o.id = rr.order_id
     LEFT JOIN users u ON u.id = rr.user_id
     LEFT JOIN addresses a ON a.id = o.address_id
     ORDER BY rr.created_at DESC`
  );
  const list = (Array.isArray(rows) ? rows : []) as (RefundRequestRow & { order_id: string })[];
  const orderIds = [...new Set(list.map((r) => r.order_id))];
  const itemsByOrder: Record<string, { productName: string; quantity: number; subtotal: number; productId: string }[]> = {};
  if (orderIds.length > 0) {
    const itemRows = await sequelize.query(
      `SELECT order_id, product_name, quantity, subtotal, product_id FROM order_items WHERE order_id = ANY(:orderIds)`,
      { type: QueryTypes.SELECT, replacements: { orderIds } }
    );
    const items = (Array.isArray(itemRows) ? itemRows : []) as { order_id: string; product_name: string; quantity: number; subtotal: number; product_id: string }[];
    for (const it of items) {
      if (!itemsByOrder[it.order_id]) itemsByOrder[it.order_id] = [];
      itemsByOrder[it.order_id].push({
        productName: it.product_name ?? "",
        quantity: it.quantity,
        subtotal: it.subtotal,
        productId: it.product_id,
      });
    }
  }
  return list.map((r) => ({
    ...r,
    items: itemsByOrder[r.order_id] || [],
  }));
}

export async function updateRefundRequestStatus(id: string, status: string): Promise<boolean> {
  const rows = await sequelize.query(
    `UPDATE refund_requests SET status = :status, updated_at = NOW() WHERE id = :id RETURNING id`,
    { type: QueryTypes.SELECT, replacements: { id, status: status === "approved" || status === "rejected" ? status : "pending" } }
  );
  return Array.isArray(rows) ? rows.length > 0 : false;
}
