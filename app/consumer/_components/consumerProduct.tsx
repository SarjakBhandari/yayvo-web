"use client";
import React, { useEffect, useState } from "react";
import type { Product } from "../../retailer/_schemas/product.schema";
import { isLikedClient, likeClient, unlikeClient } from "../../../lib/actions/product-actions";
import { saveProduct, unsaveProduct, fetchSavedProducts } from "@/lib/api/collection";
import { Heart, Bookmark, X } from "lucide-react";

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
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    let mounted = true;
    (async () => {
      try {
        const res = await isLikedClient(product._id, currentUserId);
        if (mounted) setLiked(Boolean(res?.liked));
        const savedResp = await fetchSavedProducts(1, 100);
        const savedItems = savedResp?.items ?? savedResp?.data ?? [];
        const isSaved = false;
        if (mounted) setSaved(isSaved);
      } catch (err) { console.error("Failed to get status", err); }
    })();
    return () => { mounted = false; };
  }, [product._id, currentUserId]);

  async function toggleLike(e: React.MouseEvent) {
    e.stopPropagation();
    if (!currentUserId) return;
    try {
      if (liked) { setLiked(false); setLikesCount((c) => Math.max(0, c - 1)); await unlikeClient(product._id, currentUserId); }
      else { setLiked(true); setLikesCount((c) => c + 1); await likeClient(product._id, currentUserId); }
    } catch (err) { console.error("Like toggle failed", err); }
  }

  async function toggleSave(e: React.MouseEvent) {
    e.stopPropagation();
    if (!currentUserId) return;
    try {
      if (saved) { setSaved(false); await unsaveProduct(product._id); }
      else { setSaved(true); await saveProduct(product._id); }
    } catch (err) { console.error("Save toggle failed", err); }
  }

  const imgSrc = product.image ? `${BASE_URL}${product.image}` : null;
  const iconSrc = product.retailerIcon ? `${BASE_URL}${product.retailerIcon}` : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .pc-card {
          font-family: 'DM Sans', sans-serif;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 2px 10px rgba(26,22,18,0.04);
        }
        .pc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 36px rgba(26,22,18,0.1);
        }
        .pc-img-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #2A2420;
        }
        .pc-img-wrap img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease, opacity 0.35s ease;
          opacity: 0;
        }
        .pc-img-wrap img.loaded { opacity: 1; }
        .pc-card:hover .pc-img-wrap img { transform: scale(1.04); }
        .pc-img-placeholder {
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #2A2420 0%, #1A1612 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6B5D4F;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
        }
        .pc-img-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60%;
          background: linear-gradient(to top, rgba(26,22,18,0.55) 0%, transparent 100%);
          pointer-events: none;
        }
        .pc-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .pc-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 700;
          color: #1A1612;
          line-height: 1.3;
          letter-spacing: -0.02em;
        }
        .pc-retailer-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pc-retailer-icon {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          object-fit: cover;
          border: 1px solid #E8E4DC;
          flex-shrink: 0;
        }
        .pc-retailer-name {
          font-size: 12px;
          color: #9C8E7A;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .pc-desc {
          font-size: 13px;
          color: #5A4C38;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pc-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          padding-top: 10px;
          border-top: 1px solid #F0EBE1;
        }
        .pc-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 30px;
          border: 1px solid #E8E4DC;
          background: transparent;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #5A4C38;
          transition: all 0.18s ease;
        }
        .pc-btn:hover { background: #F0EBE1; }
        .pc-btn.liked { background: #FFF1F1; border-color: #FFCDD2; color: #D32F2F; }
        .pc-btn.saved { background: #1A1612; border-color: #1A1612; color: #FAFAF8; }

        /* Modal */
        .pc-overlay {
          position: fixed;
          inset: 0;
          background: rgba(26,22,18,0.7);
          backdrop-filter: blur(6px);
          z-index: 1200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: pcFadeIn 0.2s ease;
        }
        @keyframes pcFadeIn { from { opacity: 0 } to { opacity: 1 } }
        .pc-modal {
          background: #FAFAF8;
          border-radius: 20px;
          max-width: 560px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 30px 80px rgba(0,0,0,0.3);
          animation: pcSlideUp 0.25s ease;
        }
        @keyframes pcSlideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        .pc-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 22px;
          border-bottom: 1px solid #E8E4DC;
        }
        .pc-modal-actions { display: flex; gap: 8px; align-items: center; }
        .pc-close-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #F0EBE1;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5A4C38;
          transition: background 0.18s ease;
          flex-shrink: 0;
        }
        .pc-close-btn:hover { background: #E8E4DC; }
        .pc-modal-img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
        }
        .pc-modal-body {
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .pc-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #1A1612;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .pc-modal-desc {
          font-size: 14px;
          color: #5A4C38;
          line-height: 1.7;
        }
        .pc-modal-retailer {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: #F5F0E8;
          border-radius: 12px;
        }
        .pc-modal-retailer-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid #E8E4DC;
        }
        .pc-modal-retailer-name {
          font-size: 13px;
          font-weight: 500;
          color: #5A4C38;
        }
        .pc-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .pc-tag {
          background: #F0EBE1;
          color: #7A6A52;
          border-radius: 30px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .pc-divider { height: 1px; background: #E8E4DC; }
      `}</style>

      {/* Card */}
      <article className="pc-card" onClick={() => setShowPopup(true)}>
        <div className="pc-img-wrap">
          {imgSrc ? (
            <>
              <img
                src={imgSrc}
                alt={product.title}
                className={imgLoaded ? "loaded" : ""}
                onLoad={() => setImgLoaded(true)}
              />
              <div className="pc-img-overlay" />
            </>
          ) : (
            <div className="pc-img-placeholder">No image</div>
          )}
        </div>

        <div className="pc-body">
          <div className="pc-title">{product.title}</div>

          {(iconSrc || product.retailerName) && (
            <div className="pc-retailer-row">
              {iconSrc && <img className="pc-retailer-icon" src={iconSrc} alt={product.retailerName} />}
              {product.retailerName && <span className="pc-retailer-name">{product.retailerName}</span>}
            </div>
          )}

          {product.description && <p className="pc-desc">{product.description}</p>}

          <div className="pc-actions">
            <button className={`pc-btn${liked ? " liked" : ""}`} onClick={toggleLike} aria-pressed={liked}>
              <Heart size={13} fill={liked ? "currentColor" : "none"} />
              <span>{likesCount} {likesCount === 1 ? "like" : "likes"}</span>
            </button>
            <button className={`pc-btn${saved ? " saved" : ""}`} onClick={toggleSave} aria-pressed={saved} style={{ marginLeft: "auto" }}>
              <Bookmark size={13} fill={saved ? "currentColor" : "none"} />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </article>

      {/* Modal */}
      {showPopup && (
        <div className="pc-overlay" onClick={() => setShowPopup(false)}>
          <div className="pc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pc-modal-header">
              <div className="pc-modal-actions">
                <button className={`pc-btn${saved ? " saved" : ""}`} onClick={toggleSave}>
                  <Bookmark size={13} fill={saved ? "currentColor" : "none"} />
                  <span>{saved ? "Saved" : "Save"}</span>
                </button>
                <button className={`pc-btn${liked ? " liked" : ""}`} onClick={toggleLike}>
                  <Heart size={13} fill={liked ? "currentColor" : "none"} />
                  <span>{likesCount}</span>
                </button>
              </div>
              <button className="pc-close-btn" onClick={() => setShowPopup(false)} aria-label="Close">
                <X size={15} />
              </button>
            </div>

            {imgSrc && <img src={imgSrc} alt={product.title} className="pc-modal-img" />}

            <div className="pc-modal-body">
              <div className="pc-modal-title">{product.title}</div>
              {product.description && <p className="pc-modal-desc">{product.description}</p>}

              {(iconSrc || product.retailerName) && (
                <div className="pc-modal-retailer">
                  {iconSrc && <img className="pc-modal-retailer-icon" src={iconSrc} alt={product.retailerName} />}
                  <span className="pc-modal-retailer-name">{product.retailerName}</span>
                </div>
              )}

              {Array.isArray(product.targetSentiment) && product.targetSentiment.length > 0 && (
                <>
                  <div className="pc-divider" />
                  <div className="pc-tags">
                    {product.targetSentiment.map((t) => (
                      <span key={t} className="pc-tag">#{t}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}