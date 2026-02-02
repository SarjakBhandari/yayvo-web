// lib/consumerActions.ts
import api from "../api/axios";
import { API } from "../api/endpoints";
import {
  getConsumerByAuthId as apiGetConsumerByAuthId,
  getConsumerById as apiGetConsumerById,
  uploadConsumerPicture as apiUploadConsumerPictureByAuth,
  updateConsumer as apiUpdateConsumer,
} from "../api/consumer";

/**
 * Fetch current user from backend (expects API.AUTH.CURRENT_USER)
 */
export async function getCurrentUser() {
  const { data } = await api.get(API.AUTH.CURRENT_USER);
  return data;
}

/**
 * Load consumer by authId (wrapper around consumerApi)
 */
export async function loadConsumerByAuth(authId: string) {
  return await apiGetConsumerByAuthId(authId);
}

/**
 * Load consumer by mongo _id
 */
export async function loadConsumerById(id: string) {
  return await apiGetConsumerById(id);
}

/**
 * Upload profile picture by authId
 */
export async function uploadProfilePicture(authId: string, file: File) {
  return await apiUploadConsumerPictureByAuth(authId, file);
}

/**
 * Update consumer (JSON payload)
 */
export async function saveConsumer(id: string, payload: Record<string, any>) {
  return await apiUpdateConsumer(id, payload);
}

/**
 * Logout helper that uses the exact flow you provided.
 * `handleLogout` should be a function available in your app that performs logout (clears cookies/token).
 * `routerPush` is the next/navigation router.push function.
 */
export async function performLogout(handleLogout: () => Promise<void>, routerPush: (path: string) => void) {
  try {
    await handleLogout();
    routerPush("/login");
  } catch (err) {
    console.error("Logout failed", err);
    alert("Logout failed");
  }
}
