// src/app/retailer/create/page.tsx
import React from "react";
import Sidebar from "../_components/sidebar";
import { getUserData } from "../../../lib/cookie";
import { loadRetailerByAuth } from "../../../lib/actions/retailer-actions";
import AddProductForm from "../_components/addProductForm";

export default async function RetailerCreatePage() {
  const user = await getUserData();
  const authId = user?.authId || null;

  let retailer: any = null;
  try {
    if (authId) retailer = await loadRetailerByAuth(authId);
  } catch (err) {
    console.error("Failed to load retailer", err);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rc-root {
          height: 100vh;
          display: flex;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }
        .rc-blob {
          position: fixed; border-radius: 50%;
          filter: blur(80px); pointer-events: none; z-index: 0;
        }
        .rc-blob-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(201,169,110,0.11) 0%, transparent 70%);
          top: -80px; left: 160px;
        }
        .rc-blob-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(139,107,61,0.07) 0%, transparent 70%);
          bottom: 40px; right: 80px;
        }
        .rc-sidebar-col {
          position: relative; z-index: 1;
          flex: 0 0 260px;
          padding: 28px 0 28px 28px;
          display: flex; flex-direction: column;
        }
        .rc-sidebar-panel {
          flex: 1;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.05);
          display: flex; flex-direction: column;
        }
        .rc-main {
          position: relative; z-index: 1;
          flex: 1;
          padding: 28px 28px 40px 16px;
          overflow-y: auto;
          min-width: 0;
          display: flex; flex-direction: column;
          gap: 24px;
          scrollbar-width: thin; scrollbar-color: #D4C8B4 transparent;
        }
        .rc-main::-webkit-scrollbar { width: 4px; }
        .rc-main::-webkit-scrollbar-thumb { background: #D4C8B4; border-radius: 4px; }
        .rc-header { display: flex; flex-direction: column; gap: 2px; }
        .rc-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #9C8E7A; font-weight: 500; }
        .rc-heading { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 700; color: #1A1612; letter-spacing: -0.03em; line-height: 1.1; }

        @media (max-width: 768px) {
          .rc-sidebar-col { display: none; }
          .rc-main { padding: 20px; }
        }
      `}</style>

      <div className="rc-root">
        <div className="rc-blob rc-blob-1" />
        <div className="rc-blob rc-blob-2" />

        <div className="rc-sidebar-col">
          <div className="rc-sidebar-panel"><Sidebar /></div>
        </div>

        <main className="rc-main">
          <div className="rc-header">
            <div className="rc-eyebrow">Retailer</div>
            <h1 className="rc-heading">Create Product</h1>
          </div>
          <AddProductForm
            initialRetailerAuthId={authId}
            initialRetailerName={retailer?.ownerName || retailer?.organizationName || ""}
          />
        </main>
      </div>
    </>
  );
}