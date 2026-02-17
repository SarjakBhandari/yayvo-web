// src/app/retailer/_components/RetaileProductCard.tsx
"use client";
import React, { useState, useMemo } from "react";
import type { Product } from "../_schemas/product.schema";
import { deleteProductClient, serverUploadProductImage, updateProductClient } from "../../../lib/actions/product-actions";
import { toast } from "react-toastify";
import { X, Edit2, Trash2, Camera, Loader2, Save, ShoppingBag } from "lucide-react";

type Props = {
  product: Product;
  onDeleted?: (id: string) => void;
  onUpdated?: (updated: Product) => void;
};

const SENTIMENTS = ["calm", "cozy", "joy", "minimalist", "nostalgic", "excited"];

const SENTIMENT_ICONS: Record<string, string> = {
  calm: "🌊", cozy: "🕯️", joy: "✨", minimalist: "◻️", nostalgic: "📷", excited: "🚀",
};

export default function RetailerProductCard({ product, onDeleted, onUpdated }: Props) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description || "");
  const [targetSentiment, setTargetSentiment] = useState<string[]>(product.targetSentiment || []);
  const selectedSet = useMemo(() => new Set(targetSentiment), [targetSentiment]);

  const imgSrc = imageFile
    ? URL.createObjectURL(imageFile)
    : product.image ? `${BASE_URL}${product.image}` : null;

  const iconSrc = product.retailerIcon ? `${BASE_URL}${product.retailerIcon}` : null;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await deleteProductClient(product._id);
      if (res.success) {
        toast.success("Product deleted.");
        onDeleted?.(product._id);
        setIsModalOpen(false);
      } else {
        toast.error("Failed to delete product.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error deleting product.");
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  }

  async function handleUpdate() {
    if (!title.trim()) { toast.warn("Title cannot be empty."); return; }
    setIsSaving(true);
    try {
      const updated = await updateProductClient(product._id, { title, description, targetSentiment });
      toast.success("Product updated!");
      onUpdated?.(updated);
      setMode("view");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update product.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setIsUploading(true);
    try {
      await serverUploadProductImage(product._id, f);
      toast.success("Image updated!");
      setImageFile(f);
      onUpdated?.({ ...product, image: URL.createObjectURL(f) } as Product);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update image.");
    } finally {
      setIsUploading(false);
    }
  }

  const toggleSentiment = (s: string) =>
    setTargetSentiment((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .rpc-card {
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
        .rpc-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(26,22,18,0.1); }

        .rpc-img-wrap {
          position: relative;
          overflow: hidden;
          background: #2A2420;
        }
        .rpc-img-wrap img {
          width: 100%; height: 180px;
          object-fit: cover;
          display: block;
          opacity: 0;
          transition: opacity 0.35s ease, transform 0.55s ease;
        }
        .rpc-img-wrap img.loaded { opacity: 1; }
        .rpc-card:hover .rpc-img-wrap img { transform: scale(1.04); }
        .rpc-no-img {
          width: 100%; height: 180px;
          background: linear-gradient(135deg, #2A2420 0%, #1A1612 100%);
          display: flex; align-items: center; justify-content: center;
          color: #4A3C2E; gap: 7px; font-size: 12px;
          font-family: 'DM Sans', sans-serif;
        }
        .rpc-img-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(to top, rgba(26,22,18,0.5) 0%, transparent 100%);
          pointer-events: none;
        }

        .rpc-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 6px; }
        .rpc-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.01em; line-height: 1.3;
        }
        .rpc-retailer-row { display: flex; align-items: center; gap: 7px; }
        .rpc-retailer-icon { width: 20px; height: 20px; border-radius: 5px; object-fit: cover; border: 1px solid #E8E4DC; flex-shrink: 0; }
        .rpc-retailer-name { font-size: 11px; color: #9C8E7A; font-weight: 500; text-transform: uppercase; letter-spacing: 0.03em; }
        .rpc-desc {
          font-size: 12px; color: #5A4C38; line-height: 1.55;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        /* Modal */
        .rpc-overlay {
          position: fixed; inset: 0;
          background: rgba(26,22,18,0.72);
          backdrop-filter: blur(7px);
          z-index: 1200;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: rpcFade 0.2s ease;
        }
        @keyframes rpcFade { from { opacity:0 } to { opacity:1 } }
        .rpc-modal {
          background: #FAFAF8;
          border-radius: 22px;
          max-width: 620px; width: 100%;
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 32px 80px rgba(0,0,0,0.3);
          animation: rpcSlide 0.25s ease;
          scrollbar-width: thin; scrollbar-color: #D4C8B4 transparent;
        }
        @keyframes rpcSlide { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .rpc-modal::-webkit-scrollbar { width: 4px; }
        .rpc-modal::-webkit-scrollbar-thumb { background: #D4C8B4; border-radius: 4px; }

        .rpc-modal-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px; border-bottom: 1px solid #E8E4DC;
          position: sticky; top: 0; background: #FAFAF8; z-index: 2;
          border-radius: 22px 22px 0 0;
        }
        .rpc-modal-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9C8E7A; font-weight: 500; }
        .rpc-close-btn {
          width: 34px; height: 34px; border-radius: 50%;
          background: #F0EBE1; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #5A4C38; transition: background 0.18s ease;
        }
        .rpc-close-btn:hover { background: #E8E4DC; }

        .rpc-modal-img-wrap { width: 100%; background: #1A1612; overflow: hidden; position: relative; }
        .rpc-modal-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
        .rpc-modal-img-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 40%;
          background: linear-gradient(to top, rgba(26,22,18,0.45) 0%, transparent 100%);
          pointer-events: none;
        }
        .rpc-modal-no-img {
          width: 100%; aspect-ratio: 16/9;
          background: linear-gradient(135deg, #2A2420 0%, #1A1612 100%);
          display: flex; align-items: center; justify-content: center;
          color: #4A3C2E; gap: 8px; font-size: 13px;
        }
        .rpc-change-img-btn {
          position: absolute; top: 12px; right: 12px;
          display: flex; align-items: center; gap: 6px;
          padding: 7px 12px; border-radius: 30px;
          background: rgba(26,22,18,0.75);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.1);
          color: #FAFAF8; font-size: 12px; font-weight: 500;
          cursor: pointer; transition: background 0.18s ease;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }
        .rpc-change-img-btn:hover { background: rgba(26,22,18,0.9); }
        .rpc-change-img-btn input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .rpc-uploading-badge {
          position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 7px;
          padding: 6px 14px; border-radius: 30px;
          background: rgba(26,22,18,0.82); color: #FAFAF8;
          font-size: 12px; font-weight: 500; font-family: 'DM Sans', sans-serif;
        }

        .rpc-modal-body { padding: 22px 24px 28px; display: flex; flex-direction: column; gap: 16px; }
        .rpc-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700; color: #1A1612;
          letter-spacing: -0.02em; line-height: 1.2;
        }
        .rpc-modal-desc { font-size: 14px; color: #5A4C38; line-height: 1.7; }
        .rpc-divider { height: 1px; background: #E8E4DC; }
        .rpc-tags-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #9C8E7A; font-weight: 500; margin-bottom: 8px; }
        .rpc-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .rpc-tag { background: #F0EBE1; color: #7A6A52; border-radius: 30px; padding: 4px 12px; font-size: 11px; font-weight: 500; }

        /* Action row */
        .rpc-action-row { display: flex; justify-content: flex-end; gap: 8px; }
        .rpc-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 18px; border-radius: 12px; border: none;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; transition: all 0.18s ease;
        }
        .rpc-btn:disabled { opacity: 0.5; cursor: wait; }
        .rpc-btn-edit { background: #F0EBE1; color: #5A4C38; border: 1px solid #E8E4DC; }
        .rpc-btn-edit:hover:not(:disabled) { background: #E8E4DC; }
        .rpc-btn-delete { background: #FFF1F1; color: #C0392B; border: 1px solid #FFCDD2; }
        .rpc-btn-delete:hover:not(:disabled) { background: #FFE5E5; }
        .rpc-btn-save { background: #1A1612; color: #FAFAF8; }
        .rpc-btn-save:hover:not(:disabled) { background: #2A2420; box-shadow: 0 6px 16px rgba(26,22,18,0.2); }
        .rpc-btn-cancel { background: transparent; color: #5A4C38; border: 1px solid #E8E4DC; }
        .rpc-btn-cancel:hover:not(:disabled) { background: #F0EBE1; }

        /* Delete confirm */
        .rpc-delete-confirm {
          background: #FFF8F5; border: 1px solid #FFDDD0; border-radius: 14px;
          padding: 16px; display: flex; flex-direction: column; gap: 12px;
        }
        .rpc-delete-confirm-title { font-weight: 600; font-size: 14px; color: #1A1612; }
        .rpc-delete-confirm-sub { font-size: 13px; color: #9C8E7A; }
        .rpc-delete-confirm-actions { display: flex; gap: 8px; justify-content: flex-end; }

        /* Edit form */
        .rpc-edit-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #1A1612; letter-spacing: -0.02em; }
        .rpc-field { display: flex; flex-direction: column; gap: 6px; }
        .rpc-field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9C8E7A; font-weight: 500; }
        .rpc-input, .rpc-textarea {
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          padding: 11px 14px; border-radius: 12px;
          border: 1px solid #E8E4DC; background: #FAFAF8; color: #1A1612;
          outline: none; width: 100%; box-sizing: border-box;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .rpc-input::placeholder, .rpc-textarea::placeholder { color: #B8A898; }
        .rpc-input:focus, .rpc-textarea:focus { border-color: #C9A96E; box-shadow: 0 0 0 3px rgba(201,169,110,0.12); }
        .rpc-textarea { min-height: 100px; resize: none; line-height: 1.6; }

        /* Sentiment grid */
        .rpc-sentiment-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .rpc-sentiment-btn {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 12px 8px; border-radius: 12px;
          border: 1px solid #E8E4DC; background: #FAFAF8;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500; color: #5A4C38;
          transition: all 0.18s ease;
        }
        .rpc-sentiment-btn:hover { background: #F0EBE1; }
        .rpc-sentiment-btn.selected { background: #1A1612; border-color: #1A1612; color: #FAFAF8; }
        .rpc-sentiment-emoji { font-size: 20px; line-height: 1; }
        .rpc-sentiment-label { text-transform: capitalize; }

        .rpc-spin { animation: rpcSpin 0.8s linear infinite; }
        @keyframes rpcSpin { to { transform: rotate(360deg) } }
      `}</style>

      {/* Card */}
      <article className="rpc-card" onClick={() => { setIsModalOpen(true); setMode("view"); setConfirmDelete(false); }}>
        <div className="rpc-img-wrap">
          {imgSrc ? (
            <>
              <img src={imgSrc} alt={product.title} className={imgLoaded ? "loaded" : ""} onLoad={() => setImgLoaded(true)} />
              <div className="rpc-img-overlay" />
            </>
          ) : (
            <div className="rpc-no-img"><ShoppingBag size={15} /> No image</div>
          )}
        </div>
        <div className="rpc-body">
          <div className="rpc-title">{product.title}</div>
          {(iconSrc || product.retailerName) && (
            <div className="rpc-retailer-row">
              {iconSrc && <img className="rpc-retailer-icon" src={iconSrc} alt={product.retailerName} />}
              {product.retailerName && <span className="rpc-retailer-name">{product.retailerName}</span>}
            </div>
          )}
          {product.description && <p className="rpc-desc">{product.description}</p>}
        </div>
      </article>

      {/* Modal */}
      {isModalOpen && (
        <div className="rpc-overlay" onClick={() => { setIsModalOpen(false); setMode("view"); setConfirmDelete(false); }}>
          <div className="rpc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rpc-modal-header">
              <div className="rpc-modal-label">{mode === "edit" ? "Edit Product" : "Product Details"}</div>
              <button className="rpc-close-btn" onClick={() => { setIsModalOpen(false); setMode("view"); setConfirmDelete(false); }}><X size={15} /></button>
            </div>

            {/* Hero image */}
            <div className="rpc-modal-img-wrap">
              {imgSrc ? (
                <>
                  <img src={imgSrc} alt={product.title} className="rpc-modal-img" />
                  <div className="rpc-modal-img-overlay" />
                </>
              ) : (
                <div className="rpc-modal-no-img"><ShoppingBag size={18} /> No image</div>
              )}
              <label className="rpc-change-img-btn">
                {isUploading ? <Loader2 size={13} className="rpc-spin" /> : <Camera size={13} />}
                {isUploading ? "Uploading…" : "Change photo"}
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>
              {isUploading && (
                <div className="rpc-uploading-badge">
                  <Loader2 size={12} className="rpc-spin" /> Uploading image…
                </div>
              )}
            </div>

            {/* View mode */}
            {mode === "view" && (
              <div className="rpc-modal-body">
                <div className="rpc-modal-title">{product.title}</div>
                {product.description && <p className="rpc-modal-desc">{product.description}</p>}

                {Array.isArray(product.targetSentiment) && product.targetSentiment.length > 0 && (
                  <>
                    <div className="rpc-divider" />
                    <div>
                      <div className="rpc-tags-label">Sentiments</div>
                      <div className="rpc-tags">
                        {product.targetSentiment.map((s) => (
                          <span key={s} className="rpc-tag">{SENTIMENT_ICONS[s] || ""} {s}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="rpc-divider" />

                {confirmDelete ? (
                  <div className="rpc-delete-confirm">
                    <div>
                      <div className="rpc-delete-confirm-title">Delete this product?</div>
                      <div className="rpc-delete-confirm-sub">This action cannot be undone.</div>
                    </div>
                    <div className="rpc-delete-confirm-actions">
                      <button className="rpc-btn rpc-btn-cancel" onClick={() => setConfirmDelete(false)}>Cancel</button>
                      <button className="rpc-btn rpc-btn-delete" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? <Loader2 size={13} className="rpc-spin" /> : <Trash2 size={13} />}
                        {isDeleting ? "Deleting…" : "Yes, Delete"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rpc-action-row">
                    <button className="rpc-btn rpc-btn-edit" onClick={() => setMode("edit")}><Edit2 size={13} /> Edit</button>
                    <button className="rpc-btn rpc-btn-delete" onClick={() => setConfirmDelete(true)}><Trash2 size={13} /> Delete</button>
                  </div>
                )}
              </div>
            )}

            {/* Edit mode */}
            {mode === "edit" && (
              <div className="rpc-modal-body">
                <div className="rpc-edit-title">Edit Product</div>

                <div className="rpc-field">
                  <label className="rpc-field-label">Title *</label>
                  <input className="rpc-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product title…" />
                </div>

                <div className="rpc-field">
                  <label className="rpc-field-label">Description</label>
                  <textarea className="rpc-textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product…" />
                </div>

                <div className="rpc-field">
                  <label className="rpc-field-label">Target Sentiments</label>
                  <div className="rpc-sentiment-grid">
                    {SENTIMENTS.map((s) => (
                      <button key={s} type="button" className={`rpc-sentiment-btn${selectedSet.has(s) ? " selected" : ""}`} onClick={() => toggleSentiment(s)}>
                        <span className="rpc-sentiment-emoji">{SENTIMENT_ICONS[s]}</span>
                        <span className="rpc-sentiment-label">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rpc-divider" />
                <div className="rpc-action-row">
                  <button className="rpc-btn rpc-btn-cancel" onClick={() => setMode("view")} disabled={isSaving}>Cancel</button>
                  <button className="rpc-btn rpc-btn-save" onClick={handleUpdate} disabled={isSaving}>
                    {isSaving ? <Loader2 size={13} className="rpc-spin" /> : <Save size={13} />}
                    {isSaving ? "Saving…" : "Save Changes"}
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