// src/lib/actions/review-actions.ts
import * as api from "@/lib/api/reviews";

export async function createReviewClient(payload: any) {
  return await api.createReview(payload);
}

export async function uploadReviewImageClient(reviewId: string, file: File) {
  return await api.uploadReviewImage(reviewId, file);
}

export async function getReviewsClient(params?: Record<string, any>) {
  return await api.getReviewsPaginated(params);
}

export async function getReviewByIdClient(id: string) {
  return await api.getReviewById(id);
}

export async function likeReviewClient(reviewId: string, userId: string) {
  return await api.likeReview(reviewId, userId);
}

export async function unlikeReviewClient(reviewId: string, userId: string) {
  return await api.unlikeReview(reviewId, userId);
}

export async function isReviewLikedClient(reviewId: string, userId: string) {
  return await api.isReviewLiked(reviewId, userId);
}
