// app/(auth)/reset-password/page.tsx
"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { handleResetPassword } from "@/lib/actions/auth-actions";
import { Lock, Loader2, ArrowLeft, CheckCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [mismatch, setMismatch] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirm) { setMismatch(true); return; }
    setMismatch(false);
    setSubmitting(true);
    try {
      const res = await handleResetPassword(token, newPassword);
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

        .rp-wrap {
          display: flex; align-items: center; justify-content: center;
          min-height: 100%; padding: 40px 20px;
          font-family: 'DM Sans', sans-serif;
        }
        .rp-card {
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 22px; overflow: hidden;
          box-shadow: 0 16px 48px rgba(26,22,18,0.1);
          width: 100%; max-width: 420px;
        }
        .rp-card-top {
          padding: 32px 36px 26px;
          border-bottom: 1px solid #F0EBE1;
        }
        .rp-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; color: #9C8E7A; text-decoration: none;
          font-weight: 500; margin-bottom: 20px; transition: color 0.18s ease;
        }
        .rp-back:hover { color: #C9A96E; }
        .rp-icon-wrap {
          width: 52px; height: 52px; border-radius: 16px;
          background: #F0EBE1;
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E; margin-bottom: 16px;
        }
        .rp-eyebrow {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.14em; color: #9C8E7A; font-weight: 500; margin-bottom: 4px;
        }
        .rp-heading {
          font-family: 'Playfair Display', serif;
          font-size: 24px; font-weight: 700; color: #1A1612;
          letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 6px;
        }
        .rp-sub { font-size: 13px; color: #9C8E7A; line-height: 1.6; }

        .rp-card-body { padding: 26px 36px 32px; }
        .rp-form { display: flex; flex-direction: column; gap: 14px; }
        .rp-field { display: flex; flex-direction: column; gap: 6px; }
        .rp-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.1em; color: #9C8E7A; font-weight: 500;
        }
        .rp-input-wrap { position: relative; display: flex; align-items: center; }
        .rp-input-icon {
          position: absolute; left: 13px; color: #B8A898;
          pointer-events: none; display: flex; align-items: center;
          transition: color 0.18s ease;
        }
        .rp-input-wrap:focus-within .rp-input-icon { color: #C9A96E; }
        .rp-input {
          width: 100%; padding: 12px 14px 12px 40px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          border-radius: 12px; border: 1px solid #E8E4DC;
          background: #FAFAF8; color: #1A1612; outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .rp-input::placeholder { color: #B8A898; }
        .rp-input:focus { border-color: #C9A96E; box-shadow: 0 0 0 3px rgba(201,169,110,0.12); }
        .rp-input.error { border-color: #E57373; }
        .rp-err { font-size: 12px; color: #C0392B; }

        .rp-submit-btn {
          width: 100%; padding: 13px;
          border-radius: 12px; border: none;
          background: #1A1612; color: #FAFAF8;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s ease; letter-spacing: 0.01em;
        }
        .rp-submit-btn:hover:not(:disabled) {
          background: #2A2420; transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(26,22,18,0.2);
        }
        .rp-submit-btn:disabled { opacity: 0.6; cursor: wait; }
        .rp-spin { animation: rpSpin 0.8s linear infinite; }
        @keyframes rpSpin { to { transform: rotate(360deg) } }

        .rp-success {
          display: flex; align-items: flex-start; gap: 12px;
          background: #F0FBF4; border: 1px solid #A8D5B5;
          border-radius: 12px; padding: 14px 16px;
          font-size: 13px; color: #1A5733; line-height: 1.5;
        }
        .rp-success-icon { color: #2E7D4F; flex-shrink: 0; margin-top: 1px; }
        .rp-error-box {
          background: #FFF8F5; border: 1px solid #FFDDD0;
          border-radius: 12px; padding: 12px 14px;
          font-size: 13px; color: #C0392B;
        }
        .rp-footer {
          text-align: center; font-size: 13px; color: #9C8E7A;
          padding: 0 36px 28px;
        }
        .rp-footer a { color: #C9A96E; text-decoration: none; font-weight: 500; }
        .rp-footer a:hover { text-decoration: underline; }

        /* Token missing warning */
        .rp-token-warn {
          margin: 20px; padding: 16px;
          background: #FFF8F5; border: 1px solid #FFDDD0;
          border-radius: 14px; font-size: 13px; color: #C0392B;
          text-align: center;
        }
      `}</style>

      <div className="rp-wrap">
        <div className="rp-card">
          <div className="rp-card-top">
            <Link href="/login" className="rp-back">
              <ArrowLeft size={13} /> Back to Sign In
            </Link>
            <div className="rp-icon-wrap"><ShieldCheck size={22} /></div>
            <div className="rp-eyebrow">Account Security</div>
            <h1 className="rp-heading">Set a new password</h1>
            <p className="rp-sub">Choose a strong password you haven't used before.</p>
          </div>

          <div className="rp-card-body">
            {!token ? (
              <div className="rp-token-warn">
                Invalid or missing reset token. Please request a new reset link.
              </div>
            ) : status?.success ? (
              <div className="rp-success">
                <CheckCircle size={16} className="rp-success-icon" />
                <div>
                  {status.message}
                  {" "}<Link href="/login" style={{ color: "#2E7D4F", fontWeight: 600 }}>Sign in now →</Link>
                </div>
              </div>
            ) : (
              <form className="rp-form" onSubmit={submit}>
                <div className="rp-field">
                  <label className="rp-label">New Password</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon"><Lock size={15} /></span>
                    <input
                      type="password" className="rp-input"
                      placeholder="Min 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="rp-field">
                  <label className="rp-label">Confirm Password</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon"><Lock size={15} /></span>
                    <input
                      type="password" className={`rp-input${mismatch ? " error" : ""}`}
                      placeholder="Repeat new password"
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setMismatch(false); }}
                      required
                    />
                  </div>
                  {mismatch && <span className="rp-err">Passwords do not match.</span>}
                </div>

                {status && !status.success && <div className="rp-error-box">{status.message}</div>}

                <button type="submit" className="rp-submit-btn" disabled={submitting}>
                  {submitting && <Loader2 size={15} className="rp-spin" />}
                  {submitting ? "Updating…" : "Update Password"}
                </button>
              </form>
            )}
          </div>

          <div className="rp-footer">
            Remembered it? <Link href="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}