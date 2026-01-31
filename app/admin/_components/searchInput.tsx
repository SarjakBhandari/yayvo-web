// admin/components/SearchInput.tsx
"use client";

import React, { useEffect, useState } from "react";

type Props = { value?: string; onChange: (v: string) => void; placeholder?: string; debounceMs?: number; };

export default function SearchInput({ value = "", onChange, placeholder = "Search...", debounceMs = 300 }: Props) {
  const [local, setLocal] = useState(value);
  useEffect(() => { setLocal(value); }, [value]);
  useEffect(() => {
    const t = setTimeout(() => { if (local !== value) onChange(local); }, debounceMs);
    return () => clearTimeout(t);
  }, [local, debounceMs, onChange, value]);

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
      <input type="search" placeholder={placeholder} value={local} onChange={(e) => setLocal(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd", width: "100%", maxWidth: 420 }} />
      {local && <button onClick={() => { setLocal(""); onChange(""); }} style={{ padding: 8 }}>Clear</button>}
    </div>
  );
}
