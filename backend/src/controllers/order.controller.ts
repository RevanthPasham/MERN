import { Response, NextFunction } from "express";
import Razorpay from "razorpay";
import * as orderService from "../services/order.service";
import * as refundRequestService from "../services/refundRequest.service";
import { Order } from "../db/models";
import type { AuthRequest } from "../middleware/auth";

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

/** GET /api/orders/payment-status - Check if Razorpay is configured (no auth). */
export const paymentStatus = (_req: AuthRequest, res: Response) => {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const configured = !!(keyId && keySecret);
  res.json({
    success: true,
    data: {
      paymentConfigured: configured,
      message: configured
        ? "Razorpay is configured. You can accept payments."
        : "Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend .env and restart the server.",
    },
  });
};

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keyId || !keySecret) {
      return res.status(503).json({
        success: false,
        error: "Payment is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server .env",
      });
    }
    const amountPaise = Math.round(Number(req.body.amountPaise) || 100);
    const options = {
      amount: Math.max(100, Math.min(amountPaise, 5000000)),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };
    const rzp = getRazorpay();
    if (!rzp) {
      return res.status(503).json({
        success: false,
        error: "Payment is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server .env",
      });
    }
    const order = await rzp.orders.create(options) as { id?: string; amount?: number | string; currency?: string } | null;
    const orderId = (order && typeof order.id === "string" ? order.id : "").trim();
    const rawAmount = order && order.amount != null ? order.amount : options.amount;
    const amount = Math.max(100, Number(rawAmount) || options.amount);
    const currency = (order && typeof order.currency === "string" ? order.currency : "INR").trim();

    if (!orderId) {
      return res.status(500).json({ success: false, error: "Payment gateway did not return order id" });
    }

    res.status(200).json({
      success: true,
      data: {
        orderId,
        amount: Number(amount),
        currency: currency || "INR",
        key: keyId,
      },
    });
  } catch (e: unknown) {
    const err = e as { error?: { description?: string }; message?: string };
    const msg = err?.error?.description || err?.message || "Could not create payment order";
    return res.status(400).json({ success: false, error: String(msg) });
  }
};

/** Call after payment success: records order + items with address and product snapshot */
export const confirmOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
    const { razorpayOrderId, amountPaise, addressId, items } = req.body as {
      razorpayOrderId?: string;
      amountPaise?: number;
      addressId?: string | null;
      items?: { productId: string; quantity: number }[];
    };
    const orderId = razorpayOrderId?.trim();
    const list = Array.isArray(items) ? items : [];
    if (!orderId || list.length === 0) {
      return res.status(400).json({ success: false, error: "razorpayOrderId and items required" });
    }
    const amount = Math.round(Number(amountPaise) || 0);
    const result = await orderService.confirmOrder({
      userId,
      razorpayOrderId: orderId,
      amountPaise: amount,
      addressId: addressId ?? null,
      items: list,
    });
    res.json({ success: true, data: { orderId: result.orderId } });
  } catch (e) {
    next(e);
  }
};

/** GET /api/orders - List authenticated user's orders (order history) */
export const listOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });
    const data = await orderService.listOrdersByUserId(userId);
    return res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};

/** POST /api/orders/:orderId/refund-request - User requests refund for their order (with message) */
export const requestRefund = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId ?? null;
    const orderId = req.params.orderId;
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!orderId) return res.status(400).json({ success: false, error: "Order ID required" });
    if (!message) return res.status(400).json({ success: false, error: "Message required to describe your refund request" });
    const order = await Order.findByPk(orderId, { attributes: ["id", "userId"] });
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    const o = order as { userId?: string | null };
    if (userId && o.userId !== userId) return res.status(403).json({ success: false, error: "You can only request refund for your own orders" });
    const result = await refundRequestService.createRefundRequest(orderId, userId, message);
    return res.status(201).json({ success: true, data: { id: result.id } });
  } catch (e) {
    next(e);
  }
};
