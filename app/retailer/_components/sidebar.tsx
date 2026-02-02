// components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Compass,
  PlusSquare,
  Bookmark,
  User,
  LogOut,
  Router,
} from "lucide-react";
import { handleLogout } from "@/lib/actions/auth-actions";



export default function Sidebar() {
      const router = useRouter();

  function onLogout() {
      try {
        handleLogout();
        router.push("/login");
      } catch (err) {
        console.error("Logout failed", err);
        alert("Logout failed");
      }
    }
  const path = usePathname() || "/consumer/";

  const items: { label: string; href: string; Icon: React.ComponentType<any> }[] = [
    { label: "Home", href: "/retailer/", Icon: Home },
    { label: "Products", href: "/retailer/products", Icon: Compass },
    { label: "Create", href: "/retailer/create", Icon: PlusSquare },
    { label: "Profile", href: "/retailer/profile", Icon: User },
  ];

  return (
    <aside
      style={{
        width: 260,
        padding: 20,
        borderRight: "1px solid #e6e6e6",
        height: "100vh",
        boxSizing: "border-box",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      aria-label="Sidebar"
    >
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>YAYVO</div>

        <nav aria-label="Main navigation">
          {items.map((it) => {
            const active = path === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: active ? "#111" : "#555",
                  background: active ? "rgba(0,0,0,0.04)" : "transparent",
                  marginBottom: 6,
                  transition: "background .12s, color .12s",
                }}
                aria-current={active ? "page" : undefined}
              >
                <it.Icon size={18} />
                <span style={{ fontWeight: 600 }}>{it.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <button
          onClick={() => onLogout}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            display: "flex",
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Logout"
        >
          <LogOut size={16} onClick={onLogout}/>
          Logout
        </button>
      </div>
    </aside>
  );
}
