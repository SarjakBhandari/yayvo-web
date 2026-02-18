// app/page.tsx
"use server";

import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hl-root {
          min-height: 100vh;
          display: flex; flex-direction: column;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
        }

        /* Blobs */
        .hl-blob {
          position: fixed; border-radius: 50%;
          filter: blur(90px); pointer-events: none; z-index: 0;
        }
        .hl-blob-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(201,169,110,0.13) 0%, transparent 70%);
          top: -200px; left: -120px;
        }
        .hl-blob-2 {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(139,107,61,0.08) 0%, transparent 70%);
          bottom: -100px; right: -80px;
        }
        .hl-blob-3 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%);
          top: 45%; right: 12%;
        }

        /* ── Appbar ── */
        .hl-appbar {
          position: relative; z-index: 10;
          background: rgba(250,250,248,0.85);
          border-bottom: 1px solid #E8E4DC;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          flex-shrink: 0;
        }
        .hl-appbar-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 40px; height: 66px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .hl-brand {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .hl-logo-mark {
          width: 36px; height: 36px; border-radius: 11px;
          background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; box-shadow: 0 2px 8px rgba(201,169,110,0.3);
          flex-shrink: 0;
        }
        .hl-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em;
        }
        .hl-nav { display: flex; align-items: center; gap: 4px; }
        .hl-nav-link {
          padding: 8px 16px; border-radius: 10px;
          text-decoration: none; font-size: 13px;
          font-weight: 500; color: #7A6A52;
          transition: all 0.18s ease;
          border: 1px solid transparent;
        }
        .hl-nav-link:hover {
          background: #F0EBE1; color: #1A1612;
          border-color: #E8E4DC;
        }
        .hl-nav-link.primary {
          background: #1A1612; color: #FAFAF8;
          border-color: #1A1612;
        }
        .hl-nav-link.primary:hover {
          background: #2A2420; color: #FAFAF8;
        }

        /* ── Hero ── */
        .hl-hero {
          position: relative; z-index: 1;
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 80px 32px 60px;
        }
        .hl-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: #F5F0E8; border: 1px solid #E8E4DC;
          border-radius: 30px; padding: 6px 16px;
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.14em; color: #9C8E7A; font-weight: 500;
          margin-bottom: 28px;
        }
        .hl-hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #C9A96E;
        }
        .hl-hero-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.6rem, 7vw, 4.4rem);
          font-weight: 700; line-height: 1.1;
          letter-spacing: -0.035em; color: #1A1612;
          max-width: 820px; margin: 0 auto 20px;
        }
        .hl-hero-h1 span {
          background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hl-hero-p {
          font-size: 17px; color: #5A4C38;
          max-width: 580px; margin: 0 auto 10px;
          line-height: 1.75; font-weight: 300;
        }
        .hl-hero-sub {
          font-size: 14px; color: #9C8E7A;
          max-width: 500px; margin: 0 auto;
          line-height: 1.65;
        }
        .hl-hero-sub strong { color: #7A6A52; font-weight: 600; }

        /* ── Button group ── */
        .hl-btn-group {
          margin-top: 44px;
          display: flex; gap: 10px; flex-wrap: wrap;
          justify-content: center;
        }
        .hl-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 24px; border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          text-decoration: none; cursor: pointer;
          transition: all 0.2s ease; letter-spacing: 0.01em;
          border: none;
        }
        .hl-btn-dark {
          background: #1A1612; color: #FAFAF8;
          box-shadow: 0 4px 14px rgba(26,22,18,0.18);
        }
        .hl-btn-dark:hover {
          background: #2A2420; transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(26,22,18,0.22);
        }
        .hl-btn-gold {
          background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%);
          color: #FAFAF8;
          box-shadow: 0 4px 14px rgba(201,169,110,0.3);
        }
        .hl-btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(201,169,110,0.38);
        }
        .hl-btn-outline {
          background: transparent; color: #5A4C38;
          border: 1px solid #D4C8B4;
        }
        .hl-btn-outline:hover {
          background: #F0EBE1; border-color: #C4B8A4;
          transform: translateY(-1px);
        }

        /* ── Divider ── */
        .hl-divider {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 0 40px;
          display: flex; align-items: center; gap: 20px;
        }
        .hl-divider-line { flex: 1; height: 1px; background: #E8E4DC; }
        .hl-divider-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.14em; color: #B8A898; font-weight: 500;
          white-space: nowrap;
        }

        /* ── Features ── */
        .hl-features {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 48px 40px 72px;
        }
        .hl-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        .hl-card {
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px; padding: 32px 28px;
          display: flex; flex-direction: column; gap: 12px;
          box-shadow: 0 2px 10px rgba(26,22,18,0.04);
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.18s ease;
        }
        .hl-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(26,22,18,0.09);
          border-color: #D4C8B4;
        }
        .hl-card-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: linear-gradient(135deg, #F0EBE1 0%, #E8E4DC 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
        }
        .hl-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.01em; line-height: 1.2;
        }
        .hl-card-body {
          font-size: 14px; color: #7A6A52;
          line-height: 1.7; font-weight: 300;
        }

        /* ── Footer ── */
        .hl-footer {
          position: relative; z-index: 1;
          text-align: center; padding: 20px 32px 24px;
          font-size: 12px; color: #B8A898;
          border-top: 1px solid #E8E4DC;
          background: rgba(250,250,248,0.7);
          backdrop-filter: blur(6px);
          letter-spacing: 0.03em; flex-shrink: 0;
        }
        .hl-footer-dot {
          display: inline-block; width: 3px; height: 3px;
          border-radius: 50%; background: #C9A96E;
          margin: 0 8px; vertical-align: middle;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .hl-appbar-inner { padding: 0 20px; }
          .hl-hero { padding: 60px 20px 40px; }
          .hl-btn-group { flex-direction: column; align-items: center; }
          .hl-btn { width: 100%; max-width: 320px; justify-content: center; }
          .hl-features { padding: 36px 20px 56px; }
          .hl-divider { padding: 0 20px; }
        }
        @media (max-width: 480px) {
          .hl-brand-name { display: none; }
          .hl-hero-h1 { font-size: 2.4rem; }
          .hl-features-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="hl-root">
        {/* Blobs */}
        <div className="hl-blob hl-blob-1" />
        <div className="hl-blob hl-blob-2" />
        <div className="hl-blob hl-blob-3" />

        {/* Appbar */}
        <header className="hl-appbar">
          <div className="hl-appbar-inner">
            <a href="/" className="hl-brand">
              <div className="hl-logo-mark">
                <Image src="/images/logo.png" alt="Yayvo" width={24} height={24} priority style={{ objectFit: "contain" }} />
              </div>
              <span className="hl-brand-name">Yayvo</span>
            </a>
            <nav className="hl-nav">
              <Link href="/login" className="hl-nav-link primary">Sign In</Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="hl-hero">
          <div className="hl-hero-eyebrow">
            <div className="hl-hero-eyebrow-dot" />
            Sentiment-first product discovery
          </div>
          <h1 className="hl-hero-h1">
            Products That <span>Feel Right</span>
          </h1>
          <p className="hl-hero-p">
            Express how products make you feel — with stories, icons, and authentic sentiment.
          </p>
          <p className="hl-hero-sub">
            Instead of star ratings, Yayvo highlights{" "}
            <strong>sentiment-based reviews</strong> — showing how products truly make people feel.
          </p>

          <div className="hl-btn-group">
            <Link href="/register/consumer" className="hl-btn hl-btn-dark">
              Start as Consumer
            </Link>
            <Link href="/register/retailer" className="hl-btn hl-btn-gold">
              Start as Retailer
            </Link>
            <Link href="/login" className="hl-btn hl-btn-outline">
              Already have an account?
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="hl-divider">
          <div className="hl-divider-line" />
          <span className="hl-divider-label">Why Yayvo</span>
          <div className="hl-divider-line" />
        </div>

        {/* Features */}
        <section className="hl-features">
          <div className="hl-features-grid">
            <div className="hl-card">
              <div className="hl-card-icon">🌊</div>
              <div className="hl-card-title">Emotion-First Discovery</div>
              <p className="hl-card-body">Find products based on how they make you feel, not just what they do. Browse by mood, vibe, and sentiment.</p>
            </div>
            <div className="hl-card">
              <div className="hl-card-icon">✨</div>
              <div className="hl-card-title">Personalized For You</div>
              <p className="hl-card-body">Recommendations tailored to your mood and lifestyle — curated by real sentiment, not algorithms alone.</p>
            </div>
            <div className="hl-card">
              <div className="hl-card-icon">🤝</div>
              <div className="hl-card-title">Authentic Community</div>
              <p className="hl-card-body">Connect with real people sharing genuine experiences. No fake five-stars — just honest emotional reviews.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="hl-footer">
          © {new Date().getFullYear()} Yayvo
          <span className="hl-footer-dot" />
          Lifestyle discovery through emotional design
          <span className="hl-footer-dot" />
          Web API coursework
        </footer>
      </div>
    </>
  );
}