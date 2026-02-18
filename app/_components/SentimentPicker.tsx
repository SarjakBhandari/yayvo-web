// app/_components/SentimentPicker.tsx
"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";

type Props = {
  selected: string[];
  onChange: (next: string[]) => void;
};

const SENTIMENTS: { key: string; label: string; img: string; emoji: string }[] = [
  { key: "calm",         label: "Calm",         img: "/images/sentiments/calm.jpg",         emoji: "🌊" },
  { key: "cozy",         label: "Cozy",         img: "/images/sentiments/cozy.jpg",         emoji: "🕯️" },
  { key: "happy",        label: "Happy",        img: "/images/sentiments/happy.jpg",        emoji: "😊" },
  { key: "excited",      label: "Excited",      img: "/images/sentiments/excited.jpg",      emoji: "🚀" },
  { key: "sad",          label: "Sad",          img: "/images/sentiments/sad.jpg",          emoji: "🌧️" },
  { key: "minimal",      label: "Minimal",      img: "/images/sentiments/minimal.jpg",      emoji: "◻️" },
  { key: "disappointed", label: "Disappointed", img: "/images/sentiments/disappointed.jpg", emoji: "😞" },
  { key: "nostalgic",    label: "Nostalgic",    img: "/images/sentiments/nostalgic.jpg",    emoji: "📷" },
  { key: "beauty",       label: "Beauty",       img: "/images/sentiments/beauty.jpg",       emoji: "✨" },
  { key: "satisfied",    label: "Satisfied",    img: "/images/sentiments/satisfied.jpg",    emoji: "🙌" },
];

export default function SentimentPicker({ selected, onChange }: Props) {
  const [loadedImgs, setLoadedImgs] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    if (selected.includes(key)) onChange(selected.filter((s) => s !== key));
    else onChange([...selected, key]);
  }

  function onImgLoad(key: string) {
    setLoadedImgs((prev) => new Set(prev).add(key));
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .sp-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 4px;
        }

        .sp-tile {
          position: relative;
          width: 104px;
          border-radius: 16px;
          border: 1.5px solid #E8E4DC;
          background: #FAFAF8;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 0 12px;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.18s ease;
          box-shadow: 0 2px 8px rgba(26,22,18,0.04);
          font-family: 'DM Sans', sans-serif;
        }
        .sp-tile:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(26,22,18,0.1);
          border-color: #D4C8B4;
        }
        .sp-tile.active {
          border-color: #1A1612;
          box-shadow: 0 8px 24px rgba(26,22,18,0.14);
          transform: translateY(-2px);
        }

        /* Image */
        .sp-img-wrap {
          width: 100%;
          height: 78px;
          overflow: hidden;
          background: linear-gradient(135deg, #2A2420 0%, #1A1612 100%);
          position: relative;
          flex-shrink: 0;
        }
        .sp-img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0;
          transition: opacity 0.35s ease, transform 0.5s ease;
        }
        .sp-img.loaded { opacity: 1; }
        .sp-tile:hover .sp-img { transform: scale(1.06); }
        .sp-img-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 55%;
          background: linear-gradient(to top, rgba(26,22,18,0.55) 0%, transparent 100%);
          pointer-events: none;
        }

        /* Emoji fallback (shown while image loads) */
        .sp-emoji-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          background: linear-gradient(135deg, #2A2420 0%, #1A1612 100%);
          transition: opacity 0.3s ease;
        }
        .sp-emoji-fallback.hidden { opacity: 0; pointer-events: none; }

        /* Label */
        .sp-label {
          font-size: 11px;
          font-weight: 600;
          color: #5A4C38;
          text-transform: capitalize;
          margin-top: 10px;
          letter-spacing: 0.02em;
          text-align: center;
          padding: 0 6px;
          line-height: 1.2;
          transition: color 0.18s ease;
        }
        .sp-tile.active .sp-label { color: #1A1612; font-weight: 700; }

        /* Check badge */
        .sp-check {
          position: absolute;
          top: 8px; right: 8px;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: #1A1612;
          border: 2px solid #FAFAF8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A96E;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          animation: spPop 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes spPop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        /* Active glow strip at bottom */
        .sp-active-strip {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(to right, #C9A96E, #8B6B3D);
          border-radius: 0 0 16px 16px;
        }
      `}</style>

      <div className="sp-grid" role="group" aria-label="Sentiment picker">
        {SENTIMENTS.map((s) => {
          const active = selected.includes(s.key);
          const imgLoaded = loadedImgs.has(s.key);
          return (
            <button
              key={s.key}
              type="button"
              className={`sp-tile${active ? " active" : ""}`}
              onClick={() => toggle(s.key)}
              aria-pressed={active}
              aria-label={s.label}
            >
              <div className="sp-img-wrap">
                {/* Emoji fallback while image loads */}
                <div className={`sp-emoji-fallback${imgLoaded ? " hidden" : ""}`}>
                  {s.emoji}
                </div>
                <img
                  src={s.img}
                  alt={s.label}
                  className={`sp-img${imgLoaded ? " loaded" : ""}`}
                  onLoad={() => onImgLoad(s.key)}
                  draggable={false}
                />
                <div className="sp-img-overlay" />
              </div>

              <div className="sp-label">{s.label}</div>

              {active && (
                <>
                  <div className="sp-check">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <div className="sp-active-strip" />
                </>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}