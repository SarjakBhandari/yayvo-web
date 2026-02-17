import api from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

const REVIEWS = API.REVIEWS;

/** Create a new review */
export async function createReview(payload: any): Promise<any> {
  const { data } = await api.post(REVIEWS.CREATE, payload);
  return data;
}

/** Upload an image for a review */
export async function uploadReviewImage(reviewId: string, file: File): Promise<any> {
  const url = REVIEWS.IMAGE.replace(":id", reviewId);
  const fd = new FormData();
  fd.append("image", file);
  const { data } = await api.post(url, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** Get reviews with pagination */
export async function getReviewsPaginated(params?: Record<string, any>) {
  try {
    const resp = await api.get(REVIEWS.PAGINATED, { params: params || {} });
    const data = resp?.data;

    if (data && Array.isArray(data.data) && data.pagination) return { items: data.data, pagination: data.pagination };
    if (data && data.data && Array.isArray(data.data.items)) return { items: data.data.items, pagination: data.data.pagination ?? null };
    if (data && Array.isArray(data.items)) return { items: data.items, pagination: data.pagination ?? null };
    if (Array.isArray(data)) return { items: data, pagination: null };
    if (data?.data?.data && Array.isArray(data.data.data)) return { items: data.data.data, pagination: data.data.pagination ?? null };

    const foundArray = Object.values(data || {}).find((v) => Array.isArray(v));
    if (foundArray) return { items: foundArray as any[], pagination: (data as any).pagination ?? null };

    console.warn("getReviewsPaginated unexpected response shape:", data);
    return { items: [], pagination: null };
  } catch (err: any) {
    console.error("getReviewsPaginated error:", {
      message: err.message,
      code: err.code,
      responseStatus: err?.response?.status,
      responseData: err?.response?.data,
    });
    throw err;
  }
}

/** Get a single review by ID */
export async function getReviewById(id: string) {
  const url = REVIEWS.BY_ID.replace(":id", id);
  const { data } = await api.get(url);
  return data;
}

/** Get reviews by author (retailer/consumer) */
export async function getReviewsByAuthor(authorId: string) {
  const url = REVIEWS.BY_AUTHOR.replace(":authorId", authorId);
  const { data } = await api.get(url);
  return data;
}

/** Update a review (title, description, image, sentiments) */
export async function updateReview(
  reviewId: string,
  updates: Partial<{ title: string; description: string; image: string; sentiments: string[] }>
) {
  const url = REVIEWS.BY_ID.replace(":id", reviewId);
  const { data } = await api.put(url, updates);
  return data;
}

/** Delete a review */
export async function deleteReview(reviewId: string) {
  const url = REVIEWS.DELETE.replace(":id", reviewId);
  const { data } = await api.delete(url);
  return data;
}

/** Like a review */
export async function likeReview(reviewId: string, userId: string) {
  const url = REVIEWS.LIKE.replace(":id", reviewId);
  const { data } = await api.post(url, { userId });
  return data;
}

/** Unlike a review */
export async function unlikeReview(reviewId: string, userId: string) {
  const url = REVIEWS.UNLIKE.replace(":id", reviewId);
  const { data } = await api.post(url, { userId });
  return data;
}

/** Check if a review is liked by a user */
export async function isReviewLiked(reviewId: string, userId: string) {
  const url = REVIEWS.IS_LIKED.replace(":id", reviewId).replace(":userid", userId);
  const { data } = await api.get(url);
  return data;
}
