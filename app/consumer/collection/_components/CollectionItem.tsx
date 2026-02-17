"use client";

import React from "react";

type Props = {
  id: string;
  title?: string;
  subtitle?: string;
  image?: string;
  isReview?: boolean;
  onUnsave?: (id: string) => void;
  onShowLikers?: (id: string) => void;
  onCheckLiked?: (id: string) => void;
};

export default function CollectionItem({ id, title, subtitle, image, isReview, onUnsave, onShowLikers, onCheckLiked }: Props) {
  return (
    <li style={{ display: "flex", alignItems: "center", padding: 12, borderBottom: "1px solid #eee" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
        {image ? <img src={image} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6 }} /> : null}
        <div>
          <div style={{ fontWeight: 600 }}>{title}</div>
          {subtitle && <div style={{ color: "#666", fontSize: 13 }}>{subtitle}</div>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {isReview && (
          <>
            <button onClick={() => onShowLikers?.(id)}>Show likers</button>
            <button onClick={() => onCheckLiked?.(id)}>Am I liked?</button>
          </>
        )}
        {onUnsave && <button onClick={() => onUnsave(id)}>Unsave</button>}
      </div>
    </li>
  );
}
