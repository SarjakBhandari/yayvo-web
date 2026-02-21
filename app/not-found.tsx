// app/admin/not-found.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, SearchX } from "lucide-react";
import AdminShell from "./admin/_components/AdminShell";

export default function NotFound() {
  const router = useRouter();
  return (
    <>
      <style>{`
        .nf-wrap {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 80px 24px; gap: 28px; text-align: center;
        }
        .nf-icon-ring {
          width: 80px; height: 80px; border-radius: 24px;
          background: linear-gradient(135deg, #F0EBE1 0%, #E8E4DC 100%);
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E;
          box-shadow: 0 4px 20px rgba(201,169,110,0.18);
        }
        .nf-code {
          font-family: 'Playfair Display', serif;
          font-size: 80px; font-weight: 700;
          color: #E8E4DC; letter-spacing: -0.04em;
          line-height: 1; margin: 0;
        }
        .nf-content { display: flex; flex-direction: column; gap: 10px; align-items: center; }
        .nf-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em; margin: 0;
        }
        .nf-subtitle {
          font-size: 14px; color: #9C8E7A;
          max-width: 340px; line-height: 1.6; margin: 0;
        }
        .nf-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 12px;
          background: #1A1612; border: none;
          font-size: 14px; font-weight: 600; color: #FAFAF8;
          cursor: pointer; transition: all 0.18s ease; font-family: inherit;
        }
        .nf-back-btn:hover {
          background: #2A2420; transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(26,22,18,0.2);
        }
        .nf-divider {
          height: 1px; background: linear-gradient(90deg, transparent, #E8E4DC, transparent);
          width: 120px;
        }
      `}</style>

      <div className="nf-wrap">
        <div className="nf-icon-ring">
          <SearchX size={36} />
        </div>

        <p className="nf-code">404</p>

        <div className="nf-divider" />

        <div className="nf-content">
          <h1 className="nf-title">Page Not Found</h1>
          <p className="nf-subtitle">
            The page you're looking for doesn't exist or has been moved.
            Head back to the Home Page to continue.
          </p>
        </div>

        <button className="nf-back-btn" onClick={() => router.push("/")}>
          <ArrowLeft size={15} />
          Back to Homepage
        </button>
      </div>
      </>
  );
}