// src/app/retailer/products/page.tsx
import React from "react";
import Sidebar from "../_components/sidebar";
import { getUserData } from "../../../lib/cookie";
import type { Product } from "../_schemas/product.schema";
import { loadMarketProducts } from "../../../lib/actions/product-actions";
import ProductsClient from "../_components/ProductsClient";

export default async function RetailerProductsPage() {
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

        .rp-root {
          height: 100vh;
          display: flex;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }
        .rp-blob {
          position: fixed; border-radius: 50%;
          filter: blur(80px); pointer-events: none; z-index: 0;
        }
        .rp-blob-1 {
          width: 460px; height: 460px;
          background: radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%);
          top: -120px; left: 200px;
        }
        .rp-blob-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(139,107,61,0.07) 0%, transparent 70%);
          bottom: 40px; right: 60px;
        }
        .rp-sidebar-col {
          position: relative; z-index: 1;
          flex: 0 0 260px;
          padding: 28px 0 28px 28px;
          display: flex; flex-direction: column;
        }
        .rp-sidebar-panel {
          flex: 1;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.05);
          display: flex; flex-direction: column;
        }
        .rp-main {
          position: relative; z-index: 1;
          flex: 1;
          padding: 28px 28px 0 16px;
          overflow: hidden;
          min-width: 0;
          display: flex; flex-direction: column;
          gap: 24px;
        }
        .rp-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }
        .rp-heading-group { display: flex; flex-direction: column; gap: 2px; }
        .rp-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #9C8E7A; font-weight: 500; }
        .rp-heading { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 700; color: #1A1612; letter-spacing: -0.03em; line-height: 1.1; }
        .rp-count-badge {
          font-size: 12px; color: #B8A898;
          background: #FAFAF8; border: 1px solid #E8E4DC;
          border-radius: 30px; padding: 6px 14px;
          font-weight: 500; letter-spacing: 0.02em;
          align-self: center;
        }
        .rp-content {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 40px;
          scrollbar-width: thin; scrollbar-color: #D4C8B4 transparent;
        }
        .rp-content::-webkit-scrollbar { width: 4px; }
        .rp-content::-webkit-scrollbar-thumb { background: #D4C8B4; border-radius: 4px; }

        @media (max-width: 768px) {
          .rp-sidebar-col { display: none; }
          .rp-main { padding: 20px; }
        }
      `}</style>

      <div className="rp-root">
        <div className="rp-blob rp-blob-1" />
        <div className="rp-blob rp-blob-2" />

        <div className="rp-sidebar-col">
          <div className="rp-sidebar-panel"><Sidebar /></div>
        </div>

        <main className="rp-main">
          <div className="rp-header">
            <div className="rp-heading-group">
              <div className="rp-eyebrow">Market</div>
              <h1 className="rp-heading">Products</h1>
            </div>
            {initialProducts.length > 0 && (
              <div className="rp-count-badge">{initialProducts.length} product{initialProducts.length !== 1 ? "s" : ""}</div>
            )}
          </div>
          <div className="rp-content">
            <ProductsClient initialProducts={initialProducts} excludeAuthId={authId} />
          </div>
        </main>
      </div>
    </>
  );
}