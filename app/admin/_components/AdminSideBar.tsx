// admin/components/AdminSidebar.tsx
"use client";

import React, { JSX } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, UserPlus, Store } from "lucide-react";
import { handleLogout } from "@/lib/actions/auth-actions";
import { toast } from "react-toastify";

export default function AdminSidebar(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  async function onLogout() {
    try {
      await handleLogout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Logout failed. Please try again.");
    }
  }

  const navItems = [
    { href: "/admin",                   label: "Dashboard",   Icon: LayoutDashboard },
    { href: "/admin/consumers/create",  label: "Add Consumer", Icon: UserPlus        },
    { href: "/admin/retailers/create",  label: "Add Retailer", Icon: Store           },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .asb {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          padding: 28px 18px;
          font-family: 'DM Sans', sans-serif;
          background: transparent;
        }

        /* Logo */
        .asb-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; margin-bottom: 36px; padding: 0 8px;
        }
        .asb-logo-mark {
          width: 32px; height: 32px; border-radius: 10px;
          background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 2px 8px rgba(201,169,110,0.3);
        }
        .asb-logo-dot { width: 10px; height: 10px; background: #FAFAF8; border-radius: 50%; }
        .asb-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em;
        }
        .asb-logo-badge {
          font-size: 10px; text-transform: uppercase;
          letter-spacing: 0.12em; color: #9C8E7A;
          font-weight: 500; margin-left: 2px;
        }

        /* Section label */
        .asb-section-label {
          font-size: 10px; text-transform: uppercase;
          letter-spacing: 0.14em; color: #B8A898;
          font-weight: 500; padding: 0 10px; margin-bottom: 8px;
        }

        /* Nav */
        .asb-nav { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .asb-link {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 12px; border-radius: 12px;
          text-decoration: none; color: #7A6A52;
          font-weight: 500; font-size: 14px;
          transition: all 0.18s ease; position: relative;
          border: 1px solid transparent;
        }
        .asb-link:hover { background: #F0EBE1; color: #1A1612; }
        .asb-link.active {
          background: #1A1612; color: #FAFAF8;
          font-weight: 600; border-color: #1A1612;
        }
        .asb-link.active::before {
          content: ''; position: absolute;
          left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 60%;
          background: #C9A96E; border-radius: 0 4px 4px 0;
        }
        .asb-icon { flex-shrink: 0; transition: color 0.18s ease; }
        .asb-link.active .asb-icon { color: #C9A96E; }
        .asb-link:not(.active):hover .asb-icon { color: #C9A96E; }

        /* Divider */
        .asb-divider { height: 1px; background: #E8E4DC; margin: 16px 0; }

        /* Logout */
        .asb-logout {
          display: flex; align-items: center; gap: 12px;
          width: 100%; padding: 11px 12px; border-radius: 12px;
          border: 1px solid #E8E4DC; background: transparent;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; color: #9C8E7A;
          transition: all 0.18s ease; text-align: left;
        }
        .asb-logout:hover {
          background: #FFF1F1; border-color: #FFCDD2; color: #C0392B;
        }
        .asb-logout:hover .asb-logout-icon { color: #C0392B; }
        .asb-logout-icon { flex-shrink: 0; color: #B8A898; transition: color 0.18s ease; }
      `}</style>

      <aside className="asb" aria-label="Admin navigation">
        <a href="/admin" className="asb-logo">
          <div className="asb-logo-mark"><div className="asb-logo-dot" /></div>
          <div>
            <div className="asb-logo-text">Yayvo</div>
          </div>
          <span className="asb-logo-badge">Admin</span>
        </a>

        <div className="asb-section-label">Navigation</div>
        <nav className="asb-nav">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`asb-link${active ? " active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={17} className="asb-icon" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div>
          <div className="asb-divider" />
          <button onClick={onLogout} className="asb-logout" aria-label="Log out">
            <LogOut size={17} className="asb-logout-icon" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}