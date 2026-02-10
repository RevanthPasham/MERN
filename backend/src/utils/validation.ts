import { z } from "zod";

const sizeChartItemSchema = z.object({
  size: z.string(),
  chest: z.number(),
  length: z.number(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  price: z.array(z.number().nonnegative()).min(1, "At least one price is required"),
  discount: z.array(z.number().min(0).max(100)).min(1, "At least one discount is required"),
  links: z.array(z.string().url()).min(1, "At least one link is required"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  sizeChart: z.array(sizeChartItemSchema).default([]),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().uuid(),
});

export const getProductsQuerySchema = z.object({
  page: z.string().optional().transform((val: string | undefined) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val: string | undefined) => (val ? parseInt(val, 10) : 10)),
  category: z.string().optional(),
  search: z.string().optional(),
});

export const productIdSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
});
