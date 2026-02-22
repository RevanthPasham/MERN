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

/* ---------- Product create: accepts your Postman shape (name, price, urls, etc.) ---------- */

export const createProductBodySchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    title: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    categoryId: z.string().uuid().optional().nullable(),
    brand: z.string().optional().nullable(),
    material: z.string().optional().nullable(),
    isActive: z.boolean().optional().default(true),
    price: z.number().optional(),
    urls: z.array(z.string()).optional(),
    weight: z.string().optional(),
    discount: z.number().optional(),
    category: z.array(z.string()).optional(),
  })
  .refine((data) => (data.name && data.name.length > 0) || (data.title && data.title.length > 0), {
    message: "Either name or title is required",
    path: ["name"],
  });

/* ---------- Collection validation ---------- */

export const createCollectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image_url: z.string().url("Valid image URL is required"),
  description: z.string().optional().default(""),
  category: z.array(z.string()).min(1, "At least one category is required"),
});

export const collectionIdSchema = z.object({
  id: z.string().min(1, "Collection ID is required"),
});

/* ---------- Auth ---------- */

export const registerBodySchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1).optional(),
});

export const loginBodySchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});
