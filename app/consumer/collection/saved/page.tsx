// app/consumer/collection/saved/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../_components/sidebar";
import { doUnsaveProduct, doUnsaveReview, loadSavedProducts, loadSavedReviews } from "@/lib/actions/collection-actions";
import ProductCard from "../../_components/consumerProduct";
import ReviewCard from "../../_components/ReviewCard";
import { Package, FileText, Bookmark } from "lucide-react";

export default function SavedCollectionsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"products" | "reviews">("products");

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
    <>
      <PageStyles />
      <div className="col-root">
        {/* Ambient blobs */}
        <div className="col-blob col-blob-1" />
        <div className="col-blob col-blob-2" />

        {/* Sidebar */}
        <div className="col-sidebar-col">
          <div className="col-sidebar-panel"><Sidebar /></div>
        </div>

        {/* Main */}
        <main className="col-main">
          <div className="col-header">
            <div className="col-eyebrow">My Collection</div>
            <h1 className="col-heading">Saved</h1>
          </div>

          {/* Tabs */}
          <div className="col-tabs">
            <button className={`col-tab${tab === "products" ? " active" : ""}`} onClick={() => setTab("products")}>
              <Package size={14} />
              Products
              <span className="col-tab-count">{products.length}</span>
            </button>
            <button className={`col-tab${tab === "reviews" ? " active" : ""}`} onClick={() => setTab("reviews")}>
              <FileText size={14} />
              Reviews
              <span className="col-tab-count">{reviews.length}</span>
            </button>
          </div>

          {/* Loading */}
          {loading && <LoadingSkeleton />}

          {/* Empty */}
          {!loading && tab === "products" && products.length === 0 && (
            <EmptyState icon={<Bookmark size={28} />} message="No saved products yet." />
          )}
          {!loading && tab === "reviews" && reviews.length === 0 && (
            <EmptyState icon={<Bookmark size={28} />} message="No saved reviews yet." />
          )}

          {/* Products grid */}
          {!loading && tab === "products" && products.length > 0 && (
            <div className="col-grid">
              {products.map((p) => (
                <div key={p._id ?? p.productId} className="col-card-wrap">
                  <ProductCard product={p} currentUserId={null} />
                  <button className="col-unsave-btn" onClick={() => handleUnsaveProduct(p._id ?? p.productId)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Reviews feed */}
          {!loading && tab === "reviews" && reviews.length > 0 && (
            <div className="col-feed">
              {reviews.map((r) => (
                <div key={r._id} className="col-review-wrap">
                  <ReviewCard review={r} currentUserId={null} />
                  <button className="col-unsave-btn" onClick={() => handleUnsaveReview(r._id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

/* ── shared sub-components ── */

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="col-empty">
      <div className="col-empty-icon">{icon}</div>
      <div className="col-empty-msg">{message}</div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="col-skeletons">
      {[0, 1, 2].map((i) => (
        <div key={i} className="col-sk-card" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="sk col-sk-img" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, padding: "14px 16px" }}>
            <div className="sk" style={{ height: 14, width: "55%" }} />
            <div className="sk" style={{ height: 11, width: "35%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PageStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .col-root {
        height: 100vh;
        display: flex;
        background: #F5F0E8;
        font-family: 'DM Sans', sans-serif;
        overflow: hidden;
        position: relative;
      }
      .col-blob {
        position: fixed;
        border-radius: 50%;
        filter: blur(80px);
        pointer-events: none;
        z-index: 0;
      }
      .col-blob-1 {
        width: 420px; height: 420px;
        background: radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%);
        top: -100px; left: 180px;
      }
      .col-blob-2 {
        width: 320px; height: 320px;
        background: radial-gradient(circle, rgba(139,107,61,0.08) 0%, transparent 70%);
        bottom: 60px; right: 80px;
      }
      .col-sidebar-col {
        position: relative;
        z-index: 1;
        flex: 0 0 260px;
        padding: 28px 0 28px 28px;
        display: flex;
        flex-direction: column;
      }
      .col-sidebar-panel {
        flex: 1;
        background: #FAFAF8;
        border: 1px solid #E8E4DC;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(26,22,18,0.05);
        display: flex;
        flex-direction: column;
      }
      .col-main {
        position: relative;
        z-index: 1;
        flex: 1;
        padding: 28px 28px 40px 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 24px;
        min-width: 0;
        scrollbar-width: thin;
        scrollbar-color: #D4C8B4 transparent;
      }
      .col-main::-webkit-scrollbar { width: 4px; }
      .col-main::-webkit-scrollbar-thumb { background: #D4C8B4; border-radius: 4px; }

      /* Header */
      .col-header { display: flex; flex-direction: column; gap: 2px; }
      .col-eyebrow {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: #9C8E7A;
        font-weight: 500;
      }
      .col-heading {
        font-family: 'Playfair Display', serif;
        font-size: 34px;
        font-weight: 700;
        color: #1A1612;
        letter-spacing: -0.03em;
        line-height: 1.1;
      }

      /* Tabs */
      .col-tabs {
        display: flex;
        gap: 6px;
        background: #FAFAF8;
        border: 1px solid #E8E4DC;
        border-radius: 14px;
        padding: 6px;
        width: fit-content;
      }
      .col-tab {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 9px 18px;
        border-radius: 10px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        font-weight: 500;
        color: #9C8E7A;
        transition: all 0.18s ease;
      }
      .col-tab:hover { color: #1A1612; background: #F0EBE1; }
      .col-tab.active { background: #1A1612; color: #FAFAF8; }
      .col-tab-count {
        padding: 1px 8px;
        border-radius: 30px;
        font-size: 11px;
        background: #F0EBE1;
        color: #7A6A52;
      }
      .col-tab.active .col-tab-count {
        background: rgba(255,255,255,0.15);
        color: #FAFAF8;
      }

      /* Grid */
      .col-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 16px;
      }
      .col-card-wrap { display: flex; flex-direction: column; gap: 8px; }

      /* Feed */
      .col-feed { display: flex; flex-direction: column; gap: 20px; }
      .col-review-wrap { display: flex; flex-direction: column; gap: 8px; max-width: 680px; }

      /* Unsave btn */
      .col-unsave-btn {
        align-self: flex-start;
        padding: 7px 14px;
        border-radius: 30px;
        border: 1px solid #FFCDD2;
        background: transparent;
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        font-size: 12px;
        font-weight: 500;
        color: #C0392B;
        transition: all 0.18s ease;
      }
      .col-unsave-btn:hover { background: #FFF1F1; }

      /* Empty */
      .col-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 80px 20px;
        text-align: center;
      }
      .col-empty-icon {
        width: 64px; height: 64px;
        border-radius: 20px;
        background: #F0EBE1;
        display: flex; align-items: center; justify-content: center;
        color: #C9A96E;
      }
      .col-empty-msg { font-size: 15px; color: #9C8E7A; }

      /* Skeleton */
      .col-skeletons { display: flex; flex-direction: column; gap: 12px; }
      .col-sk-card {
        display: flex;
        background: #FAFAF8;
        border: 1px solid #E8E4DC;
        border-radius: 14px;
        overflow: hidden;
        animation: colIn 0.4s ease both;
      }
      @keyframes colIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
      .col-sk-img { width: 80px; height: 80px; flex-shrink: 0; }
      .sk {
        background: linear-gradient(90deg, #EDE8DE 25%, #E0D8CC 50%, #EDE8DE 75%);
        background-size: 200% 100%;
        animation: shimmer 1.4s infinite;
        border-radius: 6px;
      }
      @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
    `}</style>
  );
}