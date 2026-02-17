// src/app/retailer/_components/sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Package, PlusSquare, User, LogOut } from "lucide-react";
import { handleLogout } from "@/lib/actions/auth-actions";

export default function Sidebar() {
  const router = useRouter();
  const path = usePathname() || "/retailer/";

  async function onLogout() {
    try {
      await handleLogout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  const items = [
    { label: "Dashboard", href: "/retailer/",       Icon: Home       },
    { label: "Products",  href: "/retailer/products", Icon: Package    },
    { label: "Create",    href: "/retailer/create",   Icon: PlusSquare },
    { label: "Profile",   href: "/retailer/profile",  Icon: User       },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .rsb-aside {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 28px 20px;
          font-family: 'DM Sans', sans-serif;
          background: transparent;
        }
        .rsb-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 36px;
          padding: 0 8px;
          text-decoration: none;
        }
        .rsb-logo-mark {
          width: 32px; height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .rsb-logo-dot {
          width: 10px; height: 10px;
          background: #FAFAF8;
          border-radius: 50%;
        }
        .rsb-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #1A1612;
          letter-spacing: -0.02em;
        }
        .rsb-section-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #B8A898;
          font-weight: 500;
          padding: 0 10px;
          margin-bottom: 8px;
        }
        .rsb-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .rsb-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border-radius: 12px;
          text-decoration: none;
          color: #7A6A52;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.18s ease;
          position: relative;
        }
        .rsb-link:hover { background: #F0EBE1; color: #1A1612; }
        .rsb-link.active { background: #1A1612; color: #FAFAF8; font-weight: 600; }
        .rsb-link.active::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 60%;
          background: #C9A96E;
          border-radius: 0 4px 4px 0;
        }
        .rsb-icon { flex-shrink: 0; transition: color 0.18s ease; }
        .rsb-link.active .rsb-icon { color: #C9A96E; }
        .rsb-link:not(.active):hover .rsb-icon { color: #C9A96E; }
        .rsb-divider { height: 1px; background: #E8E4DC; margin: 16px 0; }
        .rsb-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 11px 12px;
          border-radius: 12px;
          border: 1px solid #E8E4DC;
          background: transparent;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #9C8E7A;
          text-align: left;
          transition: all 0.18s ease;
        }
        .rsb-logout-btn:hover { background: #FFF1F1; border-color: #FFCDD2; color: #C0392B; }
      `}</style>

      <aside className="rsb-aside" aria-label="Retailer Sidebar">
        <Link href="/retailer/" className="rsb-logo">
          <div className="rsb-logo-mark"><div className="rsb-logo-dot" /></div>
          <span className="rsb-logo-text">Yayvo</span>
        </Link>

        <div className="rsb-section-label">Menu</div>
        <nav className="rsb-nav" aria-label="Retailer navigation">
          {items.map((it) => {
            const active = path === it.href;
            return (
              <Link key={it.href} href={it.href} className={`rsb-link${active ? " active" : ""}`} aria-current={active ? "page" : undefined}>
                <it.Icon size={17} className="rsb-icon" />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>

        <div>
          <div className="rsb-divider" />
          <button onClick={onLogout} className="rsb-logout-btn" aria-label="Logout">
            <LogOut size={17} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}