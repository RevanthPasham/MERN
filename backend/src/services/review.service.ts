import { ProductReview, Order, OrderItem } from "../db/models";
import { Op } from "sequelize";
import { AppError } from "../utils/errors";

export async function getByProductId(productId: string) {
  const reviews = await ProductReview.findAll({
    where: { productId },
    order: [["createdAt", "DESC"]],
    attributes: ["id", "productId", "userId", "userName", "rating", "comment", "createdAt"],
  });
  const list = reviews.map((r: any) => ({
    id: r.id,
    productId: r.productId,
    userId: r.userId,
    userName: r.userName ?? "Guest",
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
  }));
  const total = list.length;
  const averageRating =
    total > 0 ? list.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  return {
    reviews: list,
    totalReviews: total,
    averageRating: Math.round(averageRating * 10) / 10,
  };
}

export async function canUserReview(productId: string, userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  const paidOrders = await Order.findAll({
    where: { userId, status: "paid" },
    attributes: ["id"],
  });
  const orderIds = paidOrders.map((o: any) => o.id);
  if (orderIds.length === 0) return false;
  const count = await OrderItem.count({
    where: { productId, orderId: { [Op.in]: orderIds } },
  });
  return count > 0;
}

export async function create(
  productId: string,
  data: { rating: number; comment?: string | null; userId?: string | null; userName?: string | null },
  options?: { requirePurchase?: boolean }
) {
  if (options?.requirePurchase && data.userId) {
    const allowed = await canUserReview(productId, data.userId);
    if (!allowed) throw new AppError("Only customers who have purchased this product can leave a review", 403);
  }
  const review = await ProductReview.create({
    productId,
    userId: data.userId ?? null,
    userName: data.userName ?? null,
    rating: Math.min(5, Math.max(1, data.rating)),
    comment: data.comment ?? null,
  });
  return {
    id: review.id,
    productId: review.productId,
    userId: (review as any).userId,
    userName: (review as any).userName ?? "Guest",
    rating: (review as any).rating,
    comment: (review as any).comment,
    createdAt: (review as any).createdAt,
  };
}
