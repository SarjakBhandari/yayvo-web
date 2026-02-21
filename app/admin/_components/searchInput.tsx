// admin/components/SearchInput.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

type Props = {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

export default function SearchInput({
  value = "",
  onChange,
  placeholder = "Search…",
  debounceMs = 300,
}: Props) {
  const [local, setLocal] = useState(value);

  useEffect(() => { setLocal(value); }, [value]);

  useEffect(() => {
    const t = setTimeout(() => { if (local !== value) onChange(local); }, debounceMs);
    return () => clearTimeout(t);
  }, [local, debounceMs, onChange, value]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');
        .si-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          width: 100%;
          max-width: 360px;
          font-family: 'DM Sans', sans-serif;
        }
        .si-icon {
          position: absolute; left: 12px;
          color: #B8A898; pointer-events: none;
          display: flex; align-items: center;
          transition: color 0.18s ease;
        }
        .si-wrap:focus-within .si-icon { color: #C9A96E; }
        .si-input {
          width: 100%;
          padding: 10px 36px 10px 38px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          border-radius: 12px;
          border: 1px solid #E8E4DC;
          background: #FAFAF8;
          color: #1A1612;
          outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .si-input::placeholder { color: #B8A898; }
        .si-input:focus {
          border-color: #C9A96E;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
        }
        .si-clear {
          position: absolute; right: 10px;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: #E8E4DC;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #7A6A52;
          transition: background 0.18s ease, color 0.18s ease;
          flex-shrink: 0;
        }
        .si-clear:hover { background: #D4C8B4; color: #1A1612; }
      `}</style>

      <div className="si-wrap">
        <span className="si-icon"><Search size={15} /></span>
        <input
          type="search"
          className="si-input"
          placeholder={placeholder}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          aria-label={placeholder}
          autoComplete="off"
        />
        {local && (
          <button
            className="si-clear"
            onClick={() => { setLocal(""); onChange(""); }}
            aria-label="Clear search"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </>
  );
}