// app/consumer/create/CreateClient.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SentimentPicker from "@/app/_components/SentimentPicker";
import { createReviewClient, uploadReviewImageClient } from "@/lib/actions/review-actions";
import { getConsumerByAuthId } from "@/lib/api/consumer";
import { Upload, X, ArrowLeft, Loader2 } from "lucide-react";

export default function CreateClient({ userData }: { userData: any | null }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consumer, setConsumer] = useState<any | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!userData) return;
        const authId = userData?.id ?? null;
        if (!authId) return;
        const cons = await getConsumerByAuthId(authId);
        setConsumer(cons.data ?? null);
      } catch (err) {
        console.error("CreateClient: failed to load consumer", err);
        setError("Failed to load profile. Please try again.");
      }
    })();
  }, [userData]);

  useEffect(() => {
    if (!imageFile) { setImagePreview(null); return; }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImageFile(e.target.files?.[0] ?? null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) setImageFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const consumerId = consumer?._id ?? consumer?.id;
    if (!consumerId) { setError("Could not determine your consumer profile. Please re-login."); return; }
    if (!title.trim()) { setError("Title is required."); return; }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        sentiments: selectedSentiments,
        productName: productName.trim(),
        productImage: "",
        authorId: consumerId,
        authorLocation: consumer?.location ?? "",
      };
      const created = await createReviewClient(payload);
      const createdId = created?.data?._id ?? created?._id ?? created?.id ?? created;
      if (imageFile && createdId) {
        try { await uploadReviewImageClient(createdId, imageFile); }
        catch (uploadErr) { console.error("Image upload failed", uploadErr); setError("Review created but image upload failed."); }
      }
      router.push("/consumer/");
    } catch (err: any) {
      const server = err?.response?.data ?? err?.message ?? err;
      if (server?.errors) setError(server.errors.map((x: any) => `${x.param}: ${x.msg}`).join("; "));
      else if (server?.message) setError(server.message);
      else setError(typeof server === "string" ? server : JSON.stringify(server));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .cc-root {
          font-family: 'DM Sans', sans-serif;
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 680px;
        }
        .cc-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }
        .cc-back-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid #E8E4DC;
          background: #FAFAF8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5A4C38;
          transition: all 0.18s ease;
          flex-shrink: 0;
        }
        .cc-back-btn:hover { background: #F0EBE1; }
        .cc-heading-wrap { display: flex; flex-direction: column; gap: 1px; }
        .cc-eyebrow {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #9C8E7A;
          font-weight: 500;
        }
        .cc-heading {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #1A1612;
          margin: 0;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .cc-error {
          background: #FFF8F5;
          border: 1px solid #FFDDD0;
          border-radius: 12px;
          padding: 14px 16px;
          color: #C0392B;
          font-size: 13px;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .cc-form {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Field groups */
        .cc-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
        }
        .cc-label {
          font-size: 12px;
          font-weight: 600;
          color: #5A4C38;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .cc-input, .cc-textarea {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #E8E4DC;
          background: #FAFAF8;
          color: #1A1612;
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          resize: none;
          width: 100%;
          box-sizing: border-box;
        }
        .cc-input::placeholder, .cc-textarea::placeholder { color: #B8A898; }
        .cc-input:focus, .cc-textarea:focus {
          border-color: #C9A96E;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
        }
        .cc-textarea { min-height: 140px; line-height: 1.6; }

        /* Drop zone */
        .cc-dropzone {
          border: 2px dashed #D4C8B4;
          border-radius: 14px;
          background: #FAFAF8;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 32px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cc-dropzone.drag-over {
          border-color: #C9A96E;
          background: #FAF6EE;
        }
        .cc-dropzone input[type=file] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }
        .cc-dropzone-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #F0EBE1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A96E;
        }
        .cc-dropzone-label {
          font-size: 14px;
          font-weight: 500;
          color: #5A4C38;
        }
        .cc-dropzone-sub { font-size: 12px; color: #B8A898; }

        /* Image preview */
        .cc-preview {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          background: #1A1612;
        }
        .cc-preview img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
          opacity: 0.92;
        }
        .cc-preview-remove {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(26,22,18,0.7);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FAFAF8;
          transition: background 0.18s ease;
        }
        .cc-preview-remove:hover { background: rgba(26,22,18,0.9); }

        /* Actions */
        .cc-actions {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }
        .cc-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          border-radius: 12px;
          border: none;
          background: #1A1612;
          color: #FAFAF8;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }
        .cc-submit-btn:hover:not(:disabled) {
          background: #2A2420;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(26,22,18,0.2);
        }
        .cc-submit-btn:disabled { opacity: 0.6; cursor: wait; }
        .cc-cancel-btn {
          display: inline-flex;
          align-items: center;
          padding: 13px 20px;
          border-radius: 12px;
          border: 1px solid #E8E4DC;
          background: transparent;
          color: #5A4C38;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .cc-cancel-btn:hover:not(:disabled) { background: #F0EBE1; }
        .cc-cancel-btn:disabled { opacity: 0.5; cursor: wait; }

        .cc-spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      <main className="cc-root">
        <div className="cc-header">
          <button className="cc-back-btn" onClick={() => router.push("/consumer/")} aria-label="Go back">
            <ArrowLeft size={16} />
          </button>
          <div className="cc-heading-wrap">
            <div className="cc-eyebrow">Share Your Thoughts</div>
            <h1 className="cc-heading">Create Review</h1>
          </div>
        </div>

        {error && <div className="cc-error">{error}</div>}

        <form className="cc-form" onSubmit={handleSubmit}>
          <div className="cc-field">
            <label className="cc-label">Title *</label>
            <input
              className="cc-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short, descriptive title…"
              required
            />
          </div>

          <div className="cc-field">
            <label className="cc-label">Description</label>
            <textarea
              className="cc-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your review in detail…"
            />
          </div>

          <div className="cc-field">
            <label className="cc-label">Product Name</label>
            <input
              className="cc-input"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="What product are you reviewing? (optional)"
            />
          </div>

          <div className="cc-field">
            <label className="cc-label">Sentiments</label>
            <SentimentPicker selected={selectedSentiments} onChange={(next) => setSelectedSentiments(next)} />
          </div>

          <div className="cc-field">
            <label className="cc-label">Product Image</label>
            {imagePreview ? (
              <div className="cc-preview">
                <img src={imagePreview} alt="Preview" />
                <button type="button" className="cc-preview-remove" onClick={() => setImageFile(null)} aria-label="Remove image">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                className={`cc-dropzone${dragOver ? " drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <div className="cc-dropzone-icon"><Upload size={20} /></div>
                <div className="cc-dropzone-label">Drop an image here or click to browse</div>
                <div className="cc-dropzone-sub">PNG, JPG, WEBP up to 10 MB</div>
              </div>
            )}
          </div>

          <div className="cc-actions">
            <button type="submit" className="cc-submit-btn" disabled={submitting}>
              {submitting ? <Loader2 size={15} className="cc-spin" /> : null}
              {submitting ? "Creating…" : "Publish Review"}
            </button>
            <button type="button" className="cc-cancel-btn" onClick={() => router.push("/consumer/")} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </>
  );
}