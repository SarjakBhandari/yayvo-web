// src/lib/api/product.ts
import api from "./axios";
import { API } from "./endpoints";
import { ProductSchema, ProductListResponseSchema, Product } from "../../app/retailer/_schemas/product.schema";
import { getAuthToken } from "../cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";


export type CreateProductPayload = {
  title: string;
  description?: string;
  retailerAuthId: string;
  retailerName: string;
  retailerIcon?: string;
  targetSentiment?: string[];
};

export async function createProduct(payload: CreateProductPayload) {
  const { data } = await api.post(API.PRODUCTS.CREATE, payload);
  return ProductSchema.parse(data);
}

export async function uploadProductImage(productId: string, file: File) {
  const fd = new FormData();
  fd.append("image", file);
  const url = API.PRODUCTS.IMAGE.replace(":id", productId);
  const { data } = await api.post(url, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getProducts(search?: string) {
  const { data } = await api.get(API.PRODUCTS.PAGINATED, { params: search ? { search } : {} });
  return ProductListResponseSchema.parse(data);
}

export async function getProductsByAuthor(authorId: string) {
  const url = API.PRODUCTS.BY_AUTHOR.replace(":authorId", authorId);
  const { data } = await api.get(url);
  return ProductListResponseSchema.parse(data);
}

export async function getProductById(id: string) {
  const url = API.PRODUCTS.BY_ID.replace(":id", id);
  const { data } = await api.get(url);
  return ProductSchema.parse(data);
}

export async function likeProduct(productId: string, userId: string) {
  const { data } = await api.post(API.PRODUCTS.LIKE, { productId, userId });
  return data;
}

export async function unlikeProduct(productId: string, userId: string) {
  const { data } = await api.post(API.PRODUCTS.UNLIKE, { productId, userId });
  return data;
}

export async function isProductLiked(productId: string, userId: string) {
  const { data } = await api.get(API.PRODUCTS.IS_LIKED, {
    params: { productId, userId },
  });
  return data;
}

export async function deleteProduct(productId: string) {
  const url = API.PRODUCTS.DELETE.replace(":id", productId);
  const { data } = await api.delete(url);
  return data; 
}

export async function updateProduct(
  productId: string,
  data: { title?: string; description?: string; targetSentiment?: string[] }
) {
  const token = await getAuthToken();

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Make sure targetSentiment is an array
  const payload = {
    title: data.title,
    description: data.description,
    targetSentiment: Array.isArray(data.targetSentiment) ? data.targetSentiment : []
  };

  const res = await fetch(
    `${BASE_URL}${API.PRODUCTS.BY_ID.replace(":id", encodeURIComponent(productId))}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Update failed ${res.status} ${text}`);
  }

  return res.json() as Promise<Product>;
}
