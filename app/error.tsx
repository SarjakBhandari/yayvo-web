// app/admin/error.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TriangleAlert, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
<>      <style>{`
        .er-wrap {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 80px 24px; gap: 28px; text-align: center;
        }
        .er-icon-ring {
          width: 80px; height: 80px; border-radius: 24px;
          background: linear-gradient(135deg, #FDF0EE 0%, #F9E4E0 100%);
          display: flex; align-items: center; justify-content: center;
          color: #C9735A;
          box-shadow: 0 4px 20px rgba(201,115,90,0.15);
        }
        .er-code {
          font-family: 'Playfair Display', serif;
          font-size: 80px; font-weight: 700;
          color: #F0E8E6; letter-spacing: -0.04em;
          line-height: 1; margin: 0;
        }
        .er-content { display: flex; flex-direction: column; gap: 10px; align-items: center; }
        .er-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em; margin: 0;
        }
        .er-subtitle {
          font-size: 14px; color: #9C8E7A;
          max-width: 360px; line-height: 1.6; margin: 0;
        }
        .er-message-box {
          background: #FDF0EE; border: 1px solid #F2D5CF;
          border-radius: 12px; padding: 12px 18px;
          font-size: 12px; color: #A05540;
          font-family: 'DM Mono', monospace;
          max-width: 420px; word-break: break-word;
        }
        .er-divider {
          height: 1px; background: linear-gradient(90deg, transparent, #E8E4DC, transparent);
          width: 120px;
        }
        .er-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: center; }
        .er-retry-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 12px;
          background: #1A1612; border: none;
          font-size: 14px; font-weight: 600; color: #FAFAF8;
          cursor: pointer; transition: all 0.18s ease; font-family: inherit;
        }
        .er-retry-btn:hover {
          background: #2A2420; transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(26,22,18,0.2);
        }
        .er-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 20px; border-radius: 12px;
          background: transparent; border: 1px solid #E8E4DC;
          font-size: 14px; font-weight: 500; color: #7A6A52;
          cursor: pointer; transition: all 0.18s ease; font-family: inherit;
        }
        .er-back-btn:hover { background: #F0EBE1; border-color: #D4C9B8; color: #1A1612; }
      `}</style>

      <div className="er-wrap">
        <div className="er-icon-ring">
          <TriangleAlert size={36} />
        </div>

        <p className="er-code">500</p>

        <div className="er-divider" />

        <div className="er-content">
          <h1 className="er-title">Something Went Wrong</h1>
          <p className="er-subtitle">
            An unexpected error occurred. You can try again or head back to the dashboard.
          </p>
          {error?.message && (
            <div className="er-message-box">{error.message}</div>
          )}
        </div>

        <div className="er-actions">
          <button className="er-retry-btn" onClick={() => reset()}>
            <RefreshCw size={15} />
            Try Again
          </button>
          <button className="er-back-btn" onClick={() => router.push("/")}>
            <ArrowLeft size={15} />
            Back to Homepage
          </button>
        </div>
      </div>
    </>
  );
}