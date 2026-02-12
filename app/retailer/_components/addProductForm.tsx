// src/app/retailer/create/_components/AddProductForm.tsx
"use client";
import React, { useEffect, useMemo } from "react";
import { useCreateProduct } from "../_hooks/useCreateProducts";

const SENTIMENTS = ["calm", "cozy", "joy", "minimalist", "nostalgic", "excited"];

export default function AddProductForm({
  onCreated,
  initialRetailerAuthId,
  initialRetailerName,
}: {
  onCreated?: () => void;
  initialRetailerAuthId?: string | null;
  initialRetailerName?: string | null;
}) {
  const {
    title,
    description,
    retailerAuthId,
    retailerName,
    targetSentiment,
    file,
    errors,
    isSubmitting,
    handleTitle,
    handleDescription,
    handleFile,
    toggleSentiment,
    handleSubmit,
    setRetailerAuthId,
    setRetailerName,
  } = useCreateProduct((created) => {
    if (onCreated) onCreated();
  });

  useEffect(() => {
    if (initialRetailerAuthId) setRetailerAuthId(initialRetailerAuthId);
    if (initialRetailerName) setRetailerName(initialRetailerName);
  }, [initialRetailerAuthId, initialRetailerName, setRetailerAuthId, setRetailerName]);

  const selectedSet = useMemo(() => new Set(targetSentiment), [targetSentiment]);

  return (
    <>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          await handleSubmit();
        }}
      >
        <div className="field">
          <label>Title</label>
          <input value={title} onChange={handleTitle} />
          {errors.title && <small className="err">{errors.title}</small>}
        </div>

        <div className="field">
          <label>Description</label>
          <textarea value={description} onChange={handleDescription} />
        </div>

        <div className="field">
          <label>Product Image</label>
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>

        <div className="field">
          <label>Select Target Sentiments</label>
          <div className="grid">
            {SENTIMENTS.map((s) => {
              const isSelected = selectedSet.has(s);
              return (
                <button
                  key={s}
                  type="button"
                  className={`sentiment ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleSentiment(s)}
                >
                  <div className="emoji">{s[0].toUpperCase()}</div>
                  <div className="label">{s}</div>
                </button>
              );
            })}
          </div>
        </div>

        {errors.general && <div className="errBox">{errors.general}</div>}

        <button type="submit" disabled={isSubmitting} className="submit">
          {isSubmitting ? "Creating…" : "Create Product"}
        </button>
      </form>

      <style jsx>{`
        .form { display:flex; flex-direction:column; gap:12px; max-width:720px; background:#fff; padding:16px; border-radius:8px; box-shadow:0 6px 18px rgba(16,24,40,0.04); }
        .field { display:flex; flex-direction:column; gap:6px; }
        label { font-weight:700; color:#111827; }
        input, textarea { padding:8px 10px; border-radius:6px; border:1px solid #e6e6e6; font-size:14px; }
        textarea { min-height:100px; resize:vertical; }
        .err { color:#c00; font-size:12px; }
        .errBox { color:#c00; padding:8px; background:#fff0f0; border-radius:6px; }
        .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:12px; margin-top:8px; }
        .sentiment { display:flex; flex-direction:column; align-items:center; gap:8px; padding:12px; border-radius:12px; border:1px solid #e6e6e6; background:#fff; cursor:pointer; }
        .sentiment.selected { border-color:#2563eb; background:rgba(37,99,235,0.06); }
        .emoji { width:40px; height:40px; border-radius:10px; background:#f3f4f6; display:flex; align-items:center; justify-content:center; font-weight:700; }
        .label { text-transform:capitalize; color:#111827; font-weight:600; }
        .submit { padding:10px 14px; border-radius:8px; background:#111827; color:#fff; border:none; cursor:pointer; font-weight:700; }
        .submit:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>
    </>
  );
}
