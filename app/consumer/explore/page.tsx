// app/consumer/explore/page.tsx  (or src/app/retailer/products/page.tsx)
import React from "react";
import Sidebar from "../_components/sidebar";
import { getUserData } from "../../../lib/cookie";
import type { Product } from "../../retailer/_schemas/product.schema";
import { loadMarketProducts } from "../../../lib/actions/product-actions";
import ProductsClient from "../_components/ProductsClient";

export default async function ExplorePage() {
  const user = await getUserData();
  const authId = user?.id || null;

  let initialProducts: Product[] = [];
  try {
    const res = await loadMarketProducts();
    initialProducts = res?.items || [];
  } catch (err) {
    console.error("Failed to load market products", err);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .exp-root {
          height: 100vh;
          display: flex;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* Ambient blobs */
        .exp-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
        }
        .exp-blob-1 {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(201,169,110,0.11) 0%, transparent 70%);
          top: -140px; left: 220px;
        }
        .exp-blob-2 {
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(139,107,61,0.07) 0%, transparent 70%);
          bottom: 20px; right: 60px;
        }
        .exp-blob-3 {
          width: 240px; height: 240px;
          background: radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%);
          top: 40%; left: 35%;
        }

        /* Sidebar */
        .exp-sidebar-col {
          position: relative;
          z-index: 1;
          flex: 0 0 260px;
          padding: 28px 0 28px 28px;
          display: flex;
          flex-direction: column;
        }
        .exp-sidebar-panel {
          flex: 1;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.05);
          display: flex;
          flex-direction: column;
        }

        /* Main */
        .exp-main {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 28px 28px 0 16px;
          min-width: 0;
          overflow: hidden;
        }

        /* Top bar */
        .exp-topbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .exp-heading-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .exp-eyebrow {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #9C8E7A;
          font-weight: 500;
        }
        .exp-heading {
          font-family: 'Playfair Display', serif;
          font-size: 34px;
          font-weight: 700;
          color: #1A1612;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .exp-count-badge {
          font-size: 12px;
          color: #B8A898;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 30px;
          padding: 6px 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          white-space: nowrap;
          align-self: center;
        }

        /* Scrollable content area */
        .exp-content {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 40px;
          scrollbar-width: thin;
          scrollbar-color: #D4C8B4 transparent;
        }
        .exp-content::-webkit-scrollbar { width: 4px; }
        .exp-content::-webkit-scrollbar-thumb { background: #D4C8B4; border-radius: 4px; }

        @media (max-width: 768px) {
          .exp-sidebar-col { display: none; }
          .exp-main { padding: 20px; }
        }
      `}</style>

      <div className="exp-root">
        {/* Blobs */}
        <div className="exp-blob exp-blob-1" />
        <div className="exp-blob exp-blob-2" />
        <div className="exp-blob exp-blob-3" />

        {/* Sidebar */}
        <div className="exp-sidebar-col">
          <div className="exp-sidebar-panel">
            <Sidebar />
          </div>
        </div>

        {/* Main */}
        <main className="exp-main">
          <div className="exp-topbar">
            <div className="exp-heading-group">
              <div className="exp-eyebrow">Discover</div>
              <h1 className="exp-heading">Explore</h1>
            </div>
            {initialProducts.length > 0 && (
              <div className="exp-count-badge">
                {initialProducts.length} product{initialProducts.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          <div className="exp-content">
            <ProductsClient
              initialProducts={initialProducts}
              excludeAuthId={authId}
              currentUserId={authId}
            />
          </div>
        </main>
      </div>
    </>
  );
}