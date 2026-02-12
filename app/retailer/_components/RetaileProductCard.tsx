"use client";
import React, { useState, useMemo } from "react";
import type { Product } from "../_schemas/product.schema";
import { deleteProductClient, serverUploadProductImage, updateProductClient } from "../../../lib/actions/product-actions";
import { toast } from "react-toastify";

type Props = {
  product: Product;
  onDeleted?: (id: string) => void;
  onUpdated?: (updated: Product) => void;
};

const SENTIMENTS = ["calm", "cozy", "joy", "minimalist", "nostalgic", "excited"];

export default function RetailerProductCard({ product, onDeleted, onUpdated }: Props) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description || "");
  const [targetSentiment, setTargetSentiment] = useState<string[]>(product.targetSentiment || []);

  const selectedSet = useMemo(() => new Set(targetSentiment), [targetSentiment]);

  /* ------------------ DELETE ------------------ */
  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await deleteProductClient(product._id);
      if (res.success) {
        toast.success("Product deleted successfully!");
        if (onDeleted) onDeleted(product._id);
        setIsModalOpen(false);
      } else {
        toast.error( "Failed to delete product.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error deleting product.");
    }
  }

  /* ------------------ UPDATE PRODUCT ------------------ */
  async function handleUpdate() {
    try {
      // Send proper JSON array for targetSentiment
      const updated = await updateProductClient(product._id, {
        title,
        description,
        targetSentiment: targetSentiment,
      });
      toast.success("Product updated successfully!");
      if (onUpdated) onUpdated(updated);
      setMode("view");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update product");
    }
  }

  /* ------------------ UPDATE IMAGE ------------------ */
  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setIsUploading(true);
    try {
      await serverUploadProductImage(product._id, f);
      toast.success("Image updated successfully!");
      setImageFile(f);
      if (onUpdated) onUpdated({ ...product, image: URL.createObjectURL(f) } as Product);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update image");
    } finally {
      setIsUploading(false);
    }
  }

  const toggleSentiment = (s: string) => {
    setTargetSentiment((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  return (
    <>
      {/* Card */}
      <div className="card" onClick={() => { setIsModalOpen(true); setMode("view"); }}>
        <div className="imgWrap">
          {product.image ? (
            <img src={imageFile ? URL.createObjectURL(imageFile) : `${BASE_URL}${product.image}`} alt={product.title} />
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modalOverlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modalHeader">
              <h2>{mode === "view" ? "Product Details" : "Edit Product"}</h2>
              <button onClick={() => { setIsModalOpen(false); setMode("view"); }}>✖</button>
            </div>

            {/* Body */}
            <div className="modalBody">
              <div className="imageWrapper">
                {product.image ? (
                  <img src={imageFile ? URL.createObjectURL(imageFile) : `${BASE_URL}${product.image}`} alt={product.title} />
                ) : (
                  <div className="placeholder">No image</div>
                )}
                <label className="editIcon">
                  ✎
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                </label>
                {isUploading && <div className="uploading">Uploading...</div>}
              </div>

              {/* View Mode */}
              {mode === "view" && (
                <>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <div className="sentiments">
                    {product.targetSentiment?.map((s) => (
                      <span key={s} className="sentiment">{s}</span>
                    ))}
                  </div>
                  <div className="buttons">
                    <button className="updateBtn" onClick={() => setMode("edit")}>Update</button>
                    <button className="deleteBtn" onClick={handleDelete}>Delete</button>
                  </div>
                </>
              )}

              {/* Edit Mode */}
              {mode === "edit" && (
                <div className="editForm">
                  <div className="field">
                    <label>Title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Target Sentiments</label>
                    <div className="sentimentGrid">
                      {SENTIMENTS.map((s) => {
                        const selected = selectedSet.has(s);
                        return (
                          <button key={s} type="button" className={`sentiment ${selected ? "selected" : ""}`} onClick={() => toggleSentiment(s)}>
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button className="updateSubmitBtn" onClick={handleUpdate}>Save Changes</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .card { background:#fff; border-radius:8px; padding:12px; box-shadow:0 6px 18px rgba(16,24,40,0.04); display:flex; flex-direction:column; gap:8px; cursor:pointer; }
        .imgWrap { height:140px; border-radius:8px; overflow:hidden; background:#f3f4f6; display:flex; align-items:center; justify-content:center; position:relative; }
        img { width:100%; height:100%; object-fit:cover; }
        .placeholder { color:#9ca3af; }
        .body { display:flex; flex-direction:column; gap:6px; }
        .title { font-weight:800; }
        .meta { display:flex; align-items:center; gap:8px; font-size:13px; color:#6b7280; }
        .icon { width:28px; height:28px; border-radius:6px; object-fit:cover; }
        .desc { color:#374151; font-size:14px; margin-top:6px; }

        /* Modal */
        .modalOverlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:999; }
        .modal { background:#fff; border-radius:8px; width:90%; max-width:700px; max-height:90vh; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:12px; }
        .modalHeader { display:flex; justify-content:space-between; align-items:center; }
        .modalBody { display:flex; flex-direction:column; gap:12px; }
        .buttons { display:flex; gap:12px; margin-top:12px; }
        .updateBtn { border:1px solid #2563eb; background:#fff; color:#2563eb; padding:8px 12px; border-radius:6px; cursor:pointer; }
        .deleteBtn { background:#c00; color:#fff; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; }
        .editForm .field { display:flex; flex-direction:column; margin-bottom:12px; }
        .editForm label { font-weight:700; margin-bottom:4px; }
        .editForm input, .editForm textarea { padding:8px; border-radius:6px; border:1px solid #e6e6e6; }
        .sentimentGrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(80px,1fr)); gap:6px; }
        .sentiment { padding:6px; border-radius:6px; border:1px solid #e6e6e6; cursor:pointer; text-align:center; text-transform:capitalize; }
        .sentiment.selected { border-color:#2563eb; background:rgba(37,99,235,0.1); }
        .updateSubmitBtn { padding:10px 14px; border-radius:6px; background:#2563eb; color:#fff; border:none; cursor:pointer; margin-top:8px; }
        .imageWrapper { position:relative; width:100%; height:200px; border-radius:8px; overflow:hidden; }
        .editIcon { position:absolute; top:8px; right:8px; border:1px solid #2563eb; background:#fff; border-radius:50%; padding:6px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:bold; }
        .uploading { position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,0.6); color:#fff; padding:4px 8px; border-radius:4px; font-size:12px; }
      `}</style>
    </>
  );
}
