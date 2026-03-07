import { Order, OrderItem, User, Address } from "../db/models";
import { Op } from "sequelize";

export type OrderStatusFilter = "all" | "new" | "completed";

const NEW_STATUSES = ["Processing", "Shipped"];
const COMPLETED_STATUSES = ["Delivered"];

export async function listOrders(filter: OrderStatusFilter = "all") {
  const where: { orderStatus?: { [Op.in]: string[] } } = {};
  if (filter === "new") where.orderStatus = { [Op.in]: NEW_STATUSES };
  if (filter === "completed") where.orderStatus = { [Op.in]: COMPLETED_STATUSES };

  const orders = await Order.findAll({
    where: Object.keys(where).length ? where : undefined,
    order: [["createdAt", "DESC"]],
    include: [
      { model: User, as: "user", attributes: ["id", "email", "name"], required: false },
      { model: Address, as: "address", required: false },
      { model: OrderItem, as: "items" },
    ],
  });

  return orders.map((o: any) => ({
    id: o.id,
    userId: o.userId,
    user: o.user ? { id: o.user.id, email: o.user.email, name: o.user.name } : null,
    addressId: o.addressId,
    address: o.address
      ? {
          fullName: o.address.fullName,
          phoneNumber: o.address.phoneNumber,
          streetAddress: o.address.streetAddress,
          area: o.address.area,
          city: o.address.city,
          state: o.address.state,
          postalCode: o.address.postalCode,
          country: o.address.country,
          landmark: o.address.landmark,
        }
      : null,
    totalAmount: Number(o.totalAmount ?? 0),
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    orderStatus: o.orderStatus,
    createdAt: o.createdAt,
    items: (o.items || []).map((i: any) => ({
      id: i.id,
      productId: i.productId,
      productName: i.productName,
      productPrice: Number(i.productPrice),
      quantity: i.quantity,
      subtotal: Number(i.subtotal),
    })),
  }));
}

export async function getOrderById(id: string) {
  const order = await Order.findByPk(id, {
    include: [
      { model: User, as: "user", attributes: ["id", "email", "name"] },
      { model: Address, as: "address" },
      { model: OrderItem, as: "items" },
    ],
  });
  if (!order) return null;
  const o = order as any;
  return {
    id: o.id,
    userId: o.userId,
    user: o.user ? { id: o.user.id, email: o.user.email, name: o.user.name } : null,
    address: o.address,
    totalAmount: Number(o.totalAmount),
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    orderStatus: o.orderStatus,
    createdAt: o.createdAt,
    items: (o.items || []).map((i: any) => ({
      id: i.id,
      productId: i.productId,
      productName: i.productName,
      productPrice: Number(i.productPrice),
      quantity: i.quantity,
      subtotal: Number(i.subtotal),
    })),
  };
}

export async function updateOrderStatus(id: string, orderStatus: string) {
  const order = await Order.findByPk(id);
  if (!order) return null;
  const allowed = ["Processing", "Shipped", "Delivered"];
  const status = allowed.includes(orderStatus) ? orderStatus : "Processing";
  await (order as any).update({ orderStatus: status });
  return getOrderById(id);
}
