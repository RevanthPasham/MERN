import { Product, ProductRow } from "../db/models/product.model";
import {
  createProduct as createProductQuery,
  getProductById as getProductByIdQuery,
  getAllProducts as getAllProductsQuery,
  getProductsCount as getProductsCountQuery,
  updateProduct as updateProductQuery,
} from "../db/models/product.queries";
import { AppError } from "../utils/errors";
import { PaginationParams, createPaginatedResponse } from "../utils/pagination";

const mapProductRowToProduct = (row: ProductRow): Product => {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    categories: row.categories,
    price: row.price.map((p) => Number(p)),
    discount: row.discount.map((d) => Number(d)),
    links: row.links,
    images: row.images,
    sizeChart: Array.isArray(row.size_chart) ? row.size_chart : [],
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const createProductService = async (data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> => {
  const product = await createProductQuery(data);
  return mapProductRowToProduct(product);
};

export const getProductByIdService = async (id: string): Promise<Product> => {
  const product = await getProductByIdQuery(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  return mapProductRowToProduct(product);
};

export const getAllProductsService = async (
  pagination: PaginationParams,
  category?: string,
  search?: string
) => {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  const [products, total] = await Promise.all([
    getAllProductsQuery(limit, offset, category, search),
    getProductsCountQuery(category, search),
  ]);

  const mappedProducts = products.map(mapProductRowToProduct);
  return createPaginatedResponse(mappedProducts, total, page, limit);
};

export const updateProductService = async (
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
): Promise<Product> => {
  const product = await updateProductQuery(id, data);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  return mapProductRowToProduct(product);
};
