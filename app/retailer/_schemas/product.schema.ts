// src/app/retailer/_Schemas/product.ts
import { z } from "zod";

/**
 * Zod schemas for Product and ProductListResponse
 * Use these for runtime validation and to infer TS types.
 */

export const ProductSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  retailerAuthId: z.string(),
  retailerName: z.string(),
  retailerIcon: z.string().nullable().optional(),
  targetSentiment: z.array(z.string()),
  likes: z.array(z.string()).optional().default([]),
  noOfLikes: z.number().optional().default(0),
  image: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const ProductListResponseSchema = z.object({
  items: z.array(ProductSchema),
  total: z.number().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
