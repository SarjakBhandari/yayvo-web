"use client";
import React, { useEffect, useState } from "react";
import type { Product } from "../../retailer/_schemas/product.schema";
import { isLikedClient, likeClient, unlikeClient } from "../../../lib/actions/product-actions";
import { saveProduct, unsaveProduct, fetchSavedProducts } from "@/lib/api/collection";
import { Heart, Bookmark } from "lucide-react";

type Props = {
  product: Product;
  currentUserId?: string | null;
};

export default function ProductCard({ product, currentUserId }: Props) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(product.noOfLikes || 0);
  const [saved, setSaved] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch initial like + saved status
  useEffect(() => {
    if (!currentUserId) return;
    let mounted = true;
    (async () => {
      try {
        // Like status
        const res = await isLikedClient(product._id, currentUserId);
        if (mounted) setLiked(Boolean(res?.liked));

        // Saved status
        const savedResp = await fetchSavedProducts(1, 100);
        const savedItems = savedResp?.items ?? savedResp?.data ?? [];
        const isSaved = savedItems.some((p: any) => String(p._id ?? p.productId) === String(product._id));
        if (mounted) setSaved(isSaved);
      } catch (err) {
        console.error("Failed to get status", err);
      }
    })();
    return () => { mounted = false; };
  }, [product._id, currentUserId]);

  // Toggle like/unlike
  async function toggleLike(e: React.MouseEvent) {
    e.stopPropagation(); // prevent triggering popup
    if (!currentUserId) return;
    try {
      if (liked) {
        setLiked(false);
        setLikesCount((c) => Math.max(0, c - 1));
        await unlikeClient(product._id, currentUserId);
      } else {
        setLiked(true);
        setLikesCount((c) => c + 1);
        await likeClient(product._id, currentUserId);
      }
    } catch (err) {
      console.error("Like toggle failed", err);
    }
  }

  // Toggle save/unsave
  async function toggleSave(e: React.MouseEvent) {
    e.stopPropagation(); // prevent triggering popup
    if (!currentUserId) return;
    try {
      if (saved) {
        setSaved(false);
        await unsaveProduct(product._id);
      } else {
        setSaved(true);
        await saveProduct(product._id);
      }
    } catch (err) {
      console.error("Save toggle failed", err);
    }
  }

  return (
    <>
      <div className="card" onClick={() => setShowPopup(true)}>
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
            {product.retailerIcon && (
              <img
                className="icon"
                src={`${BASE_URL}${product.retailerIcon}`}
                alt={product.retailerName}
              />
            )}
            <div className="retailer">{product.retailerName}</div>
          </div>
          <p className="desc">{product.description}</p>
          <div className="actions">
            <button className="likeBtn" onClick={toggleLike} aria-pressed={liked}>
              <Heart
                size={22}
                strokeWidth={2}
                stroke={liked ? "#ef4444" : "#374151"}
                fill={liked ? "#ef4444" : "none"}
              />
              <span className="count">{likesCount}</span>
            </button>
            <button className="saveBtn" onClick={toggleSave} aria-pressed={saved}>
              <Bookmark
                size={22}
                strokeWidth={2}
                stroke={saved ? "#2563eb" : "#374151"}
                fill={saved ? "#2563eb" : "none"}
              />
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popupOverlay" onClick={() => setShowPopup(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <button className="saveBtn" onClick={toggleSave}>
                <Bookmark size={20} fill={saved ? "#2563eb" : "none"} />
                {saved ? "Unsave" : "Save"}
              </button>
              <button className="closeBtn" onClick={() => setShowPopup(false)}>✕</button>
            </div>
            <div className="popupContent">
              <img src={`${BASE_URL}${product.image}`} alt={product.title} className="popupImage" />
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <div className="metaRow">
                <img className="icon" src={`${BASE_URL}${product.retailerIcon}`} alt={product.retailerName} />
                <span>{product.retailerName}</span>
              </div>
              <div className="tags">
                {(product.targetSentiment ?? []).map((t) => (
                  <span key={t} className="tag">#{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}



      <style jsx>{`
        .card {
          background: #fff;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 6px 18px rgba(16, 24, 40, 0.04);
          display: flex;
          flex-direction: column;
          gap: 8px;
          cursor: pointer;
        }
        .imgWrap {
          height: 140px;
          border-radius: 8px;
          overflow: hidden;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .placeholder { color: #9ca3af; }
        .body { display: flex; flex-direction: column; gap: 6px; }
        .title { font-weight: 800; }
        .meta { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6b7280; }
        .icon { width: 28px; height: 28px; border-radius: 6px; object-fit: cover; }
        .desc { color: #374151; font-size: 14px; margin-top: 6px; }
        .actions { display: flex; justify-content: flex-end; margin-top: 8px; }
        .likeBtn { background: transparent; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .count { font-size: 14px; color: ${liked ? "#ef4444" : "#374151"}; font-weight: 600; }

        .popupOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .popup {
          background: #fff;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
          padding: 16px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.2);
        }
        .popupHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .saveBtn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }
        .closeBtn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 18px;
        }
        .popupContent { display: flex; flex-direction: column; gap: 12px; }
        .popupImage { width: 100%; border-radius: 8px; object-fit: cover; }
        .metaRow { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #6b7280; }
        .tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .tag { background: #f3f4f6; padding: 4px 8px; border-radius: 6px; font-size: 12px; }
      `}</style>
    </>
  );
}
