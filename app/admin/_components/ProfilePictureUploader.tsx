// admin/components/ProfilePictureUploader.tsx
"use client";

import React, { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

type Props = {
  src?: string | null;
  onFileSelected: (file: File) => Promise<void>;
  size?: number;
  alt?: string;
};

export default function ProfilePictureUploader({
  src, onFileSelected, size = 120, alt = "profile",
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { await onFileSelected(file); }
    finally { setUploading(false); e.target.value = ""; }
  }

  const radius = size > 100 ? 20 : 14;
  const initials = alt
    .split(" ").filter(Boolean).slice(0, 2)
    .map((n) => n[0].toUpperCase()).join("") || "?";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&display=swap');
        .ppu-wrap {
          position: relative; display: inline-block;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
        }
        .ppu-ring {
          overflow: hidden;
          background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%);
          border: 3px solid #FAFAF8;
          box-shadow: 0 4px 16px rgba(26,22,18,0.14);
          display: flex; align-items: center; justify-content: center;
          position: relative;
          transition: box-shadow 0.2s ease;
        }
        .ppu-wrap:hover .ppu-ring { box-shadow: 0 6px 20px rgba(26,22,18,0.2); }
        .ppu-img {
          width: 100%; height: 100%; object-fit: cover;
          display: block;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .ppu-img.loaded { opacity: 1; }
        .ppu-initials {
          font-size: 28px; font-weight: 600;
          color: #FAFAF8; letter-spacing: -0.01em;
          user-select: none;
        }
        .ppu-overlay {
          position: absolute; inset: 0;
          background: rgba(26,22,18,0.55);
          backdrop-filter: blur(1px);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 6px;
          opacity: 0; transition: opacity 0.2s ease;
          color: #FAFAF8;
        }
        .ppu-wrap:hover .ppu-overlay { opacity: 1; }
        .ppu-overlay-label { font-size: 11px; font-weight: 500; letter-spacing: 0.03em; }
        .ppu-camera-btn {
          position: absolute; bottom: -2px; right: -2px;
          width: 30px; height: 30px; border-radius: 8px;
          background: #1A1612; border: 2px solid #FAFAF8;
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E; cursor: pointer;
          transition: background 0.18s ease;
          box-shadow: 0 2px 8px rgba(26,22,18,0.25);
          overflow: hidden;
        }
        .ppu-camera-btn:hover { background: #2A2420; }
        .ppu-camera-btn input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .ppu-uploading-badge {
          position: absolute; bottom: -28px; left: 50%; transform: translateX(-50%);
          white-space: nowrap;
          display: flex; align-items: center; gap: 6px;
          background: #1A1612; color: #FAFAF8;
          border-radius: 30px; padding: 4px 12px;
          font-size: 11px; font-weight: 500;
          box-shadow: 0 4px 12px rgba(26,22,18,0.2);
        }
        .ppu-spin { animation: ppuSpin 0.8s linear infinite; }
        @keyframes ppuSpin { to { transform: rotate(360deg) } }
      `}</style>

      <div className="ppu-wrap" style={{ width: size, height: size + (uploading ? 36 : 0) }}>
        <div
          className="ppu-ring"
          style={{ width: size, height: size, borderRadius: radius }}
          onClick={() => !uploading && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Change profile picture"
          onKeyDown={(e) => { if (e.key === "Enter") inputRef.current?.click(); }}
          title="Click to change photo"
        >
          {src ? (
            <img
              src={src} alt={alt}
              className={`ppu-img${imgLoaded ? " loaded" : ""}`}
              onLoad={() => setImgLoaded(true)}
            />
          ) : (
            <span className="ppu-initials" style={{ fontSize: size > 100 ? 28 : 18 }}>{initials}</span>
          )}
          {!uploading && (
            <div className="ppu-overlay">
              <Camera size={size > 100 ? 20 : 15} />
              {size > 80 && <span className="ppu-overlay-label">Change photo</span>}
            </div>
          )}
          {uploading && (
            <div className="ppu-overlay" style={{ opacity: 1 }}>
              <Loader2 size={size > 100 ? 22 : 16} className="ppu-spin" />
              {size > 80 && <span className="ppu-overlay-label">Uploading…</span>}
            </div>
          )}
        </div>

        {/* Small camera badge */}
        <label className="ppu-camera-btn" title="Change photo">
          {uploading ? <Loader2 size={13} className="ppu-spin" /> : <Camera size={13} />}
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
        </label>

        {uploading && (
          <div className="ppu-uploading-badge">
            <Loader2 size={11} className="ppu-spin" /> Uploading…
          </div>
        )}
      </div>
    </>
  );
}