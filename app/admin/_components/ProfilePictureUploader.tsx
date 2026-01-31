"use client";

import React, { JSX, useRef, useState } from "react";

type Props = {
  src?: string | null;
  onFileSelected: (file: File) => Promise<void>;
  size?: number;
  alt?: string;
};

export default function ProfilePictureUploader({ src, onFileSelected, size = 160, alt = "profile" }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [hover, setHover] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { await onFileSelected(file); } finally { setUploading(false); }
  }

  return (
    <div style={{ display: "inline-block", position: "relative", width: size, height: size }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") inputRef.current?.click(); }}
        style={{
          width: size, height: size, borderRadius: 8, overflow: "hidden", cursor: "pointer",
          border: hover ? "2px solid #3182ce" : "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center",
          background: "#f7f7f7", position: "relative"
        }}
        title="Click to change profile picture"
      >
        {src ? <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ color: "#666" }}>{uploading ? "Uploading..." : "No image"}</div>}
        {hover && !uploading && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>Change</div>}
      </div>

      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}
