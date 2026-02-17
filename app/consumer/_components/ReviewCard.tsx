// app/consumer/_components/ReviewCard.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Heart, Save, X } from "lucide-react";
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

  // author details fetched up front
  const [author, setAuthor] = useState<any | null>(null);
  const [authorLoading, setAuthorLoading] = useState(false);
  const [authorError, setAuthorError] = useState<string | null>(null);

  // modal state
  const [open, setOpen] = useState(false);

  // compute image src
  const imageSrc = useMemo(() => {
    const img = review?.productImage ?? "";
    if (!img) return null;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  }, [review?.productImage]);

  // sync likesCount when review changes
  useEffect(() => {
    setLikesCount(initialLikes);
  }, [initialLikes, reviewId]);

  // check if current user liked this review
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!currentUserId || !reviewId) return;
      try {
        const resp = await isReviewLikedClient(reviewId, currentUserId);
        const likedVal =
          resp === true || resp?.liked === true || resp?.data?.liked === true;
        if (mounted) setLiked(Boolean(likedVal));
      } catch (err) {
        console.warn("isReviewLiked failed", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [currentUserId, reviewId]);

  // fetch author details up front and normalize response shapes
  useEffect(() => {
    let mounted = true;
    (async () => {
      setAuthorLoading(true);
      setAuthorError(null);
      setAuthor(null);

      // candidate may be authId or consumer _id depending on how review was created
      const candidate =
        review?.authorId ?? review?.authorAuthId ?? review?.author?._id ?? null;
      if (!candidate) {
        setAuthorError("No author id provided");
        setAuthorLoading(false);
        return;
      }

      try {
        // Try authId lookup first
        try {
          const res = await getConsumerByAuthId(candidate);
          const consumerObj = res?.data ?? res ?? null;
          if (consumerObj) {
            if (mounted) setAuthor(consumerObj);
            setAuthorLoading(false);
            return;
          }
        } catch (e) {
          // continue to fallback
          console.debug("getConsumerByAuthId failed", e);
        }

        // Fallback: try by consumer document id
        try {
          const res2 = await getConsumerById(candidate);
          const consumerObj2 = res2?.data ?? res2 ?? null;
          if (consumerObj2) {
            if (mounted) setAuthor(consumerObj2);
            setAuthorLoading(false);
            return;
          }
        } catch (e) {
          console.debug("getConsumerById failed", e);
        }

        // final fallback: if review.author exists and looks like a consumer object, use it
        if (review?.author && typeof review.author === "object") {
          if (mounted) setAuthor(review.author);
          setAuthorLoading(false);
          return;
        }

        if (mounted) setAuthorError("Author not found");
      } catch (err) {
        console.error("fetch author error", err);
        if (mounted) setAuthorError("Failed to load author");
      } finally {
        if (mounted) setAuthorLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [review?.authorId, review?.author]);

  async function handleToggleLike() {
    if (!currentUserId) {
      alert("Please log in to like reviews.");
      return;
    }
    if (!reviewId) return;

    const prevLiked = liked;
    const prevCount = likesCount;

    // optimistic update
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
    setLoadingLike(true);

    try {
      if (!prevLiked) {
        const resp = await likeReviewClient(reviewId, currentUserId);
        const updated = resp?.data ?? resp;
        setLikesCount(
          updated?.likes ??
            (Array.isArray(updated?.likedBy)
              ? updated.likedBy.length
              : likesCount),
        );
        setLiked(true);
      } else {
        const resp = await unlikeReviewClient(reviewId, currentUserId);
        const updated = resp?.data ?? resp;
        setLikesCount(
          updated?.likes ??
            (Array.isArray(updated?.likedBy)
              ? updated.likedBy.length
              : Math.max(0, likesCount - 1)),
        );
        setLiked(false);
      }
    } catch (err) {
      console.error("like/unlike failed", err);
      setLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setLoadingLike(false);
    }
  }

  async function toggleSave(e: React.MouseEvent) {
    e.stopPropagation();
    if (!currentUserId) return;
    try {
      if (saved) {
        setSaved(false);
        await unsaveReview(review._id);
      } else {
        setSaved(true);
        await saveReview(review._id);
      }
    } catch (err) {
      console.error("Review save toggle failed", err);
    }
  }

  function openModal() {
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
  }

  // Helper to render author display values with fallbacks
  const displayName =
    author?.fullName ?? author?.username ?? review?.authorName ?? "Unknown";
  const displayHandle = author?.username
    ? `@${author.username}`
    : (review?.authorLocation ?? "");
  const displayPhone = author?.phoneNumber ?? "";

  return (
    <>
      <article
        style={{
          border: "1px solid #e6e6e6",
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
          maxWidth: 720,
          margin: "0 auto",
          boxShadow: "0 6px 18px rgba(16,24,40,0.04)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
          }}
        >
          {/* Avatar: image if available, otherwise initials */}
          <div
            aria-hidden
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#fff",
              background: "#9ca3af",
              flexShrink: 0,
            }}
          >
            {(() => {
              // Resolve avatar URL from author object or review fallback
              const candidateImg =
                author?.profileImage ??
                author?.profilePicture ??
                author?.avatar ??
                author?.picture ??
                author?.image ??
                author?.photo ??
                review?.authorPicture ??
                review?.authorImage ??
                null;

              if (candidateImg) {
                // If candidateImg is already an absolute URL, use it; otherwise prefix BASE_URL
                const url =
                  typeof candidateImg === "string" &&
                  (candidateImg.startsWith("http://") ||
                    candidateImg.startsWith("https://"))
                    ? candidateImg
                    : `${BASE_URL}${candidateImg.startsWith("/") ? "" : "/"}${candidateImg}`;

                // Render as background image for consistent cropping
                return (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundImage: `url("${url}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                );
              }

              // Fallback: initials from author fullName, username, or review authorName
              const name = (
                author?.fullName ??
                author?.username ??
                review?.authorName ??
                "U"
              ).toString();
              const initials = name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((n: string) => n.charAt(0).toUpperCase())
                .join("");
              return (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {initials}
                </div>
              );
            })()}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              {author?.fullName ??
                author?.username ??
                review?.authorName ??
                "Unknown"}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {author?.username
                ? `@${author.username}`
                : (review?.authorLocation ?? "")}
            </div>
          </div>

          <div style={{ marginLeft: "auto", fontSize: 12, color: "#6b7280" }}>
            {authorLoading
              ? "Loading author…"
              : authorError
                ? "Author not found"
                : ""}
          </div>
        </div>

        {/* Large image (clickable) */}
        <div
          style={{
            width: "100%",
            background: "#000",
            display: "block",
            position: "relative",
            cursor: imageSrc ? "pointer" : "default",
          }}
        >
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={review?.title ?? "review image"}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                aspectRatio: "4 / 5",
                objectFit: "cover",
              }}
              onClick={openModal}
            />
          ) : (
            <div
              style={{
                width: "100%",
                paddingTop: "125%",
                background: "#111827",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
              onClick={openModal}
            >
              No image
            </div>
          )}
        </div>

        {/* Actions row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
          }}
        >
          <button
            onClick={handleToggleLike}
            disabled={loadingLike}
            aria-pressed={liked}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: liked ? "#ef4444" : "#111827",
              cursor: loadingLike ? "wait" : "pointer",
              fontWeight: 600,
              fontSize: 16,
            }}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart
              size={18}
              fill={liked ? "#ef4444" : "none"}
              stroke={liked ? "#ef4444" : undefined}
            />
            <span style={{ fontSize: 13, opacity: 0.95 }}>{likesCount}</span>
          </button>

          <button
            onClick={toggleSave}
            disabled={saving}
            aria-pressed={saved}
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: saved ? "#111827" : "#111827",
              cursor: saving ? "wait" : "pointer",
              fontWeight: 600,
              fontSize: 16,
            }}
            aria-label={saved ? "Unsave" : "Save"}
          >
            <Save
              size={18}
              fill={saved ? "#111827" : "none"}
              stroke={saved ? "#111827" : undefined}
            />
            <span style={{ fontSize: 13, opacity: 0.95 }}>
              {saved ? "Saved" : "Save"}
            </span>
          </button>
        </div>

        {/* Caption / description */}
        <div style={{ padding: "0 14px 14px 14px" }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            {review?.title}
          </div>
          <div style={{ color: "#374151", marginBottom: 8 }}>
            {review?.description}
          </div>
          {Array.isArray(review?.sentiments) && (
            <div style={{ color: "#6b7280", fontSize: 13 }}>
              {review.sentiments.map((s: string) => (
                <span key={s} style={{ marginRight: 8 }}>
                  #{s}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Modal (reuses author state) */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.5)",
            padding: 20,
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 900,
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 10px 40px rgba(2,6,23,0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ fontWeight: 700 }}>Review details</div>
              <button
                onClick={closeModal}
                aria-label="Close"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X />
              </button>
            </div>

            <div style={{ display: "flex", gap: 16, padding: 16 }}>
              {/* Left: large image */}
              <div style={{ flex: "0 0 420px" }}>
                {imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageSrc}
                    alt={review?.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      paddingTop: "75%",
                      background: "#111827",
                      borderRadius: 8,
                    }}
                  />
                )}
              </div>

              {/* Right: review + author */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>
                    {review?.title}
                  </div>
                  <div style={{ color: "#6b7280", marginTop: 6 }}>
                    {review?.productName}
                  </div>
                  <div style={{ color: "#9ca3af", marginTop: 6 }}>
                    {new Date(review?.createdAt ?? Date.now()).toLocaleString()}
                  </div>
                </div>

                <div style={{ color: "#111827" }}>{review?.description}</div>

                <div style={{ marginTop: 8 }}>
                  <strong>Sentiments:</strong>{" "}
                  {Array.isArray(review?.sentiments)
                    ? review.sentiments.join(", ")
                    : "—"}
                </div>

                <div style={{ borderTop: "1px solid #eee", paddingTop: 12 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Author</div>

                  {authorLoading ? (
                    <div>Loading author…</div>
                  ) : authorError ? (
                    <div style={{ color: "#b91c1c" }}>{authorError}</div>
                  ) : author ? (
                    <div
                      style={{ display: "flex", gap: 12, alignItems: "center" }}
                    >
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 12,
                          overflow: "hidden",
                          background: "#f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                        }}
                      >
                        {author?.fullName
                          ? author.fullName.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontWeight: 700 }}>
                          {author?.fullName ?? author?.username ?? "Unknown"}
                        </div>
                        <div style={{ color: "#6b7280" }}>
                          {author?.username ? `@${author.username}` : ""}
                        </div>
                        <div style={{ color: "#6b7280", marginTop: 6 }}>
                          {author?.phoneNumber ?? ""}
                        </div>
                        {author?.bio && (
                          <div style={{ marginTop: 8 }}>{author.bio}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>No author information available.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
