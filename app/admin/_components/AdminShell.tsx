// app/admin/_components/AdminShell.tsx
"use client";
import React from "react";
import AdminSidebar from "./AdminSideBar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
  eyebrow?: string;
  back?: string;
  children: React.ReactNode;
};

export default function AdminShell({ title, eyebrow = "Admin", back, children }: Props) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ash-root {
          height: 100vh; display: flex;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden; position: relative;
        }
        .ash-blob { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
        .ash-blob-1 { width: 480px; height: 480px; background: radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%); top: -140px; left: -60px; }
        .ash-blob-2 { width: 360px; height: 360px; background: radial-gradient(circle, rgba(139,107,61,0.07) 0%, transparent 70%); bottom: -80px; right: -60px; }

        .ash-sidebar-col { position: relative; z-index: 1; flex: 0 0 260px; display: flex; flex-direction: column; padding: 20px 0 20px 20px; }
        .ash-sidebar-panel { flex: 1; background: #FAFAF8; border: 1px solid #E8E4DC; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(26,22,18,0.05); display: flex; flex-direction: column; }

        .ash-main-col { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; padding: 20px 20px 20px 14px; min-width: 0; overflow: hidden; }
        .ash-main-inner { flex: 1; display: flex; flex-direction: column; overflow-y: auto; gap: 24px; scrollbar-width: thin; scrollbar-color: #D4C8B4 transparent; }
        .ash-main-inner::-webkit-scrollbar { width: 4px; }
        .ash-main-inner::-webkit-scrollbar-thumb { background: #D4C8B4; border-radius: 4px; }

        .ash-page-header { display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }
        .ash-back { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #9C8E7A; text-decoration: none; font-weight: 500; width: fit-content; margin-bottom: 4px; transition: color 0.18s ease; }
        .ash-back:hover { color: #C9A96E; }
        .ash-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #9C8E7A; font-weight: 500; }
        .ash-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #1A1612; letter-spacing: -0.025em; line-height: 1.12; }

        @media (max-width: 768px) {
          .ash-sidebar-col { display: none; }
          .ash-main-col { padding: 16px; }
        }
      `}</style>

      <div className="ash-root">
        <div className="ash-blob ash-blob-1" />
        <div className="ash-blob ash-blob-2" />

        <div className="ash-sidebar-col">
          <div className="ash-sidebar-panel"><AdminSidebar /></div>
        </div>

        <div className="ash-main-col">
          <div className="ash-main-inner">
            <div className="ash-page-header">
              {back && (
                <Link href={back} className="ash-back">
                  <ArrowLeft size={13} /> Back
                </Link>
              )}
              <div className="ash-eyebrow">{eyebrow}</div>
              <h1 className="ash-title">{title}</h1>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}