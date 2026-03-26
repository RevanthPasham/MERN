import { Order, OrderItem, Product } from "../db/models";
import { Op } from "sequelize";

export async function getAnalytics() {
  const orders = await Order.findAll({
    where: { paymentStatus: "paid" },
    attributes: ["id", "totalAmount", "orderStatus", "createdAt"],
    include: [{ model: OrderItem, as: "items", attributes: ["productId", "productName", "quantity", "subtotal"] }],
  });

  let totalRevenue = 0;
  const productSales = new Map<string, { productName: string; quantity: number; revenue: number }>();

  for (const o of orders as any[]) {
    totalRevenue += Number(o.totalAmount ?? 0);
    for (const item of o.items || []) {
      const pid = item.productId;
      const name = item.productName || "Unknown";
      const qty = Number(item.quantity) || 0;
      const rev = Number(item.subtotal) || 0;
      if (!productSales.has(pid)) {
        productSales.set(pid, { productName: name, quantity: 0, revenue: 0 });
      }
      const rec = productSales.get(pid)!;
      rec.quantity += qty;
      rec.revenue += rev;
    }
  }

  const byQuantity = Array.from(productSales.entries())
    .map(([productId, data]) => ({ productId, ...data }))
    .sort((a, b) => b.quantity - a.quantity);

  const topSelling = byQuantity.slice(0, 20);
  const leastSelling = byQuantity.slice(-20).reverse();

  const byStatus = new Map<string, number>();
  for (const o of orders as any[]) {
    const s = o.orderStatus || "Unknown";
    byStatus.set(s, (byStatus.get(s) || 0) + 1);
  }

  return {
    totalRevenue,
    totalOrders: orders.length,
    ordersByStatus: Object.fromEntries(byStatus),
    topSelling,
    leastSelling,
  };
}

export async function getExportCsv(): Promise<string> {
  const orders = await Order.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      { model: OrderItem, as: "items" },
    ],
  });

  const rows: string[] = [];
  const header = "Order ID,Date,Status,Total,Payment,Items";
  rows.push(header);

  for (const o of orders as any[]) {
    const date = o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : "";
    const total = Number(o.totalAmount ?? 0).toFixed(2);
    const itemsStr = (o.items || []).map((i: any) => `${i.productName} x${i.quantity}`).join("; ");
    const line = [o.id, date, o.orderStatus || "", total, o.paymentStatus || "", `"${itemsStr.replace(/"/g, '""')}"`].join(",");
    rows.push(line);
  }

  return rows.join("\n");
}
