// app/_components/SentimentPicker.tsx
"use client";
import React from "react";

type Props = {
  selected: string[];
  onChange: (next: string[]) => void;
};

/**
 * Images must be placed in: /public/images/sentiments/
 * Filenames used: calm.jpg, cozy.jpg, happy.jpg, excited.jpg, sad.jpg, minimal.jpg, disappointed.jpg,
 * nostalgic.jpg, beauty.jpg, satisfied.jpg
 */
const SENTIMENTS: { key: string; label: string; img: string }[] = [
  { key: "calm", label: "Calm", img: "/images/sentiments/calm.jpg" },
  { key: "cozy", label: "Cozy", img: "/images/sentiments/cozy.jpg" },
  { key: "happy", label: "Happy", img: "/images/sentiments/happy.jpg" },
  { key: "excited", label: "Excited", img: "/images/sentiments/excited.jpg" },
  { key: "sad", label: "Sad", img: "/images/sentiments/sad.jpg" },
  { key: "minimal", label: "Minimal", img: "/images/sentiments/minimal.jpg" },
  { key: "disappointed", label: "Disappointed", img: "/images/sentiments/disappointed.jpg" },
  { key: "nostalgic", label: "Nostalgic", img: "/images/sentiments/nostalgic.jpg" },
  { key: "beauty", label: "Beauty", img: "/images/sentiments/beauty.jpg" },
  { key: "satisfied", label: "Satisfied", img: "/images/sentiments/satisfied.jpg" },
];

export default function SentimentPicker({ selected, onChange }: Props) {
  function toggle(key: string) {
    if (selected.includes(key)) onChange(selected.filter((s) => s !== key));
    else onChange([...selected, key]);
  }

  return (
    <div className="grid">
      {SENTIMENTS.map((s) => {
        const active = selected.includes(s.key);
        return (
          <button
            key={s.key}
            type="button"
            className={`tile ${active ? "active" : ""}`}
            onClick={() => toggle(s.key)}
            aria-pressed={active}
          >
            <div className="imgWrap">
              <img src={s.img} alt={s.label} />
            </div>
            <div className="label">{s.label}</div>
            {active && <div className="check">✓</div>}
          </button>
        );
      })}

      <style jsx>{`
        .grid { display:flex; gap:12px; flex-wrap:wrap; margin-top:8px; }
        .tile {
          width:110px;
          height:140px;
          border-radius:10px;
          border:1px solid #e6e6e6;
          background:#fff;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:flex-start;
          padding:8px;
          position:relative;
          cursor:pointer;
        }
        .tile.active { border-color:#111827; box-shadow:0 6px 18px rgba(17,24,39,0.06); }
        .imgWrap { width:100%; height:80px; overflow:hidden; border-radius:8px; background:#f3f4f6; display:flex; align-items:center; justify-content:center; }
        .imgWrap img { width:100%; height:100%; object-fit:cover; }
        .label { margin-top:8px; font-size:13px; color:#111827; font-weight:600; text-transform:capitalize; }
        .check {
          position:absolute;
          top:8px;
          right:8px;
          background:#111827;
          color:#fff;
          width:22px;
          height:22px;
          border-radius:999px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:12px;
        }
      `}</style>
    </div>
  );
}
