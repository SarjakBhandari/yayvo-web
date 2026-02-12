// src/lib/productActions.ts
import {
  createProduct as apiCreateProduct,
  uploadProductImage as apiUploadProductImage,
  getProducts as apiGetProducts,
  getProductsByAuthor as apiGetProductsByAuthor,
  getProductById as apiGetProductById,
  likeProduct as apiLikeProduct,
  unlikeProduct as apiUnlikeProduct,
  isProductLiked as apiIsProductLiked,
  CreateProductPayload,
  updateProduct,
} from "../api/products";
import { getAuthToken } from "../cookie";
import { API } from "../api/endpoints";
import { ProductListResponse, Product } from "../../app/retailer/_schemas/product.schema";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

/* ---------------------------
   Client-side re-exports (use in client hooks/components)
   --------------------------- */
export async function createProductClient(payload: CreateProductPayload): Promise<Product> {
  return await apiCreateProduct(payload);
}
export async function uploadProductImageClient(productId: string, file: File) {
  return await apiUploadProductImage(productId, file);
}
export async function getProductsClient(search?: string): Promise<ProductListResponse> {
  return await apiGetProducts(search);
}
export async function getProductsByAuthorClient(authorId: string): Promise<ProductListResponse> {
  return await apiGetProductsByAuthor(authorId);
}
export async function likeClient(productId: string, userId: string) {
  return await apiLikeProduct(productId, userId);
}

export async function unlikeClient(productId: string, userId: string) {
  return await apiUnlikeProduct(productId, userId);
}

export async function isLikedClient(productId: string, userId: string) {
  return await apiIsProductLiked(productId, userId);
}
/* ---------------------------
   Server-side helpers (use in server components/actions)
   attach Authorization header from cookie
   --------------------------- */
async function fetchWithAuth(path: string, opts: RequestInit = {}) {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status} ${text}`);
  }
  return res.json();
}

export async function loadProductsByAuthor(authorAuthId: string): Promise<ProductListResponse> {
  const path = API.PRODUCTS.BY_AUTHOR.replace(":authorId", encodeURIComponent(authorAuthId));
  return (await fetchWithAuth(path)) as ProductListResponse;
}

export async function loadMarketProducts(search?: string): Promise<ProductListResponse> {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  return (await fetchWithAuth(`${API.PRODUCTS.PAGINATED}${q}`)) as ProductListResponse;
}

export async function serverCreateProduct(payload: CreateProductPayload): Promise<Product> {
  return (await fetchWithAuth(API.PRODUCTS.CREATE, {
    method: "POST",
    body: JSON.stringify(payload),
  })) as Product;
}

export async function serverUploadProductImage(productId: string, file: File) {
  const token = await getAuthToken();
  const form = new FormData();
  form.append("image", file);

  const headers: Record<string, string> | undefined = token ? { Authorization: `Bearer ${token}` } : undefined;

  const res = await fetch(`${BASE_URL}${API.PRODUCTS.IMAGE.replace(":id", encodeURIComponent(productId))}`, {
    method: "POST",
    headers,
    body: form,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed ${res.status} ${text}`);
  }
  return res.json();
}

export async function loadProductById(id: string): Promise<Product> {
  return (await fetchWithAuth(API.PRODUCTS.BY_ID.replace(":id", encodeURIComponent(id)))) as Product;
}

export async function serverLikeProduct(productId: string) {
  return await fetchWithAuth(API.PRODUCTS.LIKE.replace(":id", encodeURIComponent(productId)), { method: "POST" });
}

export async function serverUnlikeProduct(productId: string) {
  return await fetchWithAuth(API.PRODUCTS.UNLIKE.replace(":id", encodeURIComponent(productId)), { method: "POST" });
}

export async function serverIsProductLiked(productId: string) {
  return (await fetchWithAuth(API.PRODUCTS.IS_LIKED.replace(":id", encodeURIComponent(productId)))) as { liked: boolean };
}
export async function deleteProductClient(productId: string) {
  const res = await fetchWithAuth(API.PRODUCTS.DELETE.replace(":id", encodeURIComponent(productId)), {
    method: "DELETE",
  });
  return res as { success: boolean };
}

/* ---------------------------
   Server-side helpers (use in server components/actions)
   attach Authorization header from cookie
   --------------------------- */
export async function serverDeleteProduct(productId: string) {
  return await fetchWithAuth(API.PRODUCTS.DELETE.replace(":id", encodeURIComponent(productId)), {
    method: "DELETE",
  }) as { success: boolean };
}

export async function updateProductClient(productId: string, data: {
  title?: string;
  description?: string;
  targetSentiment?: string[];
}) {
  return updateProduct(productId,data);
}



export async function updateProductImageClient(productId: string, file: File) {
  return await serverUploadProductImage(productId, file);
}
