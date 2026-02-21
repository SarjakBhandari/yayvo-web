// app/admin/_components/AdminPageHeader.tsx
// Consistent page header with eyebrow, title and optional back button.

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  eyebrow?: string;
  title: string;
  backHref?: string;
  backLabel?: string;
};

export default function AdminPageHeader({ eyebrow, title, backHref, backLabel = "Back" }: Props) {
  return (
    <div style={{ marginBottom: 28 }}>
      {backHref && (
        <Link
          href={backHref}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "#9C8E7A", textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            marginBottom: 14, transition: "color 0.18s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#C9A96E")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#9C8E7A")}
        >
          <ArrowLeft size={13} />
          {backLabel}
        </Link>
      )}
      {eyebrow && (
        <div style={{
          fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em",
          color: "#9C8E7A", fontWeight: 500, marginBottom: 4,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {eyebrow}
        </div>
      )}
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 28, fontWeight: 700, color: "#1A1612",
        letterSpacing: "-0.025em", lineHeight: 1.15, margin: 0,
      }}>
        {title}
      </h1>
    </div>
  );
}