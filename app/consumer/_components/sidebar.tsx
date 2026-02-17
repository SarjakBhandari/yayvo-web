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
} from "lucide-react";
import { handleLogout } from "@/lib/actions/auth-actions";

export default function Sidebar() {
  const router = useRouter();
  const path = usePathname() || "/consumer/";

  async function onLogout() {
    try {
      await handleLogout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed");
    }
  }

  const items: { label: string; href: string; Icon: React.ComponentType<any> }[] = [
    { label: "Home",       href: "/consumer/",          Icon: Home      },
    { label: "Explore",    href: "/consumer/explore",   Icon: Compass   },
    { label: "Create",     href: "/consumer/create",    Icon: PlusSquare},
    { label: "Collection", href: "/consumer/collection",Icon: Bookmark  },
    { label: "Profile",    href: "/consumer/profile",   Icon: User      },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .sb-aside {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 28px 20px;
          font-family: 'DM Sans', sans-serif;
          background: transparent;
        }

        /* Logo */
        .sb-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 36px;
          padding: 0 8px;
          text-decoration: none;
        }
        .sb-logo-mark {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sb-logo-dot {
          width: 10px;
          height: 10px;
          background: #FAFAF8;
          border-radius: 50%;
        }
        .sb-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: #1A1612;
          letter-spacing: -0.02em;
        }

        /* Section label */
        .sb-section-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #B8A898;
          font-weight: 500;
          padding: 0 10px;
          margin-bottom: 8px;
        }

        /* Nav items */
        .sb-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .sb-link {
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
          overflow: hidden;
        }
        .sb-link:hover {
          background: #F0EBE1;
          color: #1A1612;
        }
        .sb-link.active {
          background: #1A1612;
          color: #FAFAF8;
          font-weight: 600;
        }
        .sb-link.active .sb-icon {
          color: #C9A96E;
        }
        .sb-icon {
          flex-shrink: 0;
          transition: color 0.18s ease;
        }
        .sb-link:not(.active):hover .sb-icon {
          color: #C9A96E;
        }

        /* Active indicator pip */
        .sb-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: #C9A96E;
          border-radius: 0 4px 4px 0;
        }

        /* Divider */
        .sb-divider {
          height: 1px;
          background: #E8E4DC;
          margin: 16px 0;
        }

        /* Logout */
        .sb-logout-btn {
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
        .sb-logout-btn:hover {
          background: #FFF1F1;
          border-color: #FFCDD2;
          color: #C0392B;
        }
        .sb-logout-btn:hover .sb-logout-icon {
          color: #C0392B;
        }
        .sb-logout-icon {
          flex-shrink: 0;
          transition: color 0.18s ease;
        }

        /* Bottom user area */
        .sb-bottom {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
      `}</style>

      <aside className="sb-aside" aria-label="Sidebar">

        {/* Logo */}
        <Link href="/consumer/" className="sb-logo">

          <span className="sb-logo-text">YAYVO</span>
        </Link>

        {/* Navigation */}
        <div className="sb-section-label">Menu</div>
        <nav className="sb-nav" aria-label="Main navigation">
          {items.map((it) => {
            const active = path === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`sb-link${active ? " active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <it.Icon size={17} className="sb-icon" />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="sb-bottom">
          <div className="sb-divider" />
          <button
            onClick={onLogout}
            className="sb-logout-btn"
            aria-label="Logout"
          >
            <LogOut size={17} className="sb-logout-icon" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}