// src/app/retailer/create/page.tsx
import React from "react";
import Sidebar from "../_components/sidebar";
import { getUserData } from "../../../lib/cookie";
import { loadRetailerByAuth } from "../../../lib/actions/retailer-actions";
import AddProductForm from "../_components/addProductForm";

/**
 * Server Component
 * - Uses server helpers (getUserData, loadRetailerByAuth)
 * - Renders client component AddProductForm (client-only)
 * - Uses inline styles so this file remains a Server Component
 */

export default async function Page() {
  const user = await getUserData();
  const authId = user?.authId || null;

  let retailer: any = null;
  try {
    if (authId) retailer = await loadRetailerByAuth(authId);
  } catch (err) {
    console.error("Failed to load retailer", err);
  }

  return (
    <div style={{ display: "flex", gap: 24, padding: 24 }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <h1 style={{ marginBottom: 12 }}>Create Product</h1>

        <AddProductForm
          initialRetailerAuthId={authId}
          initialRetailerName={retailer?.ownerName || retailer?.organizationName || ""}
        
        />
      </main>
    </div>
  );
}
