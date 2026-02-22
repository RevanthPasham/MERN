import { CartItem, Product, ProductVariant, ProductImage } from "../db/models";
import { isValidUUID } from "../utils/uuid";

export interface CartItemDto {
  product: { id: string; title: string; price: number; images: string[] };
  quantity: number;
  size: string;
}

function toCartItemDto(row: any): CartItemDto {
  const p = row.product;
  const variants = (p?.variants || []).sort((a: any, b: any) => Number(a?.price ?? 0) - Number(b?.price ?? 0));
  const v = variants[0];
  const imgs = (v?.images || []).map((i: any) => i?.url).filter(Boolean);
  return {
    product: {
      id: p?.id ?? row.productId,
      title: p?.title ?? "",
      price: v ? Number(v.price) : 0,
      images: imgs,
    },
    quantity: Number(row.quantity) || 1,
    size: String(row.size || ""),
  };
}

export async function getCart(userId: string): Promise<CartItemDto[]> {
  const items = await CartItem.findAll({
    where: { userId },
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "title"],
        required: true,
        include: [
          {
            model: ProductVariant,
            as: "variants",
            attributes: ["price"],
            include: [{ model: ProductImage, as: "images", attributes: ["url"] }],
          },
        ],
      },
    ],
  });
  return items.map((i: any) => toCartItemDto(i));
}

export async function addItem(
  userId: string,
  productId: string,
  size: string,
  quantity: number
): Promise<CartItemDto[]> {
  if (!isValidUUID(productId)) throw new Error("Invalid product id");
  const sizeStr = String(size || "S").trim().slice(0, 20);
  const qty = Math.max(1, Math.min(99, Math.round(Number(quantity)) || 1));

  const [item, created] = await CartItem.findOrCreate({
    where: { userId, productId, size: sizeStr },
    defaults: { userId, productId, size: sizeStr, quantity: qty },
  });
  if (!created) await item.update({ quantity: item.quantity + qty });
  return getCart(userId);
}

export async function updateItem(
  userId: string,
  productId: string,
  size: string,
  delta: number
): Promise<CartItemDto[]> {
  if (!isValidUUID(productId)) throw new Error("Invalid product id");
  const sizeStr = String(size || "").trim().slice(0, 20);
  const item = await CartItem.findOne({
    where: { userId, productId, size: sizeStr },
  });
  if (!item) return getCart(userId);
  const newQty = Math.max(0, item.quantity + delta);
  if (newQty === 0) await item.destroy();
  else await item.update({ quantity: newQty });
  return getCart(userId);
}

export async function removeItem(
  userId: string,
  productId: string,
  size: string
): Promise<CartItemDto[]> {
  if (!isValidUUID(productId)) throw new Error("Invalid product id");
  const sizeStr = String(size || "").trim().slice(0, 20);
  await CartItem.destroy({
    where: { userId, productId, size: sizeStr },
  });
  return getCart(userId);
}

export async function clearCart(userId: string): Promise<CartItemDto[]> {
  await CartItem.destroy({ where: { userId } });
  return [];
}

export interface MergeItem {
  productId: string;
  size: string;
  quantity: number;
}

export async function mergeCart(
  userId: string,
  items: MergeItem[]
): Promise<CartItemDto[]> {
  for (const it of items) {
    if (!isValidUUID(it.productId)) continue;
    const sizeStr = String(it.size || "S").trim().slice(0, 20);
    const qty = Math.max(1, Math.min(99, Math.round(Number(it.quantity)) || 1));
    const [row, created] = await CartItem.findOrCreate({
      where: { userId, productId: it.productId, size: sizeStr },
      defaults: { userId, productId: it.productId, size: sizeStr, quantity: qty },
    });
    if (!created && row) await row.update({ quantity: row.quantity + qty });
  }
  return getCart(userId);
}
