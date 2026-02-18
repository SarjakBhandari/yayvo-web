"use client";
import { Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLoginForm } from "../_hooks/use-login";
import Image from "next/image";
import { useState } from "react";

export default function LoginForm() {
  const {
    email, password, errors,
    handleEmail, handlePassword, handleSubmit,
  } = useLoginForm();

  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lf-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }
        .lf-blob {
          position: fixed; border-radius: 50%;
          filter: blur(80px); pointer-events: none; z-index: 0;
        }
        .lf-blob-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(201,169,110,0.13) 0%, transparent 70%);
          top: -150px; left: -100px;
        }
        .lf-blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(139,107,61,0.08) 0%, transparent 70%);
          bottom: -100px; right: -80px;
        }

        .lf-card {
          position: relative; z-index: 1;
          display: flex;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(26,22,18,0.12);
          width: 100%;
          max-width: 860px;
          min-height: 520px;
        }

        /* Left panel */
        .lf-left {
          flex: 0 0 340px;
          background: linear-gradient(160deg, #1A1612 0%, #2A2420 60%, #3A2E24 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
          gap: 28px;
        }
        .lf-left::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            45deg, transparent, transparent 22px,
            rgba(201,169,110,0.04) 22px, rgba(201,169,110,0.04) 44px
          );
        }
        .lf-left-blob {
          position: absolute;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,0.16) 0%, transparent 70%);
          bottom: -120px; right: -80px;
          pointer-events: none;
        }
        .lf-logo-wrap {
          position: relative; z-index: 1;
          width: 80px; height: 80px;
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(201,169,110,0.2) 0%, rgba(201,169,110,0.05) 100%);
          border: 1px solid rgba(201,169,110,0.25);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .lf-left-title {
          position: relative; z-index: 1;
          font-family: 'Playfair Display', serif;
          font-size: 32px; font-weight: 700;
          color: #FAFAF8; letter-spacing: -0.03em; line-height: 1.1;
          text-align: center;
        }
        .lf-left-sub {
          position: relative; z-index: 1;
          font-size: 14px; color: rgba(250,250,248,0.5);
          text-align: center; line-height: 1.6;
          font-weight: 300;
        }
        .lf-left-divider {
          position: relative; z-index: 1;
          width: 40px; height: 2px;
          background: linear-gradient(to right, #C9A96E, transparent);
          border-radius: 2px;
        }

        /* Right panel */
        .lf-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 44px;
        }
        .lf-form-eyebrow {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.14em; color: #9C8E7A; font-weight: 500;
          margin-bottom: 6px;
        }
        .lf-form-heading {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em; line-height: 1.1;
          margin-bottom: 28px;
        }

        .lf-form { display: flex; flex-direction: column; gap: 16px; }
        .lf-field { display: flex; flex-direction: column; gap: 6px; }
        .lf-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9C8E7A; font-weight: 500; }
        .lf-input-wrap {
          position: relative;
          display: flex; align-items: center;
        }
        .lf-input-icon {
          position: absolute; left: 13px;
          color: #B8A898; pointer-events: none;
          transition: color 0.18s ease;
          display: flex; align-items: center;
        }
        .lf-input {
          width: 100%; padding: 12px 14px 12px 40px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          border-radius: 12px; border: 1px solid #E8E4DC;
          background: #FAFAF8; color: #1A1612; outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .lf-input::placeholder { color: #B8A898; }
        .lf-input:focus { border-color: #C9A96E; box-shadow: 0 0 0 3px rgba(201,169,110,0.12); }
        .lf-input:focus ~ .lf-input-icon,
        .lf-input-wrap:focus-within .lf-input-icon { color: #C9A96E; }
        .lf-input.error { border-color: #E57373; }
        .lf-err { font-size: 12px; color: #C0392B; }
        .lf-general-err {
          background: #FFF8F5; border: 1px solid #FFDDD0;
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #C0392B;
        }

        .lf-forgot {
          text-align: right; margin-top: -6px;
        }
        .lf-forgot a {
          font-size: 12px; color: #9C8E7A; text-decoration: none;
          font-weight: 500; transition: color 0.18s ease;
        }
        .lf-forgot a:hover { color: #C9A96E; }

        .lf-submit-btn {
          width: 100%; padding: 13px;
          border-radius: 12px; border: none;
          background: #1A1612; color: #FAFAF8;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
          margin-top: 4px;
        }
        .lf-submit-btn:hover:not(:disabled) {
          background: #2A2420;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(26,22,18,0.2);
        }
        .lf-submit-btn:disabled { opacity: 0.6; cursor: wait; }
        .lf-spin { animation: lfSpin 0.8s linear infinite; }
        @keyframes lfSpin { to { transform: rotate(360deg) } }

        .lf-footer {
          text-align: center; font-size: 13px;
          color: #9C8E7A; margin-top: 4px;
        }
        .lf-footer a { color: #C9A96E; text-decoration: none; font-weight: 500; }
        .lf-footer a:hover { text-decoration: underline; }

        @media (max-width: 700px) {
          .lf-left { display: none; }
          .lf-card { max-width: 440px; }
          .lf-right { padding: 36px 28px; }
        }
      `}</style>

      <div className="lf-root">
        <div className="lf-blob lf-blob-1" />
        <div className="lf-blob lf-blob-2" />

        <div className="lf-card">
          {/* Left */}
          <div className="lf-left">
            <div className="lf-left-blob" />
            <div className="lf-logo-wrap">
              <Image src="/images/logo.png" alt="Yayvo Logo" width={52} height={52} priority style={{ objectFit: "contain" }} />
            </div>
            <div className="lf-left-divider" />
            <div className="lf-left-title">Welcome back.</div>
            <div className="lf-left-sub">Sign in to discover, save,<br />and share what you love.</div>
          </div>

          {/* Right */}
          <div className="lf-right">
            <div className="lf-form-eyebrow">Account Access</div>
            <div className="lf-form-heading">Sign In</div>

            <form
              className="lf-form"
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                try { await handleSubmit(); }
                finally { setSubmitting(false); }
              }}
            >
              <div className="lf-field">
                <label className="lf-label">Email</label>
                <div className="lf-input-wrap">
                  <span className="lf-input-icon"><Mail size={15} /></span>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmail}
                    placeholder="you@example.com"
                    className={`lf-input${errors.email ? " error" : ""}`}
                    required
                  />
                </div>
                {errors.email && <span className="lf-err">{errors.email}</span>}
              </div>

              <div className="lf-field">
                <label className="lf-label">Password</label>
                <div className="lf-input-wrap">
                  <span className="lf-input-icon"><Lock size={15} /></span>
                  <input
                    type="password"
                    value={password}
                    onChange={handlePassword}
                    placeholder="Your password"
                    className={`lf-input${errors.password ? " error" : ""}`}
                    required
                  />
                </div>
                {errors.password && <span className="lf-err">{errors.password}</span>}
              </div>

              {errors.general && <div className="lf-general-err">{errors.general}</div>}

              <div className="lf-forgot">
                <Link href="/forgot-password">Forgot password?</Link>
              </div>

              <button type="submit" className="lf-submit-btn" disabled={submitting}>
                {submitting && <Loader2 size={15} className="lf-spin" />}
                {submitting ? "Signing in…" : "Sign In"}
              </button>

              <div className="lf-footer">
                Don't have an account? <Link href="/">Create Account</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}