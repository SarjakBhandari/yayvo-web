// src/app/retailer/_components/addProductForm.tsx
"use client";
import React, { useEffect, useMemo } from "react";
import { useCreateProduct } from "../_hooks/useCreateProducts";
import { Loader2, Upload } from "lucide-react";

const SENTIMENTS = ["calm", "cozy", "joy", "minimalist", "nostalgic", "excited"];
const SENTIMENT_ICONS: Record<string, string> = {
  calm: "🌊", cozy: "🕯️", joy: "✨", minimalist: "◻️", nostalgic: "📷", excited: "🚀",
};

export default function AddProductForm({
  onCreated,
  initialRetailerAuthId,
  initialRetailerName,
  initialRetailerIcon,
}: {
  onCreated?: () => void;
  initialRetailerAuthId?: string | null;
  initialRetailerName?: string | null;
  initialRetailerIcon?: string | null;
}) {
  const {
    title, description, targetSentiment, file, errors, isSubmitting,
    handleTitle, handleDescription, handleFile, toggleSentiment, handleSubmit,
    setRetailerAuthId, setRetailerName, setRetailerIcon,
    retailerIcon,
  } = useCreateProduct(() => { onCreated?.(); });

  useEffect(() => {
    if (initialRetailerAuthId) setRetailerAuthId(initialRetailerAuthId);
    if (initialRetailerName)   setRetailerName(initialRetailerName);
    if (initialRetailerIcon)   setRetailerIcon(initialRetailerIcon);
  }, [
    initialRetailerAuthId,
    initialRetailerName,
    initialRetailerIcon,
    setRetailerAuthId,
    setRetailerName,
    setRetailerIcon,
  ]);

  const selectedSet = useMemo(() => new Set(targetSentiment), [targetSentiment]);

  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .apf-form {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 680px;
        }
        .apf-field { display: flex; flex-direction: column; gap: 6px; }
        .apf-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9C8E7A;
          font-weight: 500;
        }
        .apf-input, .apf-textarea {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #E8E4DC;
          background: #FAFAF8;
          color: #1A1612;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .apf-input::placeholder, .apf-textarea::placeholder { color: #B8A898; }
        .apf-input:focus, .apf-textarea:focus {
          border-color: #C9A96E;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
        }
        .apf-textarea { min-height: 110px; resize: none; line-height: 1.6; }
        .apf-err { font-size: 12px; color: #C0392B; }
        .apf-err-box {
          background: #FFF8F5;
          border: 1px solid #FFDDD0;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 13px;
          color: #C0392B;
        }

        /* Drop zone */
        .apf-dropzone {
          border: 2px dashed #D4C8B4;
          border-radius: 14px;
          background: #FAFAF8;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 30px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          position: relative;
        }
        .apf-dropzone:hover { border-color: #C9A96E; background: #FAF6EE; }
        .apf-dropzone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
        .apf-dropzone-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: #F0EBE1; display: flex; align-items: center; justify-content: center;
          color: #C9A96E;
        }
        .apf-dropzone-label { font-size: 14px; font-weight: 500; color: #5A4C38; }
        .apf-dropzone-sub { font-size: 12px; color: #B8A898; }

        /* Preview */
        .apf-preview {
          width: 100%;
          max-height: 220px;
          border-radius: 14px;
          overflow: hidden;
          background: #1A1612;
        }
        .apf-preview img { width: 100%; height: 220px; object-fit: cover; display: block; }

        /* Sentiments */
        .apf-sentiment-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .apf-sentiment-btn {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 14px 10px;
          border-radius: 14px;
          border: 1px solid #E8E4DC;
          background: #FAFAF8;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #5A4C38;
          transition: all 0.18s ease;
        }
        .apf-sentiment-btn:hover { background: #F0EBE1; border-color: #D4C8B4; }
        .apf-sentiment-btn.selected { background: #1A1612; border-color: #1A1612; color: #FAFAF8; }
        .apf-sentiment-emoji { font-size: 22px; line-height: 1; }
        .apf-sentiment-label { text-transform: capitalize; }

        /* Submit */
        .apf-actions { display: flex; gap: 10px; }
        .apf-submit-btn {
          display: inline-flex; align-items: center; gap: 8px;
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
        .apf-submit-btn:hover:not(:disabled) {
          background: #2A2420;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(26,22,18,0.2);
        }
        .apf-submit-btn:disabled { opacity: 0.6; cursor: wait; }
        .apf-spin { animation: apfSpin 0.8s linear infinite; }
        @keyframes apfSpin { to { transform: rotate(360deg) } }
      `}</style>

      <form
        className="apf-form"
        onSubmit={async (e) => { e.preventDefault(); await handleSubmit(); }}
      >
        <div className="apf-field">
          <label className="apf-label">Title *</label>
          <input className="apf-input" value={title} onChange={handleTitle} placeholder="Give your product a title…" />
          {errors.title && <span className="apf-err">{errors.title}</span>}
        </div>

        <div className="apf-field">
          <label className="apf-label">Description</label>
          <textarea className="apf-textarea" value={description} onChange={handleDescription} placeholder="Describe what makes this product special…" />
        </div>

        <div className="apf-field">
          <label className="apf-label">Product Image</label>
          {previewUrl ? (
            <div className="apf-preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          ) : (
            <div className="apf-dropzone">
              <input type="file" accept="image/*" onChange={handleFile} />
              <div className="apf-dropzone-icon"><Upload size={20} /></div>
              <div className="apf-dropzone-label">Drop an image or click to browse</div>
              <div className="apf-dropzone-sub">PNG, JPG, WEBP up to 10 MB</div>
            </div>
          )}
        </div>

        <div className="apf-field">
          <label className="apf-label">Target Sentiments</label>
          <div className="apf-sentiment-grid">
            {SENTIMENTS.map((s) => {
              const selected = selectedSet.has(s);
              return (
                <button
                  key={s}
                  type="button"
                  className={`apf-sentiment-btn${selected ? " selected" : ""}`}
                  onClick={() => toggleSentiment(s)}
                >
                  <span className="apf-sentiment-emoji">{SENTIMENT_ICONS[s]}</span>
                  <span className="apf-sentiment-label">{s}</span>
                </button>
              );
            })}
          </div>
        </div>

        {errors.general && <div className="apf-err-box">{errors.general}</div>}

        <div className="apf-actions">
          <button type="submit" disabled={isSubmitting} className="apf-submit-btn">
            {isSubmitting ? <Loader2 size={15} className="apf-spin" /> : null}
            {isSubmitting ? "Creating…" : "Create Product"}
          </button>
        </div>
      </form>
    </>
  );
}