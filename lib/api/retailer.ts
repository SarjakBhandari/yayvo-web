// api/retailer.ts
import api from "./axios";
import { API } from "./endpoints";

export async function uploadRetailerPicture(id: string, file: File) {
  const fd = new FormData();
  fd.append("profilePicture", file);
  const { data } = await api.put(API.Retailer.RETAILER_LOGO.replace(":id", id), fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getRetailerByAuthId(authId: string) {
  const { data } = await api.get(API.Retailer.RETAILER_BY_AUTH.replace(":authId", authId));
  return data;
}

export async function getRetailerById(id: string) {
  const { data } = await api.get(API.Retailer.RETAILER_BY_ID.replace(":id", id));
  return data;
}

export async function updateRetailer(id: string, payload: Record<string, any>) {
  const { data } = await api.put(API.Retailer.RETAILER_UPDATE.replace(":id", id), payload);
  return data;
}
