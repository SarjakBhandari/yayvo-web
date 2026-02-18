// app/(auth)/layout.tsx
"use server";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthToken, getUserData } from "@/lib/cookie";
import { handleLogout } from "@/lib/actions/auth-actions";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const token = await getAuthToken();
  const user = await getUserData();

  if (token && user) {
    if (user.role === "consumer")     redirect("/consumer");
    else if (user.role === "retailer") redirect("/retailer");
    else if (user.role === "admin")    redirect("/admin");
    else { await handleLogout(); redirect("/login"); }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .al-root {
          min-height: 100vh;
          display: flex; flex-direction: column;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          position: relative;
        }

        /* Ambient blobs */
        .al-blob {
          position: fixed; border-radius: 50%;
          filter: blur(90px); pointer-events: none; z-index: 0;
        }
        .al-blob-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(201,169,110,0.11) 0%, transparent 70%);
          top: -160px; left: -80px;
        }
        .al-blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(139,107,61,0.07) 0%, transparent 70%);
          bottom: -80px; right: -60px;
        }
        .al-blob-3 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%);
          top: 40%; right: 15%;
        }

        /* Appbar */
        .al-appbar {
          position: relative; z-index: 10;
          padding: 0 32px;
          height: 64px;
          display: flex; align-items: center;
          border-bottom: 1px solid #E8E4DC;
          background: rgba(250,250,248,0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          flex-shrink: 0;
        }
        .al-appbar-inner {
          width: 100%; max-width: 1200px;
          margin: 0 auto;
          display: flex; align-items: center;
          justify-content: space-between;
        }
        .al-appbar-left {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .al-logo-mark {
          width: 36px; height: 36px; border-radius: 11px;
          background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(201,169,110,0.3);
        }
        .al-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 19px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em;
        }
        .al-appbar-nav { display: flex; align-items: center; gap: 4px; }
        .al-nav-link {
          padding: 7px 14px; border-radius: 10px;
          text-decoration: none;
          font-size: 13px; font-weight: 500; color: #7A6A52;
          transition: all 0.18s ease;
        }
        .al-nav-link:hover { background: #F0EBE1; color: #1A1612; }

        /* Main content */
        .al-main {
          position: relative; z-index: 1;
          flex: 1; display: flex;
          flex-direction: column;
        }

        /* Footer */
        .al-footer {
          position: relative; z-index: 1;
          text-align: center;
          padding: 20px 20px 24px;
          font-size: 12px;
          color: #B8A898;
          border-top: 1px solid #E8E4DC;
          background: rgba(250,250,248,0.6);
          backdrop-filter: blur(8px);
          letter-spacing: 0.02em;
          flex-shrink: 0;
        }
        .al-footer-dot {
          display: inline-block;
          width: 3px; height: 3px; border-radius: 50%;
          background: #C9A96E; margin: 0 8px;
          vertical-align: middle;
        }

        @media (max-width: 480px) {
          .al-appbar { padding: 0 16px; }
          .al-logo-text { display: none; }
        }
      `}</style>

      <div className="al-root">
        {/* Blobs */}
        <div className="al-blob al-blob-1" />
        <div className="al-blob al-blob-2" />
        <div className="al-blob al-blob-3" />

        {/* Appbar */}
        <header className="al-appbar">
          <div className="al-appbar-inner">
            <Link href="/" className="al-appbar-left">
              <div className="al-logo-mark">
                <Image src="/images/logo.png" alt="Yayvo" width={24} height={24} style={{ objectFit: "contain" }} />
              </div>
              <span className="al-logo-text">Yayvo</span>
            </Link>
            <nav className="al-appbar-nav">
              <Link href="/" className="al-nav-link">Home</Link>
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main className="al-main">{children}</main>

        {/* Footer */}
        <footer className="al-footer">
          © {new Date().getFullYear()} Yayvo
          <span className="al-footer-dot" />
          Lifestyle discovery through emotional design
        </footer>
      </div>
    </>
  );
}