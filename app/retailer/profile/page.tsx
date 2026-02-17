// src/app/retailer/profile/page.tsx
import React from "react";
import { redirect } from "next/navigation";
import RetailerProfilePanel from "../_components/profilePanel";
import { getUserData, getAuthToken } from "@/lib/cookie";
import { getRetailerByAuthId } from "@/lib/api/retailer";
import Sidebar from "../_components/sidebar";

export default async function RetailerProfilePage() {
  const userData = await getUserData();
  const authId = userData?.id ?? null;
  if (!authId) redirect("/login");

  const retailer = await getRetailerByAuthId(authId as string);
  if (!retailer) redirect("/login");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rprof-root {
          height: 100vh;
          display: flex;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }
        .rprof-blob {
          position: fixed; border-radius: 50%;
          filter: blur(80px); pointer-events: none; z-index: 0;
        }
        .rprof-blob-1 {
          width: 460px; height: 460px;
          background: radial-gradient(circle, rgba(201,169,110,0.11) 0%, transparent 70%);
          top: -120px; left: 200px;
        }
        .rprof-blob-2 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(139,107,61,0.07) 0%, transparent 70%);
          bottom: 40px; right: 60px;
        }
        .rprof-sidebar-col {
          position: relative; z-index: 1;
          flex: 0 0 260px;
          padding: 28px 0 28px 28px;
          display: flex; flex-direction: column;
        }
        .rprof-sidebar-panel {
          flex: 1;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.05);
          display: flex; flex-direction: column;
        }
        .rprof-main {
          position: relative; z-index: 1;
          flex: 1;
          padding: 28px 28px 40px 16px;
          overflow-y: auto;
          min-width: 0;
          scrollbar-width: thin; scrollbar-color: #D4C8B4 transparent;
        }
        .rprof-main::-webkit-scrollbar { width: 4px; }
        .rprof-main::-webkit-scrollbar-thumb { background: #D4C8B4; border-radius: 4px; }
        .rprof-inner { max-width: 860px; width: 100%; }

        @media (max-width: 768px) {
          .rprof-sidebar-col { display: none; }
          .rprof-main { padding: 20px; }
        }
      `}</style>

      <div className="rprof-root">
        <div className="rprof-blob rprof-blob-1" />
        <div className="rprof-blob rprof-blob-2" />

        <div className="rprof-sidebar-col">
          <div className="rprof-sidebar-panel"><Sidebar /></div>
        </div>

        <main className="rprof-main">
          <div className="rprof-inner">
            <RetailerProfilePanel retailer={retailer} />
          </div>
        </main>
      </div>
    </>
  );
}