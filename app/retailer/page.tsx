// src/app/retailer/page.tsx
import React from "react";
import Sidebar from "./_components/sidebar";
import { getUserData } from "../../lib/cookie";
import type { Product } from "./_schemas/product.schema";
import { loadProductsByAuthor } from "../../lib/actions/product-actions";
import RetailerProductsGrid from "./_components/RetailerProductsGrid";

/**
 * Server Component
 */
export default async function Page() {
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
    <div style={{ display: "flex", gap: 24, padding: 24 }}>
      <Sidebar />

      <main style={{ flex: 1 }}>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>Dashboard</h1>

        <section style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 8,
              boxShadow: "0 6px 18px rgba(16,24,40,0.04)",
              minWidth: 160,
            }}
          >
            <div style={{ color: "#6b7280", fontWeight: 700 }}>Total Products</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{totalProducts}</div>
          </div>

          <div
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 8,
              boxShadow: "0 6px 18px rgba(16,24,40,0.04)",
              minWidth: 160,
            }}
          >
            <div style={{ color: "#6b7280", fontWeight: 700 }}>Total Likes</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{totalLikes}</div>
          </div>
        </section>

        <section>
          <h2 style={{ marginTop: 8 }}>My Products</h2>

          {myProducts.length === 0 ? (
            <div
              style={{
                color: "#6b7280",
                padding: 12,
                background: "#fff",
                borderRadius: 8,
                marginTop: 12,
              }}
            >
              You have no products yet. Create one from the Create page.
            </div>
          ) : (
            // Client Component: handles state, modal, update/delete
            <RetailerProductsGrid initialProducts={myProducts} />
          )}
        </section>
      </main>
    </div>
  );
}
