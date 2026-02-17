"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../_components/sidebar";
import { doUnsaveProduct, doUnsaveReview, loadSavedProducts, loadSavedReviews } from "@/lib/actions/collection-actions";
import ProductCard from "../../_components/consumerProduct";
import ReviewCard from "../../_components/ReviewCard";

export default function SavedCollectionsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { items: prod } = await loadSavedProducts(1, 50);
        const { items: rev } = await loadSavedReviews(1, 50);
        setProducts(prod);
        setReviews(rev);
      } catch (err) {
        console.error("Failed to load saved collections", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleUnsaveProduct(id: string) {
    await doUnsaveProduct(id);
    setProducts((s) => s.filter((p) => (p._id ?? p.productId) !== id));
  }

  async function handleUnsaveReview(id: string) {
    await doUnsaveReview(id);
    setReviews((s) => s.filter((r) => r._id !== id));
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ padding: 24, flex: 1 }}>
        <h1>Saved Collections</h1>
        {loading && <p>Loading...</p>}

        <section>
          <h2>Saved Products</h2>
          {products.length === 0 ? (
            <p>No saved products.</p>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {products.map((p) => (
                <div key={p._id ?? p.productId} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
                  <ProductCard product={p} currentUserId={null} />
                  <button
                    onClick={() => handleUnsaveProduct(p._id ?? p.productId)}
                    style={{
                      marginTop: 8,
                      padding: "6px 12px",
                      backgroundColor: "#e53e3e",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Unsave
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2>Saved Reviews</h2>
          {reviews.length === 0 ? (
            <p>No saved reviews.</p>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {reviews.map((r) => (
                <div key={r._id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
                  <ReviewCard review={r} currentUserId={null} />
                  <button
                    onClick={() => handleUnsaveReview(r._id)}
                    style={{
                      marginTop: 8,
                      padding: "6px 12px",
                      backgroundColor: "#e53e3e",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Unsave
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
