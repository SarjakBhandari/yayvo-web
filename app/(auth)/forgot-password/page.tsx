// app/(auth)/forgot-password/page.tsx
"use client";
import React, { useState } from "react";
import { handleRequestPasswordReset } from "@/lib/actions/auth-actions";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await handleRequestPasswordReset(email);
      setStatus(res);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .fp-wrap {
          display: flex; align-items: center; justify-content: center;
          min-height: 100%; padding: 40px 20px;
          font-family: 'DM Sans', sans-serif;
        }
        .fp-card {
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(26,22,18,0.1);
          width: 100%; max-width: 420px;
        }
        .fp-card-top {
          padding: 32px 36px 26px;
          border-bottom: 1px solid #F0EBE1;
        }
        .fp-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; color: #9C8E7A; text-decoration: none;
          font-weight: 500; margin-bottom: 20px;
          transition: color 0.18s ease;
        }
        .fp-back:hover { color: #C9A96E; }
        .fp-icon-wrap {
          width: 52px; height: 52px; border-radius: 16px;
          background: #F0EBE1;
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E; margin-bottom: 16px;
        }
        .fp-eyebrow {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.14em; color: #9C8E7A;
          font-weight: 500; margin-bottom: 4px;
        }
        .fp-heading {
          font-family: 'Playfair Display', serif;
          font-size: 24px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em; line-height: 1.15;
          margin-bottom: 6px;
        }
        .fp-sub { font-size: 13px; color: #9C8E7A; line-height: 1.6; }

        .fp-card-body { padding: 26px 36px 32px; }
        .fp-form { display: flex; flex-direction: column; gap: 14px; }
        .fp-field { display: flex; flex-direction: column; gap: 6px; }
        .fp-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.1em; color: #9C8E7A; font-weight: 500;
        }
        .fp-input-wrap { position: relative; display: flex; align-items: center; }
        .fp-input-icon {
          position: absolute; left: 13px; color: #B8A898;
          pointer-events: none; display: flex; align-items: center;
          transition: color 0.18s ease;
        }
        .fp-input-wrap:focus-within .fp-input-icon { color: #C9A96E; }
        .fp-input {
          width: 100%; padding: 12px 14px 12px 40px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          border-radius: 12px; border: 1px solid #E8E4DC;
          background: #FAFAF8; color: #1A1612; outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .fp-input::placeholder { color: #B8A898; }
        .fp-input:focus { border-color: #C9A96E; box-shadow: 0 0 0 3px rgba(201,169,110,0.12); }

        .fp-submit-btn {
          width: 100%; padding: 13px;
          border-radius: 12px; border: none;
          background: #1A1612; color: #FAFAF8;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s ease; letter-spacing: 0.01em;
        }
        .fp-submit-btn:hover:not(:disabled) {
          background: #2A2420; transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(26,22,18,0.2);
        }
        .fp-submit-btn:disabled { opacity: 0.6; cursor: wait; }
        .fp-spin { animation: fpSpin 0.8s linear infinite; }
        @keyframes fpSpin { to { transform: rotate(360deg) } }

        /* Status banners */
        .fp-success {
          display: flex; align-items: flex-start; gap: 12px;
          background: #F0FBF4; border: 1px solid #A8D5B5;
          border-radius: 12px; padding: 14px 16px;
          font-size: 13px; color: #1A5733; line-height: 1.5;
        }
        .fp-success-icon { color: #2E7D4F; flex-shrink: 0; margin-top: 1px; }
        .fp-error {
          background: #FFF8F5; border: 1px solid #FFDDD0;
          border-radius: 12px; padding: 12px 14px;
          font-size: 13px; color: #C0392B;
        }
        .fp-footer {
          text-align: center; font-size: 13px; color: #9C8E7A;
          padding: 0 36px 28px;
        }
        .fp-footer a { color: #C9A96E; text-decoration: none; font-weight: 500; }
        .fp-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="fp-wrap">
        <div className="fp-card">
          <div className="fp-card-top">
            <Link href="/login" className="fp-back">
              <ArrowLeft size={13} /> Back to Sign In
            </Link>
            <div className="fp-icon-wrap"><Mail size={22} /></div>
            <div className="fp-eyebrow">Account Recovery</div>
            <h1 className="fp-heading">Forgot your password?</h1>
            <p className="fp-sub">Enter your email and we'll send you a link to reset it.</p>
          </div>

          <div className="fp-card-body">
            {status?.success ? (
              <div className="fp-success">
                <CheckCircle size={16} className="fp-success-icon" />
                <div>{status.message}</div>
              </div>
            ) : (
              <form className="fp-form" onSubmit={submit}>
                <div className="fp-field">
                  <label className="fp-label">Email Address</label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-icon"><Mail size={15} /></span>
                    <input
                      type="email" className="fp-input"
                      placeholder="you@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {status && !status.success && <div className="fp-error">{status.message}</div>}
                <button type="submit" className="fp-submit-btn" disabled={submitting}>
                  {submitting && <Loader2 size={15} className="fp-spin" />}
                  {submitting ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            )}
          </div>

          <div className="fp-footer">
            Remembered it? <Link href="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}