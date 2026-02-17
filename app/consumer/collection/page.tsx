// app/consumer/collection/page.tsx
import React from "react";
import Link from "next/link";
import Sidebar from "../_components/sidebar";
import { Bookmark, Heart, ArrowRight } from "lucide-react";

export default function CollectionHubPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hub-root {
          height: 100vh;
          display: flex;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }
        .hub-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .hub-blob-1 {
          width: 460px; height: 460px;
          background: radial-gradient(circle, rgba(201,169,110,0.13) 0%, transparent 70%);
          top: -120px; left: 160px;
        }
        .hub-blob-2 {
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(214,90,90,0.08) 0%, transparent 70%);
          bottom: 40px; right: 60px;
        }

        .hub-sidebar-col {
          position: relative;
          z-index: 1;
          flex: 0 0 260px;
          padding: 28px 0 28px 28px;
          display: flex;
          flex-direction: column;
        }
        .hub-sidebar-panel {
          flex: 1;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.05);
          display: flex;
          flex-direction: column;
        }

        .hub-main {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 28px 28px 40px 16px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          overflow-y: auto;
        }

        .hub-header { display: flex; flex-direction: column; gap: 2px; }
        .hub-eyebrow {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #9C8E7A;
          font-weight: 500;
        }
        .hub-heading {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 700;
          color: #1A1612;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .hub-sub {
          font-size: 14px;
          color: #9C8E7A;
          margin-top: 6px;
        }

        .hub-cards {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 540px;
        }
        .hub-card {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 22px;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          text-decoration: none;
          transition: all 0.22s ease;
          box-shadow: 0 2px 10px rgba(26,22,18,0.04);
        }
        .hub-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 36px rgba(26,22,18,0.1);
          border-color: #D4C8B4;
        }
        .hub-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hub-icon-saved {
          background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%);
        }
        .hub-icon-liked {
          background: linear-gradient(135deg, #E57373 0%, #C62828 100%);
        }
        .hub-info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
        .hub-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #1A1612;
          letter-spacing: -0.02em;
        }
        .hub-card-sub {
          font-size: 13px;
          color: #9C8E7A;
        }
        .hub-arrow {
          color: #C9A96E;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .hub-card:hover .hub-arrow {
          transform: translateX(4px);
        }
      `}</style>

      <div className="hub-root">
        <div className="hub-blob hub-blob-1" />
        <div className="hub-blob hub-blob-2" />

        <div className="hub-sidebar-col">
          <div className="hub-sidebar-panel"><Sidebar /></div>
        </div>

        <main className="hub-main">
          <div className="hub-header">
            <div className="hub-eyebrow">Your Space</div>
            <h1 className="hub-heading">Collections</h1>
            <p className="hub-sub">Everything you've saved and loved, in one place.</p>
          </div>

          <div className="hub-cards">
            <Link href="/consumer/collection/saved" className="hub-card">
              <div className="hub-icon hub-icon-saved">
                <Bookmark size={24} color="#fff" />
              </div>
              <div className="hub-info">
                <div className="hub-card-title">Saved</div>
                <div className="hub-card-sub">Products & reviews you bookmarked</div>
              </div>
              <ArrowRight size={20} className="hub-arrow" />
            </Link>

            <Link href="/consumer/collection/liked" className="hub-card">
              <div className="hub-icon hub-icon-liked">
                <Heart size={24} color="#fff" />
              </div>
              <div className="hub-info">
                <div className="hub-card-title">Liked</div>
                <div className="hub-card-sub">Everything you've shown love to</div>
              </div>
              <ArrowRight size={20} className="hub-arrow" />
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}