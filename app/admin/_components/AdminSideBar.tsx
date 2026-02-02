// admin/components/AdminSidebar.tsx
"use client";

import React, { JSX } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Users, PlusCircle, Home, LayoutDashboard, UserPlus, Store } from "lucide-react";
import { handleLogout } from "@/lib/actions/auth-actions";
import { toast } from "react-toastify";

export default function AdminSidebar(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  async function onLogout() {
    try {
      await handleLogout();
      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Logout failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/consumers/create", label: "Add Consumer", icon: UserPlus },
    { href: "/admin/retailers/create", label: "Add Retailer", icon: Store },
  ];

  return (
    <aside
      style={{
        width: 260,
        height: "100vh",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 32,
          paddingBottom: 16,
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <Link
          href="/admin"
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            textDecoration: "none",
            color: "#111827",
            fontSize: 20,
            fontWeight: 700,
            transition: "color 0.2s",
          }}
        >
          <Home size={24} strokeWidth={2.5} />
          <span>Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 500,
                color: active ? "#2563eb" : "#4b5563",
                backgroundColor: active ? "#eff6ff" : "transparent",
                transition: "all 0.2s",
                border: active ? "1px solid #bfdbfe" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                  e.currentTarget.style.color = "#111827";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#4b5563";
                }
              }}
            >
              <Icon size={20} strokeWidth={2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div style={{ paddingTop: 16, borderTop: "1px solid #f3f4f6" }}>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "12px 16px",
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            border: "1px solid #fecaca",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fecaca";
            e.currentTarget.style.borderColor = "#fca5a5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fee2e2";
            e.currentTarget.style.borderColor = "#fecaca";
          }}
        >
          <LogOut size={18} strokeWidth={2} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}