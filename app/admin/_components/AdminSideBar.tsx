// admin/components/AdminSidebar.tsx
"use client";

import React, { JSX } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Users, PlusCircle, Home } from "lucide-react";
import { handleLogout } from "@/lib/actions/auth-actions";

export default function AdminSidebar(): JSX.Element {
  const router = useRouter();

  async function onLogout() {
    try {
      await handleLogout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed");
    }
  }

  return (
    <aside style={{ width: 220, padding: 16, borderRight: "1px solid #eee" }}>
      <div style={{ marginBottom: 12 }}>
        <Link href="/admin" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Home /> <strong>Admin</strong>
        </Link>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/consumers/create">Add Consumer</Link>
        <Link href="/admin/retailers/create">Add Retailer</Link>
      </nav>

      <div style={{ marginTop: 16 }}>
        <button onClick={onLogout} style={{ width: "100%", padding: 8, background: "#e53e3e", color: "#fff", border: "none", borderRadius: 6 }}>
          <LogOut style={{ verticalAlign: "middle" }} /> Logout
        </button>
      </div>
    </aside>
  );
}
