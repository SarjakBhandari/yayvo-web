export type CreateReviewDto = {
  title: string;
  description?: string;
  sentiments?: string[] | string;
  productName?: string;
  productImage?: string;
  authorId: string;
  authorLocation?: string;
};

export type UpdateReviewDto = {
  title?: string;
  description?: string;
  sentiments?: string[] | string;
  productName?: string;
  productImage?: string;
  authorLocation?: string;
};

export type LikeDto = {
  userId: string;
};
