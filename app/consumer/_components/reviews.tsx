"use client";
import React, { useEffect, useState } from "react";
import { getReviewsPaginated, updateReview, deleteReview } from "@/lib/api/reviews";
import { Edit2, Trash2, X, FileText, Loader2, Save, AlertTriangle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ConsumerReviews({ authId }: { authId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", sentiments: "" });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const resp = await getReviewsPaginated({ page: 1, size: 20, authorId: authId });
        setReviews(resp?.items ?? []);
      } catch {
        toast.error("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    })();
  }, [authId]);

  function openReview(r: any) {
    setSelected(r);
    setEditing(false);
    setImgLoaded(false);
    setForm({
      title: r.title ?? "",
      description: r.description ?? "",
      sentiments: (r.sentiments ?? []).join(", "),
    });
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      await deleteReview(id);
      setReviews((s) => s.filter((r) => r._id !== id));
      setSelected(null);
      toast.success("Review deleted.");
    } catch {
      toast.error("Failed to delete review.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleSaveEdit(id: string) {
    if (!form.title.trim()) {
      toast.warn("Title cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      const updates = {
        title: form.title.trim(),
        description: form.description.trim(),
        sentiments: form.sentiments.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const updated = await updateReview(id, updates);
      setReviews((s) => s.map((r) => (r._id === id ? updated : r)));
      setEditing(false);
      setSelected(null);
      toast.success("Review updated successfully.");
    } catch {
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050";

  function resolveImg(img: string | undefined) {
    if (!img) return null;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
  }

  return (
    <>
      {/* Toast container styled to match design system */}
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        toastStyle={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          borderRadius: 12,
          background: "#1A1612",
          color: "#FAFAF8",
          boxShadow: "0 8px 24px rgba(26,22,18,0.25)",
          border: "1px solid #2A2420",
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        .cr-section {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Header row */
        .cr-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .cr-heading-group { display: flex; flex-direction: column; gap: 2px; }
        .cr-eyebrow {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #9C8E7A;
          font-weight: 500;
        }
        .cr-heading {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: #1A1612;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .cr-count {
          font-size: 12px;
          color: #B8A898;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 30px;
          padding: 5px 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
          align-self: center;
        }

        /* Skeleton loader */
        .cr-skeletons {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .cr-sk-card {
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 16px;
          overflow: hidden;
          animation: crIn 0.4s ease both;
        }
        @keyframes crIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        .cr-sk-img { height: 160px; }
        .cr-sk-body { padding: 14px; display: flex; flex-direction: column; gap: 8px; }
        .sk {
          background: linear-gradient(90deg, #EDE8DE 25%, #E0D8CC 50%, #EDE8DE 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 6px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }

        /* Grid */
        .cr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        /* Review card */
        .cr-card {
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          box-shadow: 0 2px 8px rgba(26,22,18,0.04);
          animation: crIn 0.4s ease both;
        }
        .cr-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 32px rgba(26,22,18,0.1);
        }
        .cr-card-img-wrap {
          position: relative;
          overflow: hidden;
          background: #2A2420;
        }
        .cr-card-img-wrap img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
          opacity: 0;
          transition: opacity 0.35s ease, transform 0.5s ease;
        }
        .cr-card-img-wrap img.loaded { opacity: 1; }
        .cr-card:hover .cr-card-img-wrap img { transform: scale(1.04); }
        .cr-card-no-img {
          width: 100%;
          height: 160px;
          background: linear-gradient(135deg, #2A2420 0%, #1A1612 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4A3C2E;
          gap: 7px;
          font-size: 12px;
        }
        .cr-card-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(26,22,18,0.5) 0%, transparent 100%);
          pointer-events: none;
        }
        .cr-card-body { padding: 14px 14px 16px; }
        .cr-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 700;
          color: #1A1612;
          letter-spacing: -0.01em;
          line-height: 1.3;
          margin-bottom: 6px;
        }
        .cr-card-desc {
          font-size: 12px;
          color: #7A6A52;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Empty state */
        .cr-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 60px 20px;
          text-align: center;
        }
        .cr-empty-icon {
          width: 60px; height: 60px;
          border-radius: 18px;
          background: #F0EBE1;
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E;
        }
        .cr-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: #1A1612;
          font-weight: 700;
        }
        .cr-empty-sub { font-size: 13px; color: #9C8E7A; }

        /* ── Modal ── */
        .cr-overlay {
          position: fixed;
          inset: 0;
          background: rgba(26,22,18,0.72);
          backdrop-filter: blur(7px);
          z-index: 1200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: crFadeIn 0.2s ease;
        }
        @keyframes crFadeIn { from { opacity:0 } to { opacity:1 } }

        .cr-modal {
          background: #FAFAF8;
          border-radius: 22px;
          max-width: 620px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 32px 80px rgba(0,0,0,0.3);
          animation: crSlideUp 0.25s ease;
          scrollbar-width: thin;
          scrollbar-color: #D4C8B4 transparent;
        }
        @keyframes crSlideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .cr-modal::-webkit-scrollbar { width: 4px; }
        .cr-modal::-webkit-scrollbar-thumb { background: #D4C8B4; border-radius: 4px; }

        /* Modal header */
        .cr-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #E8E4DC;
          position: sticky;
          top: 0;
          background: #FAFAF8;
          z-index: 2;
          border-radius: 22px 22px 0 0;
        }
        .cr-modal-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9C8E7A;
          font-weight: 500;
        }
        .cr-close-btn {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: #F0EBE1;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #5A4C38;
          transition: background 0.18s ease;
        }
        .cr-close-btn:hover { background: #E8E4DC; }

        /* Modal image */
        .cr-modal-img-wrap {
          width: 100%;
          background: #1A1612;
          overflow: hidden;
          position: relative;
        }
        .cr-modal-img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .cr-modal-img.loaded { opacity: 1; }
        .cr-modal-img-gradient {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 45%;
          background: linear-gradient(to top, rgba(26,22,18,0.5) 0%, transparent 100%);
          pointer-events: none;
        }
        .cr-modal-no-img {
          width: 100%;
          aspect-ratio: 16/9;
          background: linear-gradient(135deg, #2A2420 0%, #1A1612 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4A3C2E;
          gap: 8px;
          font-size: 13px;
        }

        /* Modal body */
        .cr-modal-body {
          padding: 22px 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cr-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #1A1612;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .cr-modal-desc {
          font-size: 14px;
          color: #5A4C38;
          line-height: 1.7;
        }
        .cr-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .cr-meta-item {
          background: #F5F0E8;
          border: 1px solid #E8E4DC;
          border-radius: 10px;
          padding: 10px 12px;
        }
        .cr-meta-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #B8A898;
          font-weight: 500;
        }
        .cr-meta-value {
          font-size: 13px;
          color: #1A1612;
          font-weight: 500;
          margin-top: 3px;
        }
        .cr-divider { height: 1px; background: #E8E4DC; }
        .cr-tags-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9C8E7A;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .cr-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .cr-tag {
          background: #F0EBE1;
          color: #7A6A52;
          border-radius: 30px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        /* Action buttons */
        .cr-action-row {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding-top: 4px;
        }
        .cr-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.18s ease;
        }
        .cr-btn:disabled { opacity: 0.5; cursor: wait; }
        .cr-btn-edit {
          background: #F0EBE1;
          color: #5A4C38;
          border: 1px solid #E8E4DC;
        }
        .cr-btn-edit:hover:not(:disabled) { background: #E8E4DC; }
        .cr-btn-delete {
          background: #FFF1F1;
          color: #C0392B;
          border: 1px solid #FFCDD2;
        }
        .cr-btn-delete:hover:not(:disabled) { background: #FFE5E5; }
        .cr-btn-save {
          background: #1A1612;
          color: #FAFAF8;
        }
        .cr-btn-save:hover:not(:disabled) {
          background: #2A2420;
          box-shadow: 0 6px 16px rgba(26,22,18,0.2);
        }
        .cr-btn-cancel {
          background: transparent;
          color: #5A4C38;
          border: 1px solid #E8E4DC;
        }
        .cr-btn-cancel:hover:not(:disabled) { background: #F0EBE1; }

        /* Edit form */
        .cr-edit-heading {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #1A1612;
          letter-spacing: -0.02em;
        }
        .cr-field { display: flex; flex-direction: column; gap: 6px; }
        .cr-field-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9C8E7A;
          font-weight: 500;
        }
        .cr-input, .cr-textarea {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 11px 14px;
          border-radius: 12px;
          border: 1px solid #E8E4DC;
          background: #FAFAF8;
          color: #1A1612;
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .cr-input::placeholder, .cr-textarea::placeholder { color: #B8A898; }
        .cr-input:focus, .cr-textarea:focus {
          border-color: #C9A96E;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
        }
        .cr-textarea { min-height: 110px; resize: none; line-height: 1.6; }
        .cr-field-hint { font-size: 11px; color: #B8A898; }

        .cr-spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg) } }

        /* Delete confirm banner */
        .cr-delete-confirm {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFF8F5;
          border: 1px solid #FFDDD0;
          border-radius: 12px;
          padding: 14px 16px;
          color: #C0392B;
          font-size: 13px;
        }
        .cr-delete-confirm-text { flex: 1; }
        .cr-delete-confirm-title { font-weight: 600; margin-bottom: 2px; }
        .cr-delete-confirm-sub { color: #9C8E7A; font-size: 12px; }
      `}</style>

      <section className="cr-section">
        {/* Header */}
        <div className="cr-header">
          <div className="cr-heading-group">
            <div className="cr-eyebrow">Your Content</div>
            <h2 className="cr-heading">My Reviews</h2>
          </div>
          {!loading && reviews.length > 0 && (
            <div className="cr-count">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="cr-skeletons">
            {[0, 1, 2].map((i) => (
              <div key={i} className="cr-sk-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="sk cr-sk-img" />
                <div className="cr-sk-body">
                  <div className="sk" style={{ height: 14, width: "65%" }} />
                  <div className="sk" style={{ height: 11, width: "90%" }} />
                  <div className="sk" style={{ height: 11, width: "75%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && reviews.length === 0 && (
          <div className="cr-empty">
            <div className="cr-empty-icon"><FileText size={26} /></div>
            <div className="cr-empty-title">No reviews yet</div>
            <div className="cr-empty-sub">Reviews you create will appear here.</div>
          </div>
        )}

        {/* Grid */}
        {!loading && reviews.length > 0 && (
          <div className="cr-grid">
            {reviews.map((r, i) => {
              const src = resolveImg(r.image ?? r.productImage);
              return (
                <article
                  key={r._id}
                  className="cr-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => openReview(r)}
                >
                  <div className="cr-card-img-wrap">
                    {src ? (
                      <>
                        <img
                          src={src}
                          alt={r.title ?? "Review"}
                          className={r._imgLoaded ? "loaded" : ""}
                          onLoad={(e) => {
                            (e.target as HTMLImageElement).classList.add("loaded");
                          }}
                        />
                        <div className="cr-card-overlay" />
                      </>
                    ) : (
                      <div className="cr-card-no-img">
                        <FileText size={15} />
                        No image
                      </div>
                    )}
                  </div>
                  <div className="cr-card-body">
                    <div className="cr-card-title">{r.title ?? "Untitled Review"}</div>
                    <div className="cr-card-desc">{r.description ?? "No description provided"}</div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Modal ── */}
      {selected && (
        <div className="cr-overlay" onClick={() => { setSelected(null); setEditing(false); }}>
          <div className="cr-modal" onClick={(e) => e.stopPropagation()}>

            {/* Sticky header */}
            <div className="cr-modal-header">
              <div className="cr-modal-label">{editing ? "Editing Review" : "Review"}</div>
              <button className="cr-close-btn" onClick={() => { setSelected(null); setEditing(false); }} aria-label="Close">
                <X size={15} />
              </button>
            </div>

            {/* ── View mode ── */}
            {!editing && (() => {
              const src = resolveImg(selected.image ?? selected.productImage);
              return (
                <>
                  <div className="cr-modal-img-wrap">
                    {src ? (
                      <>
                        <img
                          src={src}
                          alt={selected.title}
                          className={`cr-modal-img${imgLoaded ? " loaded" : ""}`}
                          onLoad={() => setImgLoaded(true)}
                        />
                        <div className="cr-modal-img-gradient" />
                      </>
                    ) : (
                      <div className="cr-modal-no-img">
                        <FileText size={18} /> No image available
                      </div>
                    )}
                  </div>

                  <div className="cr-modal-body">
                    <div className="cr-modal-title">{selected.title ?? "Untitled Review"}</div>
                    {selected.description && (
                      <p className="cr-modal-desc">{selected.description}</p>
                    )}

                    <div className="cr-meta-grid">
                      {selected.productName && (
                        <div className="cr-meta-item">
                          <div className="cr-meta-label">Product</div>
                          <div className="cr-meta-value">{selected.productName}</div>
                        </div>
                      )}
                      {selected.authorName && (
                        <div className="cr-meta-item">
                          <div className="cr-meta-label">Author</div>
                          <div className="cr-meta-value">{selected.authorName}</div>
                        </div>
                      )}
                      {selected.authorLocation && (
                        <div className="cr-meta-item">
                          <div className="cr-meta-label">Location</div>
                          <div className="cr-meta-value">{selected.authorLocation}</div>
                        </div>
                      )}
                    </div>

                    {Array.isArray(selected.sentiments) && selected.sentiments.length > 0 && (
                      <>
                        <div className="cr-divider" />
                        <div>
                          <div className="cr-tags-label">Sentiments</div>
                          <div className="cr-tags">
                            {selected.sentiments.map((s: string, idx: number) => (
                              <span key={`${s}-${idx}`} className="cr-tag">#{s}</span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="cr-divider" />
                    <div className="cr-action-row">
                      <button className="cr-btn cr-btn-edit" onClick={() => setEditing(true)}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        className="cr-btn cr-btn-delete"
                        onClick={() => handleDelete(selected._id)}
                        disabled={deleting}
                      >
                        {deleting
                          ? <Loader2 size={14} className="cr-spin" />
                          : <Trash2 size={14} />
                        }
                        {deleting ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* ── Edit mode ── */}
            {editing && (
              <div className="cr-modal-body">
                <div className="cr-edit-heading">Edit Review</div>

                <div className="cr-field">
                  <label className="cr-field-label">Title *</label>
                  <input
                    className="cr-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Give your review a title…"
                  />
                </div>

                <div className="cr-field">
                  <label className="cr-field-label">Description</label>
                  <textarea
                    className="cr-textarea"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Share your thoughts in detail…"
                  />
                </div>

                <div className="cr-field">
                  <label className="cr-field-label">Sentiments</label>
                  <input
                    className="cr-input"
                    value={form.sentiments}
                    onChange={(e) => setForm({ ...form, sentiments: e.target.value })}
                    placeholder="e.g. quality, value, design"
                  />
                  <span className="cr-field-hint">Separate multiple sentiments with commas</span>
                </div>

                <div className="cr-divider" />
                <div className="cr-action-row">
                  <button className="cr-btn cr-btn-cancel" onClick={() => setEditing(false)} disabled={saving}>
                    Cancel
                  </button>
                  <button
                    className="cr-btn cr-btn-save"
                    onClick={() => handleSaveEdit(selected._id)}
                    disabled={saving}
                  >
                    {saving ? <Loader2 size={14} className="cr-spin" /> : <Save size={14} />}
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}