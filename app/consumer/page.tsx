// app/consumer/home/page.tsx
import React from "react";
import Sidebar from "./_components/sidebar";
import HomeClient from "./_components/HomeClient";
import { getUserData } from "@/lib/cookie";

export default async function HomePage() {
  const userData = await getUserData();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hp-root {
          height: 100vh;
          display: flex;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* Subtle grain texture overlay */
        .hp-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.6;
        }

        /* Decorative ambient blobs */
        .hp-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .hp-blob-1 {
          width: 420px;
          height: 420px;
          background: radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%);
          top: -100px;
          left: 180px;
        }
        .hp-blob-2 {
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(139,107,61,0.08) 0%, transparent 70%);
          bottom: 60px;
          right: 80px;
        }

        /* Sidebar column */
        .hp-sidebar-col {
          position: relative;
          z-index: 1;
          flex: 0 0 260px;
          display: flex;
          flex-direction: column;
          padding: 28px 0 28px 28px;
        }

        /* Sidebar panel */
        .hp-sidebar-panel {
          flex: 1;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.05);
          display: flex;
          flex-direction: column;
        }

        /* Main content column */
        .hp-main-col {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 28px 28px 28px 16px;
          min-width: 0;
          overflow: hidden;
        }

        .hp-main-inner {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .hp-sidebar-col { display: none; }
          .hp-main-col { padding: 20px; }
        }
      `}</style>

      <div className="hp-root">
        {/* Ambient blobs */}
        <div className="hp-blob hp-blob-1" />
        <div className="hp-blob hp-blob-2" />

        {/* Sidebar */}
        <div className="hp-sidebar-col">
          <div className="hp-sidebar-panel">
            <Sidebar />
          </div>
        </div>

        {/* Main feed */}
        <div className="hp-main-col">
          <div className="hp-main-inner">
            <HomeClient userData={userData} />
          </div>
        </div>
      </div>
    </>
  );
}