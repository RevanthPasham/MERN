import { CartItem, User, Product, ProductVariant, ProductImage } from "../db/models";

export async function listCarts() {
  const items = await CartItem.findAll({
    order: [["updatedAt", "DESC"]],
    include: [
      { model: User, as: "user", attributes: ["id", "email", "name"] },
      {
        model: Product,
        as: "product",
        attributes: ["id", "title", "slug"],
        include: [
          {
            model: ProductVariant,
            as: "variants",
            attributes: ["id", "price"],
            include: [{ model: ProductImage, as: "images", attributes: ["url"], limit: 1 }],
          },
        ],
      },
    ],
  });
  const byUser = new Map<string, { user: any; items: any[] }>();
  for (const item of items as any[]) {
    const uid = item.userId;
    if (!byUser.has(uid)) {
      byUser.set(uid, {
        user: item.user ? { id: item.user.id, email: item.user.email, name: item.user.name } : null,
        items: [],
      });
    }
    const p = item.product;
    const v = (p?.variants || [])[0];
    const img = (v?.images || [])[0];
    byUser.get(uid)!.items.push({
      productId: item.productId,
      productTitle: p?.title,
      productSlug: p?.slug,
      imageUrl: img?.url,
      price: v ? Number(v.price) : null,
      size: item.size,
      quantity: item.quantity,
      updatedAt: item.updatedAt,
    });
  }
  return Array.from(byUser.entries()).map(([userId, data]) => ({
    userId,
    user: data.user,
    items: data.items,
    itemCount: data.items.reduce((sum, i) => sum + i.quantity, 0),
  }));
}
