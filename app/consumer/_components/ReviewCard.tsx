// app/consumer/_components/ReviewCard.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Heart, Bookmark, X, Star } from "lucide-react";
import {
  likeReviewClient,
  unlikeReviewClient,
  isReviewLikedClient,
} from "@/lib/actions/review-actions";
import { getConsumerByAuthId, getConsumerById } from "@/lib/api/consumer";
import { unsaveReview, saveReview } from "@/lib/api/collection";

type Props = {
  review: any;
  currentUserId: string | null;
};

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050";

export default function ReviewCard({ review, currentUserId }: Props) {
  const reviewId = review?._id ?? review?.id ?? null;

  const initialLikes = useMemo(() => {
    if (typeof review?.likes === "number") return review.likes;
    if (Array.isArray(review?.likedBy)) return review.likedBy.length;
    if (typeof review?.likesCount === "number") return review.likesCount;
    return 0;
  }, [review]);

  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(initialLikes);
  const [loadingLike, setLoadingLike] = useState(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);
  const [author, setAuthor] = useState<any | null>(null);
  const [authorLoading, setAuthorLoading] = useState(false);
  const [authorError, setAuthorError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const imageSrc = useMemo(() => {
    const img = review?.productImage ?? "";
    if (!img) return null;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  }, [review?.productImage]);

  useEffect(() => { setLikesCount(initialLikes); }, [initialLikes, reviewId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!currentUserId || !reviewId) return;
      try {
        const resp = await isReviewLikedClient(reviewId, currentUserId);
        const likedVal = resp === true || resp?.liked === true || resp?.data?.liked === true;
        if (mounted) setLiked(Boolean(likedVal));
      } catch (err) { console.warn("isReviewLiked failed", err); }
    })();
    return () => { mounted = false; };
  }, [currentUserId, reviewId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setAuthorLoading(true);
      setAuthorError(null);
      setAuthor(null);
      const candidate = review?.authorId ?? review?.authorAuthId ?? review?.author?._id ?? null;
      if (!candidate) { setAuthorError("No author id provided"); setAuthorLoading(false); return; }
      try {
        try {
          const res = await getConsumerByAuthId(candidate);
          const consumerObj = res?.data ?? res ?? null;
          if (consumerObj) { if (mounted) setAuthor(consumerObj); setAuthorLoading(false); return; }
        } catch (e) { console.debug("getConsumerByAuthId failed", e); }
        try {
          const res2 = await getConsumerById(candidate);
          const consumerObj2 = res2?.data ?? res2 ?? null;
          if (consumerObj2) { if (mounted) setAuthor(consumerObj2); setAuthorLoading(false); return; }
        } catch (e) { console.debug("getConsumerById failed", e); }
        if (review?.author && typeof review.author === "object") { if (mounted) setAuthor(review.author); setAuthorLoading(false); return; }
        if (mounted) setAuthorError("Author not found");
      } catch (err) {
        console.error("fetch author error", err);
        if (mounted) setAuthorError("Failed to load author");
      } finally { if (mounted) setAuthorLoading(false); }
    })();
    return () => { mounted = false; };
  }, [review?.authorId, review?.author]);

  async function handleToggleLike() {
    if (!currentUserId) { alert("Please log in to like reviews."); return; }
    if (!reviewId) return;
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
    setLoadingLike(true);
    try {
      if (!prevLiked) {
        const resp = await likeReviewClient(reviewId, currentUserId);
        const updated = resp?.data ?? resp;
        setLikesCount(updated?.likes ?? (Array.isArray(updated?.likedBy) ? updated.likedBy.length : likesCount));
        setLiked(true);
      } else {
        const resp = await unlikeReviewClient(reviewId, currentUserId);
        const updated = resp?.data ?? resp;
        setLikesCount(updated?.likes ?? (Array.isArray(updated?.likedBy) ? updated.likedBy.length : Math.max(0, likesCount - 1)));
        setLiked(false);
      }
    } catch (err) { console.error("like/unlike failed", err); setLiked(prevLiked); setLikesCount(prevCount); }
    finally { setLoadingLike(false); }
  }

  async function toggleSave(e: React.MouseEvent) {
    e.stopPropagation();
    if (!currentUserId) return;
    try {
      if (saved) { setSaved(false); await unsaveReview(review._id); }
      else { setSaved(true); await saveReview(review._id); }
    } catch (err) { console.error("Review save toggle failed", err); }
  }

  const getAvatarUrl = () => {
    const candidateImg = author?.profileImage ?? author?.profilePicture ?? author?.avatar ?? author?.picture ?? author?.image ?? author?.photo ?? review?.authorPicture ?? review?.authorImage ?? null;
    if (!candidateImg) return null;
    return typeof candidateImg === "string" && (candidateImg.startsWith("http://") || candidateImg.startsWith("https://"))
      ? candidateImg
      : `${BASE_URL}${candidateImg.startsWith("/") ? "" : "/"}${candidateImg}`;
  };

  const avatarUrl = getAvatarUrl();
  const displayName = author?.fullName ?? author?.username ?? review?.authorName ?? "Unknown";
  const displayHandle = author?.username ? `@${author.username}` : (review?.authorLocation ?? "");
  const initials = displayName.split(" ").filter(Boolean).slice(0, 2).map((n: string) => n.charAt(0).toUpperCase()).join("");
  const dateStr = review?.createdAt ? new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .rc-card {
          font-family: 'DM Sans', sans-serif;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          max-width: 680px;
          margin: 0 auto;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .rc-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.1);
        }
        .rc-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: #FAFAF8;
          border-bottom: 1px solid #F0EBE1;
        }
        .rc-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 14px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .rc-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .rc-name {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #1A1612;
          letter-spacing: -0.01em;
        }
        .rc-handle {
          font-size: 12px;
          color: #9C8E7A;
          margin-top: 1px;
        }
        .rc-date {
          margin-left: auto;
          font-size: 11px;
          color: #B8A898;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .rc-image-wrap {
          position: relative;
          width: 100%;
          background: #1A1612;
          overflow: hidden;
          cursor: pointer;
        }
        .rc-image-wrap img {
          width: 100%;
          height: auto;
          aspect-ratio: 4/5;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
          opacity: 0;
          transition: opacity 0.4s ease, transform 0.6s ease;
        }
        .rc-image-wrap img.loaded {
          opacity: 1;
        }
        .rc-image-wrap:hover img {
          transform: scale(1.03);
        }
        .rc-image-placeholder {
          width: 100%;
          padding-top: 125%;
          background: linear-gradient(135deg, #2A2420 0%, #1A1612 100%);
          position: relative;
        }
        .rc-image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(26,22,18,0.7) 0%, transparent 100%);
          pointer-events: none;
        }
        .rc-product-tag {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(250,250,248,0.92);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(232,228,220,0.8);
          border-radius: 30px;
          padding: 5px 12px;
          font-size: 11px;
          font-family: 'DM Sans', sans-serif;
          color: #5A4C38;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .rc-actions {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          gap: 6px;
          border-bottom: 1px solid #F0EBE1;
        }
        .rc-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 30px;
          border: 1px solid #E8E4DC;
          background: transparent;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #5A4C38;
          transition: all 0.2s ease;
        }
        .rc-btn:hover {
          background: #F0EBE1;
          border-color: #D4C8B4;
        }
        .rc-btn.liked {
          background: #FFF1F1;
          border-color: #FFCDD2;
          color: #D32F2F;
        }
        .rc-btn.saved {
          background: #1A1612;
          border-color: #1A1612;
          color: #FAFAF8;
        }
        .rc-btn:disabled { opacity: 0.6; cursor: wait; }
        .rc-body {
          padding: 16px 20px 20px;
        }
        .rc-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #1A1612;
          margin-bottom: 8px;
          line-height: 1.3;
          letter-spacing: -0.02em;
        }
        .rc-desc {
          font-size: 14px;
          color: #5A4C38;
          line-height: 1.65;
          margin-bottom: 14px;
        }
        .rc-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .rc-tag {
          background: #F0EBE1;
          color: #7A6A52;
          border-radius: 30px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        /* Modal */
        .rc-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 1200;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(26,22,18,0.7);
          backdrop-filter: blur(6px);
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .rc-modal {
          width: 100%;
          max-width: 960px;
          max-height: 90vh;
          overflow-y: auto;
          background: #FAFAF8;
          border-radius: 20px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.35);
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        .rc-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          border-bottom: 1px solid #E8E4DC;
        }
        .rc-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          color: #1A1612;
          font-weight: 700;
        }
        .rc-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #F0EBE1;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5A4C38;
          transition: background 0.2s ease;
        }
        .rc-close-btn:hover { background: #E8E4DC; }
        .rc-modal-body {
          display: flex;
          gap: 0;
        }
        .rc-modal-img-col {
          flex: 0 0 420px;
          background: #1A1612;
          border-bottom-left-radius: 20px;
        }
        .rc-modal-img-col img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-bottom-left-radius: 20px;
          display: block;
        }
        .rc-modal-info-col {
          flex: 1;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
        }
        .rc-modal-product {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9C8E7A;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
        }
        .rc-modal-review-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: #1A1612;
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin-top: 4px;
        }
        .rc-modal-desc {
          font-size: 14px;
          color: #5A4C38;
          line-height: 1.7;
        }
        .rc-divider {
          height: 1px;
          background: #E8E4DC;
        }
        .rc-modal-author-section h4 {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9C8E7A;
          margin-bottom: 14px;
        }
        .rc-modal-author-card {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 16px;
          background: #F5F0E8;
          border-radius: 14px;
        }
        .rc-modal-avatar {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 18px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          flex-shrink: 0;
          overflow: hidden;
        }
        .rc-modal-author-name {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 15px;
          color: #1A1612;
        }
        .rc-modal-author-handle {
          font-size: 12px;
          color: #9C8E7A;
          margin-top: 2px;
        }
        .rc-modal-author-bio {
          font-size: 13px;
          color: #5A4C38;
          margin-top: 6px;
          line-height: 1.5;
        }
        .rc-sentiments-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9C8E7A;
          margin-bottom: 8px;
        }
      `}</style>

      <article className="rc-card">
        {/* Header */}
        <div className="rc-header">
          <div className="rc-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} />
            ) : (
              initials || "U"
            )}
          </div>
          <div>
            <div className="rc-name">{displayName}</div>
            <div className="rc-handle">{displayHandle}</div>
          </div>
          {dateStr && <div className="rc-date">{dateStr}</div>}
        </div>

        {/* Image */}
        <div className="rc-image-wrap" onClick={() => setOpen(true)}>
          {imageSrc ? (
            <>
              <img
                src={imageSrc}
                alt={review?.title ?? "review"}
                className={imgLoaded ? "loaded" : ""}
                onLoad={() => setImgLoaded(true)}
              />
              <div className="rc-image-overlay" />
              {review?.productName && (
                <div className="rc-product-tag">{review.productName}</div>
              )}
            </>
          ) : (
            <div className="rc-image-placeholder">
              {review?.productName && (
                <div className="rc-product-tag">{review.productName}</div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="rc-actions">
          <button
            className={`rc-btn${liked ? " liked" : ""}`}
            onClick={handleToggleLike}
            disabled={loadingLike}
            aria-pressed={liked}
          >
            <Heart size={15} fill={liked ? "currentColor" : "none"} />
            <span>{likesCount} {likesCount === 1 ? "like" : "likes"}</span>
          </button>

          <button
            className={`rc-btn${saved ? " saved" : ""}`}
            onClick={toggleSave}
            disabled={saving}
            aria-pressed={saved}
            style={{ marginLeft: "auto" }}
          >
            <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
            <span>{saved ? "Saved" : "Save"}</span>
          </button>
        </div>

        {/* Body */}
        <div className="rc-body">
          {review?.title && <div className="rc-title">{review.title}</div>}
          {review?.description && <div className="rc-desc">{review.description}</div>}
          {Array.isArray(review?.sentiments) && review.sentiments.length > 0 && (
            <div className="rc-tags">
              {review.sentiments.map((s: string) => (
                <span key={s} className="rc-tag">#{s}</span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Modal */}
      {open && (
        <div className="rc-modal-bg" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="rc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rc-modal-header">
              <div className="rc-modal-title">Review</div>
              <button className="rc-close-btn" onClick={() => setOpen(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <div className="rc-modal-body">
              {/* Image col */}
              <div className="rc-modal-img-col">
                {imageSrc ? (
                  <img src={imageSrc} alt={review?.title} />
                ) : (
                  <div style={{ width: "100%", paddingTop: "100%", background: "#2A2420" }} />
                )}
              </div>

              {/* Info col */}
              <div className="rc-modal-info-col">
                {review?.productName && <div className="rc-modal-product">{review.productName}</div>}
                {review?.title && <div className="rc-modal-review-title">{review.title}</div>}
                {review?.description && <div className="rc-modal-desc">{review.description}</div>}

                {Array.isArray(review?.sentiments) && review.sentiments.length > 0 && (
                  <div>
                    <div className="rc-sentiments-label">Sentiments</div>
                    <div className="rc-tags">
                      {review.sentiments.map((s: string) => (
                        <span key={s} className="rc-tag">#{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rc-divider" />

                <div className="rc-modal-author-section">
                  <h4>Reviewed by</h4>
                  {authorLoading ? (
                    <div style={{ color: "#9C8E7A", fontSize: 13 }}>Loading author…</div>
                  ) : (
                    <div className="rc-modal-author-card">
                      <div className="rc-modal-avatar">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          initials || "U"
                        )}
                      </div>
                      <div>
                        <div className="rc-modal-author-name">{displayName}</div>
                        {displayHandle && <div className="rc-modal-author-handle">{displayHandle}</div>}
                        {author?.bio && <div className="rc-modal-author-bio">{author.bio}</div>}
                      </div>
                    </div>
                  )}
                </div>

                {review?.createdAt && (
                  <div style={{ fontSize: 11, color: "#B8A898", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Posted {new Date(review.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}