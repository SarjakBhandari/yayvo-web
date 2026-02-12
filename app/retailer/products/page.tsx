// src/app/retailer/products/page.tsx
import React from "react";
import Sidebar from "../_components/sidebar";
import { getUserData } from "../../../lib/cookie";
import type { Product } from "../_schemas/product.schema";
import { loadMarketProducts } from "../../../lib/actions/product-actions";
import ProductsClient from "../_components/ProductsClient";

/**
 * Server component
 * - Calls server helpers (getUserData, loadMarketProducts)
 * - Renders client component ProductsClient (which can use styled-jsx / hooks)
 */

export default async function Page() {
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
    <div style={{ display: "flex", gap: 24, padding: 24 }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <h1 style={{ marginBottom: 12 }}>Market Products</h1>
        <ProductsClient initialProducts={initialProducts} excludeAuthId={authId} />
      </main>
    </div>
  );
}
