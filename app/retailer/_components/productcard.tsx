"use client";
import React, { useEffect, useState } from "react";
import type { Product } from "../_schemas/product.schema";
import { isLikedClient, likeClient, unlikeClient } from "../../../lib/actions/product-actions";

type Props = {
  product: Product;
  currentUserId?: string | null; // <-- add current user ID
};

export default function ProductCard({ product, currentUserId }: Props) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(product.noOfLikes || 0);

  // Fetch initial like status
  useEffect(() => {
    if (!currentUserId) return; // no user, skip

    let mounted = true;
    (async () => {
      try {
        const res = await isLikedClient(product._id, currentUserId);
        if (mounted) setLiked(Boolean(res?.liked));
      } catch (err) {
        console.error("Failed to get like status", err);
      }
    })();
    return () => { mounted = false; };
  }, [product._id, currentUserId]);

  // Toggle like/unlike
  async function toggleLike() {
    if (!currentUserId) return; // no user, skip

    try {
      if (liked) {
        await unlikeClient(product._id, currentUserId);
        setLiked(false);
        setLikesCount((c) => Math.max(0, c - 1));
      } else {
        await likeClient(product._id, currentUserId);
        setLiked(true);
        setLikesCount((c) => c + 1);
      }
    } catch (err) {
      console.error("Like toggle failed", err);
    }
  }

  return (
    <div className="card">
      <div className="imgWrap">
        {product.image ? (
          <img src={`${BASE_URL}${product.image}`} alt={product.title} />
        ) : (
          <div className="placeholder">No image</div>
        )}
      </div>
      <div className="body">
        <div className="title">{product.title}</div>
        <div className="meta">
          <img className="icon" src={`${BASE_URL}${product.retailerIcon}`} alt={product.retailerName} />
          <div className="retailer">{product.retailerName}</div>
        </div>
        <p className="desc">{product.description}</p>
      </div>

      <style jsx>{`
        .card { background:#fff; border-radius:8px; padding:12px; box-shadow:0 6px 18px rgba(16,24,40,0.04); display:flex; flex-direction:column; gap:8px; }
        .imgWrap { height:140px; border-radius:8px; overflow:hidden; background:#f3f4f6; display:flex; align-items:center; justify-content:center; }
        img { width:100%; height:100%; object-fit:cover; }
        .placeholder { color:#9ca3af; }
        .body { display:flex; flex-direction:column; gap:6px; }
        .title { font-weight:800; }
        .meta { display:flex; align-items:center; gap:8px; font-size:13px; color:#6b7280; }
        .icon { width:28px; height:28px; border-radius:6px; object-fit:cover; }
        .desc { color:#374151; font-size:14px; margin-top:6px; }
        .likeBtn { margin-left:auto; background:transparent; border:none; cursor:pointer; font-weight:700; }
      `}</style>
    </div>
  );
}
