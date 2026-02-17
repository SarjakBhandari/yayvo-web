import api from "@/lib/api/axios";
import { API } from "./endpoints";

const JSON_HEADERS = { "Content-Type": "application/json" };

/** Get current user from backend */
export async function getCurrentUser() {
  const resp = await api.get(API.AUTH.CURRENT_USER);
  return resp.data?.data ?? resp.data;
}

/** Helper to resolve authId from current user */
async function getAuthId(): Promise<string> {
  const current = await getCurrentUser();
  // your backend returns { user: { id, email, role } }
  const id = current?.user?.id ?? current?.user?.authId ?? current?.user?._id;
  if (!id) throw new Error("No authId found in current user");
  return String(id);
}

/** Saved lists */
export async function fetchSavedReviews(page = 1, size = 20) {
  const authId = await getAuthId();
  const url = API.COLLECTIONS.SAVED_REVIEWS.replace(":authId", encodeURIComponent(authId));
  const resp = await api.get(url, { params: { page, size } });
  return resp.data;
}

export async function fetchSavedProducts(page = 1, size = 20) {
  const authId = await getAuthId();
  const url = API.COLLECTIONS.SAVED_PRODUCTS.replace(":authId", encodeURIComponent(authId));
  const resp = await api.get(url, { params: { page, size } });
  return resp.data;
}

/** Save / Unsave actions */
export async function saveReview(reviewId: string) {
  const authId = await getAuthId();
  const payload = { consumerAuthId: authId, reviewId };
  const resp = await api.post(API.COLLECTIONS.SAVE_REVIEW, payload, { headers: JSON_HEADERS });
  return resp.data;
}

export async function unsaveReview(reviewId: string) {
  const authId = await getAuthId();
  const payload = { consumerAuthId: authId, reviewId };
  const resp = await api.post(API.COLLECTIONS.UNSAVE_REVIEW, payload, { headers: JSON_HEADERS });
  return resp.data;
}

export async function saveProduct(productId: string) {
  const authId = await getAuthId();
  const payload = { consumerAuthId: authId, productId };
  const resp = await api.post(API.COLLECTIONS.SAVE_PRODUCT, payload, { headers: JSON_HEADERS });
  return resp.data;
}

export async function unsaveProduct(productId: string) {
  const authId = await getAuthId();
  const payload = { consumerAuthId: authId, productId };
  const resp = await api.post(API.COLLECTIONS.UNSAVE_PRODUCT, payload, { headers: JSON_HEADERS });
  return resp.data;
}

/** Helpers for likers / liked status */
export async function getUsersWhoLikedReview(reviewId: string) {
  const url = API.REVIEWS.BY_ID.replace(":id", encodeURIComponent(reviewId));
  const resp = await api.get(url);
  const review = resp.data?.data ?? resp.data;
  return (review?.likedBy ?? []) as string[];
}

export async function isReviewLikedBy(reviewId: string, userId: string) {
  const url = API.REVIEWS.IS_LIKED.replace(":id", encodeURIComponent(reviewId)).replace(":userid", encodeURIComponent(userId));
  const resp = await api.get(url);
  return resp.data?.data?.liked ?? resp.data?.liked ?? false;
}

export async function isProductLiked(productId: string, userId: string) {
  const resp = await api.get(API.PRODUCTS.IS_LIKED, { params: { productId, userId } });
  return resp.data?.liked ?? resp.data?.data?.liked ?? false;
}
