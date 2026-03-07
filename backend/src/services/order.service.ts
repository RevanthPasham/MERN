import { Order, OrderItem, Product, ProductVariant, Address } from "../db/models";

export interface ConfirmOrderInput {
  userId: string;
  razorpayOrderId: string;
  amountPaise: number;
  addressId?: string | null;
  items: { productId: string; quantity: number }[];
}

export interface OrderItemDto {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderDto {
  id: string;
  addressId: string | null;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: OrderItemDto[];
  address?: {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    area: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    landmark: string | null;
    addressType: string;
  } | null;
}

export async function confirmOrder(input: ConfirmOrderInput): Promise<{ orderId: string }> {
  const { userId, razorpayOrderId, amountPaise, addressId, items } = input;
  const list = Array.isArray(items) ? items : [];
  let totalAmount = 0;
  const itemRows: { productId: string; productName: string; productPrice: number; quantity: number; subtotal: number }[] = [];

  for (const it of list) {
    const productId = it.productId;
    const quantity = Math.max(1, Math.min(99, Number(it.quantity) || 1));
    if (!productId) continue;
    const product = await Product.findByPk(productId, {
      attributes: ["id", "title"],
      include: [{ model: ProductVariant, as: "variants", attributes: ["price"] }],
    });
    if (!product) continue;
    const p = product as any;
    const variants = (p?.variants || []).slice().sort((a: any, b: any) => Number(a?.price ?? 0) - Number(b?.price ?? 0));
    const price = variants[0] ? Number(variants[0].price) : 0;
    const subtotal = price * quantity;
    totalAmount += subtotal;
    itemRows.push({
      productId,
      productName: p.title || "Product",
      productPrice: price,
      quantity,
      subtotal,
    });
  }

  const totalAmountRupees = totalAmount;
  const order = await Order.create({
    userId,
    addressId: addressId || null,
    razorpayOrderId,
    amountPaise,
    totalAmount: totalAmountRupees,
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    orderStatus: "Processing",
    status: "paid",
  });

  const orderId = (order as any).id;
  for (const row of itemRows) {
    await OrderItem.create({
      orderId,
      productId: row.productId,
      productName: row.productName,
      productPrice: row.productPrice,
      quantity: row.quantity,
      subtotal: row.subtotal,
    });
  }

  return { orderId };
}

export async function listOrdersByUserId(userId: string): Promise<OrderDto[]> {
  const orders = await Order.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    include: [
      { model: OrderItem, as: "items", attributes: ["id", "productId", "productName", "productPrice", "quantity", "subtotal"] },
      {
        model: Address,
        as: "address",
        attributes: ["fullName", "phoneNumber", "streetAddress", "area", "city", "state", "postalCode", "country", "landmark", "addressType"],
        required: false,
      },
    ],
  });

  return orders.map((o: any) => ({
    id: o.id,
    addressId: o.addressId,
    totalAmount: Number(o.totalAmount ?? 0),
    paymentMethod: o.paymentMethod ?? "razorpay",
    paymentStatus: o.paymentStatus ?? "paid",
    orderStatus: o.orderStatus ?? "Processing",
    createdAt: o.createdAt?.toISOString?.() ?? new Date().toISOString(),
    items: (o.items || []).map((i: any) => ({
      id: i.id,
      productId: i.productId,
      productName: i.productName ?? "",
      productPrice: Number(i.productPrice ?? 0),
      quantity: i.quantity,
      subtotal: Number(i.subtotal ?? 0),
    })),
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
          addressType: o.address.addressType,
        }
      : null,
  }));
}
