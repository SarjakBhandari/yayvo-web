// src/types/product.ts
export type ProductFromBackend = {
  _id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  retailerAuthId: string;
  retailerName?: string | null;
  retailerIcon?: string | null;
  targetSentiment?: string[]; // e.g. ["calm","cozy"]
  likes?: string[];
  noOfLikes?: number;
  createdAt?: string;
  updatedAt?: string;
  [k: string]: any;
};

export type PaginatedProducts = {
  items: ProductFromBackend[];
  total: number;
  page?: number;
  size?: number;
  totalPages?: number;
};
