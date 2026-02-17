// app/consumer/create/page.tsx
import React from "react";
import Sidebar from "../_components/sidebar";
import CreateClient from "./CreateClient";
import { getUserData } from "@/lib/cookie";

export default async function CreatePage() {
  const userData = await getUserData();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .create-root {
          height: 100vh;
          display: flex;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* Ambient blobs */
        .create-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .create-blob-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(201,169,110,0.11) 0%, transparent 70%);
          top: -80px; left: 160px;
        }
        .create-blob-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(139,107,61,0.07) 0%, transparent 70%);
          bottom: 40px; right: 80px;
        }

        /* Sidebar column */
        .create-sidebar-col {
          position: relative;
          z-index: 1;
          flex: 0 0 260px;
          padding: 28px 0 28px 28px;
          display: flex;
          flex-direction: column;
        }
        .create-sidebar-panel {
          flex: 1;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.05);
          display: flex;
          flex-direction: column;
        }

        /* Main content */
        .create-main-col {
          position: relative;
          z-index: 1;
          flex: 1;
          padding: 28px 28px 0 16px;
          overflow-y: auto;
          min-width: 0;
          scrollbar-width: thin;
          scrollbar-color: #D4C8B4 transparent;
        }
        .create-main-col::-webkit-scrollbar { width: 4px; }
        .create-main-col::-webkit-scrollbar-thumb { background: #D4C8B4; border-radius: 4px; }

        @media (max-width: 768px) {
          .create-sidebar-col { display: none; }
          .create-main-col { padding: 20px; }
        }
      `}</style>

      <div className="create-root">
        <div className="create-blob create-blob-1" />
        <div className="create-blob create-blob-2" />

        <div className="create-sidebar-col">
          <div className="create-sidebar-panel">
            <Sidebar />
          </div>
        </div>

        <div className="create-main-col">
          <CreateClient userData={userData} />
        </div>
      </div>
    </>
  );
}