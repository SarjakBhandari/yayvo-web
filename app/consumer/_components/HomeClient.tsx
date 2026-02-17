// app/consumer/home/_components/HomeClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import ReviewCard from "../_components/ReviewCard";
import { getReviewsClient } from "@/lib/actions/review-actions";
import { getConsumerByAuthId } from "@/lib/api/consumer";
import { Sparkles, Search } from "lucide-react";

export default function HomeClient({ userData }: { userData: any | null }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consumerId, setConsumerId] = useState<string | null>(null);

  function resolveAuthId(data: any): string | null {
    if (!data) return null;
    const candidate = data?.user ?? data?.data ?? data;
    return candidate?.id ?? candidate?._id ?? candidate?.authId ?? null;
  }

  useEffect(() => {
    (async () => {
      try {
        if (!userData) return;
        const authId = resolveAuthId(userData);
        if (!authId) return;
        const cons = await getConsumerByAuthId(authId);
        const consumerObj = cons?.data ?? cons;
        const cid = consumerObj?.id ?? consumerObj?._id ?? null;
        setConsumerId(cid);
      } catch (err) {
        console.error("HomeClient: failed to load consumer", err);
      }
    })();
  }, [userData]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getReviewsClient();
        setReviews(res?.items ?? []);
        setPagination(res?.pagination ?? null);
      } catch (err: any) {
        const server = err?.response?.data ?? err?.message ?? err;
        setError(typeof server === "string" ? server : JSON.stringify(server));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        .hc-root {
          font-family: 'DM Sans', sans-serif;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #F5F0E8;
          min-height: 100vh;
        }
        .hc-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-shrink: 0;
          flex-wrap: wrap;
          gap: 12px;
        }
        .hc-heading-wrap {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .hc-eyebrow {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #9C8E7A;
          font-weight: 500;
        }
        .hc-heading {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 700;
          color: #1A1612;
          margin: 0;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .hc-meta {
          font-size: 12px;
          color: #B8A898;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 30px;
          padding: 6px 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .hc-feed {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
          scrollbar-width: thin;
          scrollbar-color: #D4C8B4 transparent;
        }
        .hc-feed::-webkit-scrollbar { width: 4px; }
        .hc-feed::-webkit-scrollbar-track { background: transparent; }
        .hc-feed::-webkit-scrollbar-thumb { background: #D4C8B4; border-radius: 4px; }

        .hc-review-item {
          width: 100%;
          max-width: 680px;
          animation: cardIn 0.4s ease both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Skeleton loader */
        .hc-skeleton-card {
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          max-width: 680px;
          width: 100%;
        }
        .hc-skeleton-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
        }
        .sk { background: linear-gradient(90deg, #EDE8DE 25%, #E0D8CC 50%, #EDE8DE 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .sk-circle { border-radius: 50% !important; }
        .hc-skeleton-img { width: 100%; aspect-ratio: 4/5; }
        .hc-skeleton-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }

        /* Empty state */
        .hc-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 80px 20px;
          color: #9C8E7A;
          text-align: center;
        }
        .hc-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: #F0EBE1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A96E;
        }
        .hc-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #1A1612;
          font-weight: 700;
        }
        .hc-empty-sub { font-size: 14px; color: #9C8E7A; }

        /* Error state */
        .hc-error {
          background: #FFF8F5;
          border: 1px solid #FFDDD0;
          border-radius: 14px;
          padding: 20px;
          max-width: 680px;
          width: 100%;
          color: #C0392B;
          font-size: 14px;
          line-height: 1.6;
        }
        .hc-error-title {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          margin-bottom: 6px;
          font-size: 15px;
        }
      `}</style>

      <main className="hc-root">
        <div className="hc-topbar">
          <div className="hc-heading-wrap">
            <div className="hc-eyebrow">Discover</div>
            <h1 className="hc-heading">Reviews</h1>
          </div>
          {pagination && !loading && (
            <div className="hc-meta">
              {pagination.totalItems} review{pagination.totalItems !== 1 ? "s" : ""} · Page {pagination.page}
            </div>
          )}
        </div>

        <div className="hc-feed">
          {loading && (
            <>
              {[0, 1, 2].map((i) => (
                <div key={i} className="hc-skeleton-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="hc-skeleton-header">
                    <div className="sk sk-circle" style={{ width: 44, height: 44, flexShrink: 0 }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div className="sk" style={{ height: 13, width: "45%" }} />
                      <div className="sk" style={{ height: 10, width: "30%" }} />
                    </div>
                  </div>
                  <div className="sk hc-skeleton-img" />
                  <div className="hc-skeleton-body">
                    <div className="sk" style={{ height: 20, width: "70%" }} />
                    <div className="sk" style={{ height: 13, width: "100%" }} />
                    <div className="sk" style={{ height: 13, width: "85%" }} />
                    <div className="sk" style={{ height: 13, width: "60%" }} />
                  </div>
                </div>
              ))}
            </>
          )}

          {error && (
            <div className="hc-error">
              <div className="hc-error-title">Could not load reviews</div>
              <div>{error}</div>
            </div>
          )}

          {!loading && !error && reviews.length === 0 && (
            <div className="hc-empty">
              <div className="hc-empty-icon">
                <Sparkles size={28} />
              </div>
              <div className="hc-empty-title">Nothing here yet</div>
              <div className="hc-empty-sub">Be the first to share a review.</div>
            </div>
          )}

          {!loading && !error && reviews.map((r, i) => (
            <div
              key={r._id ?? r.id}
              className="hc-review-item"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <ReviewCard review={r} currentUserId={consumerId} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}