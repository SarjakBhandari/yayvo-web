// app/admin/retailers/create/page.tsx
"use client";
import React from "react";
import AdminSidebar from "../../_components/AdminSideBar";
import CreateUserForm from "../../_components/CreateUserForm";


export default function CreateRetailerPage() {
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 24 }}>
        <h2>Create Retailer</h2>
        <CreateUserForm initialType="retailer" />
      </main>
    </div>
  );
}
