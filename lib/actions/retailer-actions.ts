// lib/actions/retailer-actions.ts
import {
  getRetailerByAuthId as apiGetRetailerByAuthId,
  getRetailerById as apiGetRetailerById,
  uploadRetailerPicture as apiUploadRetailerLogoByAuth,
  updateRetailer as apiUpdateRetailer,
} from "../api/retailer";

export async function loadRetailerByAuth(authId: string) {
  return await apiGetRetailerByAuthId(authId);
}

export async function loadRetailerById(id: string) {
  return await apiGetRetailerById(id);
}

export async function uploadRetailerLogo(authId: string, file: File) {
  return await apiUploadRetailerLogoByAuth(authId, file);
}

export async function saveRetailer(id: string, payload: Record<string, any>) {
  return await apiUpdateRetailer(id, payload);
}
