// app/consumer/_components/HomeClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import ReviewCard from "../_components/ReviewCard";
import { getReviewsClient } from "@/lib/actions/review-actions";
import { getConsumerByAuthId } from "@/lib/api/consumer";

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
        console.debug("HomeClient: resolved authId:", authId);
        if (!authId) return;

        const cons = await getConsumerByAuthId(authId);
        console.debug("HomeClient: raw consumer response:", cons);

        // cons should now be the consumer object; handle both shapes just in case
        const consumerObj = cons?.data ?? cons;
        const cid = consumerObj?.id ?? consumerObj?._id ?? null;
        setConsumerId(cid);
        console.debug("HomeClient: consumerId:", cid);
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
        console.error("HomeClient: failed to load reviews", err);
        const server = err?.response?.data ?? err?.message ?? err;
        setError(typeof server === "string" ? server : JSON.stringify(server));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Reviews</h1>
        <div style={{ color: "#6b7280", fontSize: 14 }}>{pagination ? `Page ${pagination.page} · ${pagination.totalItems} items` : ""}</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingRight: 8, display: "flex", flexDirection: "column", gap: 16 }}>
        {loading && <div>Loading reviews…</div>}

        {error && (
          <div>
            <div style={{ color: "#b91c1c", background: "#fff5f5", padding: 12, borderRadius: 8 }}>{`Failed to load reviews: ${error}`}</div>
            <pre style={{ background: "#f3f4f6", padding: 12, borderRadius: 8, marginTop: 12 }}>{error}</pre>
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div style={{ color: "#6b7280", padding: 12, background: "#f8fafc", borderRadius: 8 }}>No reviews yet.</div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            {reviews.map((r) => (
              <div key={r._id ?? r.id} style={{ width: "100%", maxWidth: 720 }}>
                <ReviewCard review={r} currentUserId={consumerId} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
