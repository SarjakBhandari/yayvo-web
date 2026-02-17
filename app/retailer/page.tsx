// src/app/retailer/page.tsx
import React from "react";
import Sidebar from "./_components/sidebar";
import { getUserData } from "../../lib/cookie";
import type { Product } from "./_schemas/product.schema";
import { loadProductsByAuthor } from "../../lib/actions/product-actions";
import RetailerProductsGrid from "./_components/RetailerProductsGrid";
import { Package, Heart } from "lucide-react";

export default async function RetailerDashboardPage() {
  const user = await getUserData();
  const authId = user?.id || null;

  let myProducts: Product[] = [];
  try {
    if (authId) {
      const res = await loadProductsByAuthor(authId);
      myProducts = res?.items || [];
    }
  } catch (err) {
    console.error("Failed to load my products", err);
  }

  const totalProducts = myProducts.length;
  const totalLikes = myProducts.reduce((acc, p) => acc + (p.noOfLikes || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rd-root {
          height: 100vh;
          display: flex;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }
        .rd-blob {
          position: fixed; border-radius: 50%;
          filter: blur(80px); pointer-events: none; z-index: 0;
        }
        .rd-blob-1 {
          width: 460px; height: 460px;
          background: radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%);
          top: -120px; left: 200px;
        }
        .rd-blob-2 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(139,107,61,0.07) 0%, transparent 70%);
          bottom: 40px; right: 60px;
        }
        .rd-sidebar-col {
          position: relative; z-index: 1;
          flex: 0 0 260px;
          padding: 28px 0 28px 28px;
          display: flex; flex-direction: column;
        }
        .rd-sidebar-panel {
          flex: 1;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.05);
          display: flex; flex-direction: column;
        }
        .rd-main {
          position: relative; z-index: 1;
          flex: 1;
          padding: 28px 28px 40px 16px;
          overflow-y: auto;
          display: flex; flex-direction: column;
          gap: 28px;
          min-width: 0;
          scrollbar-width: thin;
          scrollbar-color: #D4C8B4 transparent;
        }
        .rd-main::-webkit-scrollbar { width: 4px; }
        .rd-main::-webkit-scrollbar-thumb { background: #D4C8B4; border-radius: 4px; }

        /* Header */
        .rd-header { display: flex; flex-direction: column; gap: 2px; }
        .rd-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #9C8E7A; font-weight: 500; }
        .rd-heading { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 700; color: #1A1612; letter-spacing: -0.03em; line-height: 1.1; }

        /* Stats */
        .rd-stats { display: flex; gap: 14px; flex-wrap: wrap; }
        .rd-stat-card {
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 18px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 180px;
          box-shadow: 0 2px 10px rgba(26,22,18,0.04);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .rd-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,22,18,0.08); }
        .rd-stat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .rd-stat-icon-products { background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%); color: #fff; }
        .rd-stat-icon-likes { background: linear-gradient(135deg, #E57373 0%, #C62828 100%); color: #fff; }
        .rd-stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9C8E7A; font-weight: 500; }
        .rd-stat-value { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #1A1612; letter-spacing: -0.03em; line-height: 1; margin-top: 3px; }

        /* Section */
        .rd-section-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .rd-section-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #1A1612; letter-spacing: -0.02em; }
        .rd-section-count { font-size: 12px; color: #B8A898; background: #FAFAF8; border: 1px solid #E8E4DC; border-radius: 30px; padding: 5px 13px; font-weight: 500; }
      `}</style>

      <div className="rd-root">
        <div className="rd-blob rd-blob-1" />
        <div className="rd-blob rd-blob-2" />

        <div className="rd-sidebar-col">
          <div className="rd-sidebar-panel"><Sidebar /></div>
        </div>

        <main className="rd-main">
          <div className="rd-header">
            <div className="rd-eyebrow">Welcome back</div>
            <h1 className="rd-heading">Dashboard</h1>
          </div>

          <div className="rd-stats">
            <div className="rd-stat-card">
              <div className="rd-stat-icon rd-stat-icon-products"><Package size={20} /></div>
              <div>
                <div className="rd-stat-label">Total Products</div>
                <div className="rd-stat-value">{totalProducts}</div>
              </div>
            </div>
            <div className="rd-stat-card">
              <div className="rd-stat-icon rd-stat-icon-likes"><Heart size={20} /></div>
              <div>
                <div className="rd-stat-label">Total Likes</div>
                <div className="rd-stat-value">{totalLikes}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="rd-section-header" style={{ marginBottom: 16 }}>
              <div className="rd-section-title">My Products</div>
              {myProducts.length > 0 && <div className="rd-section-count">{totalProducts} product{totalProducts !== 1 ? "s" : ""}</div>}
            </div>
            <RetailerProductsGrid initialProducts={myProducts} />
          </div>
        </main>
      </div>
    </>
  );
}