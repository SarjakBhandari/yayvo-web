// admin/lib/admin.ts
import api from "./axios";
import { API } from "./endpoints";

const BASE_HEADERS_JSON = { "Content-Type": "application/json" };

/* Consumers */
export async function listConsumers() {
  const { data } = await api.get(API.ADMIN.CONSUMERS_LIST);
  return data;
}
export async function listConsumersPaginated(params?: {
  page?: number;
  size?: number;
  search?: string;
}) {
  const q = new URLSearchParams();
  if (params?.page != null) q.set("page", String(params.page));
  if (params?.size != null) q.set("size", String(params.size));
  if (params?.search) q.set("search", params.search);
  const url =
    API.ADMIN.CONSUMERS_LIST_PAGINATED +
    (q.toString() ? `?${q.toString()}` : "");
  const resp = await api.get(url);
  const data = resp?.data;
  // Case: backend returns { data: [...], pagination: { page, size, totalItems } }
  if (data && Array.isArray(data.data) && data.pagination) {
    return {
      items: data.data,
      total: data.pagination.totalItems ?? data.pagination.total ?? 0,
      page: data.pagination.page ?? params?.page ?? 1,
      size: data.pagination.size ?? params?.size ?? 10,
    };
  } // Case: backend returns { items: [...], total, page, size } if (data && Array.isArray(data.items)) { return { items: data.items, total: data.total ?? 0, page: data.page ?? params?.page ?? 1, size: data.size ?? params?.size ?? 10, }; }
  //  // Case: raw array
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page: params?.page ?? 1,
      size: params?.size ?? 10,
    };
  }
  // Fallback
  return {
    items: [],
    total: 0,
    page: params?.page ?? 1,
    size: params?.size ?? 10,
  };
}
export async function getConsumer(id: string) {
  const { data } = await api.get(API.ADMIN.CONSUMER_BY_ID.replace(":id", id));
  return data;
}

/**
 * Create consumer using JSON payload (no FormData).
 * If you still need to upload an image, call uploadConsumerPictureByAuth after creation.
 */
export async function createConsumer(payload: Record<string, any>) {
  const { data } = await api.post(API.ADMIN.CONSUMER_CREATE, payload, {
    headers: BASE_HEADERS_JSON,
  });
  return data;
}

/**
 * Update consumer (JSON payload)
 */
export async function updateConsumer(id: string, payload: any) {
  const { data } = await api.put(
    API.ADMIN.CONSUMER_UPDATE.replace(":id", id),
    payload,
  );
  return data;
}

/**
 * Upload consumer picture by authId (multipart/form-data).
 * Use this when you want to upload the image separately and identify user by authId.
 */

/**
 * If your API still expects the Mongo _id for consumer picture, keep this helper:
 */
export async function uploadConsumerPicture(id: string, file: File) {
  const fd = new FormData();
  fd.append("profilePicture", file);
  const { data } = await api.put(
    API.ADMIN.CONSUMER_PICTURE.replace(":id", id),
    fd,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
}

export async function deleteConsumer(id: string) {
  const { data } = await api.delete(
    API.ADMIN.CONSUMER_DELETE.replace(":id", id),
  );
  return data;
}

/* Retailers */
export async function listRetailers() {
  const { data } = await api.get(API.ADMIN.RETAILERS_LIST);
  return data;
}

export async function getRetailer(id: string) {
  const { data } = await api.get(API.ADMIN.RETAILER_BY_ID.replace(":id", id));
  return data;
}

/**
 * Create retailer using JSON payload (no FormData).
 * If you need to upload an image, call uploadRetailerPictureByAuth after creation.
 */
export async function createRetailer(payload: Record<string, any>) {
  const { data } = await api.post(API.ADMIN.RETAILER_CREATE, payload, {
    headers: BASE_HEADERS_JSON,
  });
  return data;
}

/**
 * Update retailer (JSON payload)
 */
export async function updateRetailer(id: string, payload: any) {
  const { data } = await api.put(
    API.ADMIN.RETAILER_UPDATE.replace(":id", id),
    payload,
  );
  return data;
}

/**
 * Upload retailer picture by authId (multipart/form-data).
 * Mirrors the consumer upload-by-auth helper.

/**
 * If your retailer picture endpoint uses :id (Mongo _id), keep this helper:
 */
export async function uploadRetailerPicture(id: string, file: File) {
  const fd = new FormData();
  fd.append("profilePicture", file);
  const { data } = await api.put(
    API.ADMIN.RETAILER_PICTURE.replace(":id", id),
    fd,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
}

export async function deleteRetailer(id: string) {
  const { data } = await api.delete(
    API.ADMIN.RETAILER_DELETE.replace(":id", id),
  );
  return data;
}
