"use client";

import React from "react";
import { Bookmark, Users, Heart, X } from "lucide-react";

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .ci-item {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 14px;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .ci-item:hover {
          box-shadow: 0 6px 20px rgba(26,22,18,0.07);
          transform: translateY(-1px);
        }
        .ci-img {
          width: 64px;
          height: 64px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid #E8E4DC;
        }
        .ci-img-placeholder {
          width: 64px;
          height: 64px;
          border-radius: 10px;
          background: linear-gradient(135deg, #E8E4DC 0%, #D4C8B4 100%);
          flex-shrink: 0;
        }
        .ci-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }
        .ci-title {
          font-weight: 600;
          font-size: 14px;
          color: #1A1612;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ci-subtitle {
          font-size: 12px;
          color: #9C8E7A;
        }
        .ci-btn-row {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        .ci-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          border-radius: 30px;
          border: 1px solid #E8E4DC;
          background: transparent;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #5A4C38;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .ci-btn:hover { background: #F0EBE1; }
        .ci-btn.danger {
          border-color: #FFCDD2;
          color: #C0392B;
        }
        .ci-btn.danger:hover { background: #FFF1F1; }
      `}</style>

      <li className="ci-item">
        {image
          ? <img src={image} alt={title ?? ""} className="ci-img" />
          : <div className="ci-img-placeholder" />
        }

        <div className="ci-info">
          <div className="ci-title">{title ?? "Untitled"}</div>
          {subtitle && <div className="ci-subtitle">{subtitle}</div>}
        </div>

        <div className="ci-btn-row">
          {isReview && onShowLikers && (
            <button className="ci-btn" onClick={() => onShowLikers(id)}>
              <Users size={12} />
              <span>Likers</span>
            </button>
          )}
          {isReview && onCheckLiked && (
            <button className="ci-btn" onClick={() => onCheckLiked(id)}>
              <Heart size={12} />
              <span>Liked?</span>
            </button>
          )}
          {onUnsave && (
            <button className="ci-btn danger" onClick={() => onUnsave(id)}>
              <X size={12} />
              <span>Unsave</span>
            </button>
          )}
        </div>
      </li>
    </>
  );
}