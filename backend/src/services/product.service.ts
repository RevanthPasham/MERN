import { insertProduct, getProductsByCategory } from "../db/models";

export async function createProductService(data: any) {
  // normalize incoming JSON (from Postman / Mongo style)
  return insertProduct({
    name: data.name,
    price: Number(data.price),
    urls: data.urls,
    weight: data.weight,
    discount: Number(data.discount),
    category: data.category
  });
}

export async function getByCategoryService(cat: string) {
  return getProductsByCategory(cat);
}
