// src/actions/collection-action.ts
import * as CollectionApi from "@/lib/api/collection";

function normalizeListResponse(resp: any) {
  if (!resp) return { items: [], pagination: null };
  if (Array.isArray(resp)) return { items: resp, pagination: null };
  if (Array.isArray(resp.data)) return { items: resp.data, pagination: null };
  if (resp.data?.items) return { items: resp.data.items, pagination: resp.data.pagination ?? null };
  if (resp.items) return { items: resp.items, pagination: resp.pagination ?? null };
  return { items: [], pagination: null };
}

export async function loadSavedReviews(page = 1, size = 20) {
  const resp = await CollectionApi.fetchSavedReviews(page, size);
  return normalizeListResponse(resp);
}

export async function loadSavedProducts(page = 1, size = 20) {
  const resp = await CollectionApi.fetchSavedProducts(page, size);
  return normalizeListResponse(resp);
}

export async function doSaveReview(reviewId: string) {
  return CollectionApi.saveReview(reviewId);
}

export async function doUnsaveReview(reviewId: string) {
  return CollectionApi.unsaveReview(reviewId);
}

export async function doSaveProduct(productId: string) {
  return CollectionApi.saveProduct(productId);
}

export async function doUnsaveProduct(productId: string) {
  return CollectionApi.unsaveProduct(productId);
}

export async function getReviewLikers(reviewId: string) {
  return CollectionApi.getUsersWhoLikedReview(reviewId);
}

export async function checkIfReviewLikedBy(reviewId: string, userId: string) {
  return CollectionApi.isReviewLikedBy(reviewId, userId);
}

export async function checkIfProductLiked(productId: string, userId: string) {
  return CollectionApi.isProductLiked(productId, userId);
}

/** Current user action */
export async function getCurrentUserAction() {
  return CollectionApi.getCurrentUser();
}
