// app/admin/consumers/create/page.tsx
"use client";
import React from "react";
import AdminSidebar from "../../_components/AdminSideBar";
import CreateUserForm from "../../_components/CreateUserForm";


export default function CreateConsumerPage() {
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 24 }}>
        <h2>Create Consumer</h2>
        <CreateUserForm initialType="consumer" />
      </main>
    </div>
  );
}
