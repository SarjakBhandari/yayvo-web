"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../_components/sidebar";
import { checkIfProductLiked, checkIfReviewLikedBy, getCurrentUserAction } from "@/lib/actions/collection-actions";
import { getProductsClient } from "@/lib/actions/product-actions";
import { getReviewsClient } from "@/lib/actions/review-actions";
import ProductCard from "../../_components/consumerProduct";
import ReviewCard from "../../_components/ReviewCard";

export default function LikedCollectionsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const current = await getCurrentUserAction();
        const id = current?.user?.id;
        setUserId(id);

        if (!id) return;

        const { items: prod } = await getProductsClient();
        const likedProducts: any[] = [];
        for (const p of prod) {
          if (await checkIfProductLiked(String(p._id), id)) likedProducts.push(p);
        }
        
        setProducts(likedProducts);

        const { items: rev } = await getReviewsClient();
const likedReviews: any[] = [];
for (const r of rev) {
  const resp = await checkIfReviewLikedBy(String(r._id), id);
  if (resp?.liked) likedReviews.push(r);
  console.log("Review", r._id, "liked?", resp);

}

setReviews(likedReviews);

      } catch (err) {
        console.error("Failed to load liked collections", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ padding: 24, flex: 1 }}>
        <h1>Liked Collections</h1>
        {!userId && <p style={{ color: "crimson" }}>No user found. Please sign in.</p>}
        {loading && <p>Loading...</p>}

        <section>
          <h2>Liked Products</h2>
          {products.length === 0 ? <p>No liked products.</p> : (
            <div style={{ display: "grid", gap: 16 }}>
              {products.map((p) => (
                <ProductCard key={p._id} product={p} currentUserId={userId} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2>Liked Reviews</h2>
          {reviews.length === 0 ? <p>No liked reviews.</p> : (
            <div style={{ display: "grid", gap: 16 }}>
              {reviews.map((r) => (
                <ReviewCard key={r._id} review={r} currentUserId={userId} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
