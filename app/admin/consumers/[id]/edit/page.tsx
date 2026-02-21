// app/admin/consumers/[id]/edit/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/admin/_hooks/useUsers";
import { updateConsumer } from "@/lib/api/admin";
import AdminShell from "@/app/admin/_components/AdminShell";
import {
  UserPen, ArrowLeft,
  User, Phone, Calendar, Users, Globe, CheckCircle, Loader2, X,
} from "lucide-react";

const COUNTRIES = [
  "Nepal","India","China","United States","United Kingdom",
  "Australia","Canada","Germany","France","Japan",
];

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="ec-field">
      <label className="ec-label">{icon}{label}</label>
      <div className="ec-input-wrap">
        <span className="ec-input-icon">{icon}</span>
        {children}
      </div>
    </div>
  );
}

export default function EditConsumer() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, loading } = useUser(id, "consumer");
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName ?? "",
        phoneNumber: user.phoneNumber ?? "",
        dob: user.dob ?? "",
        gender: user.gender ?? "",
        country: user.country ?? "",
      });
    }
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateConsumer(id, form);
      router.push(`/admin/consumers/${id}`);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="Edit Consumer" eyebrow="Consumers">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .ec-back-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 14px; border-radius: 10px;
          background: transparent; border: 1px solid #E8E4DC;
          font-size: 13px; font-weight: 500; color: #7A6A52;
          cursor: pointer; transition: all 0.18s ease; font-family: inherit;
        }
        .ec-back-btn:hover { background: #F0EBE1; border-color: #D4C9B8; color: #1A1612; }

        .ec-page-header {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .ec-page-title-row { display: flex; align-items: center; gap: 12px; }
        .ec-page-icon {
          width: 44px; height: 44px; border-radius: 14px;
          background: linear-gradient(135deg, #F0EBE1 0%, #E8E4DC 100%);
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(201,169,110,0.15);
        }
        .ec-page-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em; margin: 0;
        }
        .ec-page-subtitle { font-size: 13px; color: #9C8E7A; margin: 2px 0 0; }

        .ec-divider {
          height: 1px; background: linear-gradient(90deg, #E8E4DC, transparent);
          margin: 4px 0;
        }

        /* Loading */
        .ec-loading {
          display: flex; align-items: center; justify-content: center;
          padding: 64px 0; gap: 10px;
        }
        .ec-loading-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #C9A96E;
          animation: ec-pulse 1.2s ease-in-out infinite;
        }
        .ec-loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .ec-loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ec-pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }

        /* Card */
        .ec-card {
          font-family: 'DM Sans', sans-serif;
          background: #FAFAF8; border: 1px solid #E8E4DC;
          border-radius: 22px; overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.07);
          max-width: 860px; width: 100%;
        }
        .ec-card-header {
          padding: 24px 28px; border-bottom: 1px solid #E8E4DC;
          background: #F5F0E8;
        }
        .ec-card-heading {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em; margin: 0;
        }

        /* Body & grid */
        .ec-body { padding: 26px 28px; }
        .ec-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
        }

        /* Fields — identical to cuf- */
        .ec-field { display: flex; flex-direction: column; gap: 6px; }
        .ec-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.1em; color: #9C8E7A; font-weight: 500;
          display: flex; align-items: center; gap: 6px;
        }
        .ec-input-wrap { position: relative; display: flex; align-items: center; }
        .ec-input-icon {
          position: absolute; left: 12px; color: #B8A898;
          pointer-events: none; display: flex; align-items: center;
          transition: color 0.18s ease;
        }
        .ec-input-wrap:focus-within .ec-input-icon { color: #C9A96E; }
        .ec-input, .ec-select {
          width: 100%;
          padding: 11px 14px 11px 38px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          border-radius: 12px; border: 1px solid #E8E4DC;
          background: #FAFAF8; color: #1A1612; outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          appearance: none; -webkit-appearance: none;
          box-sizing: border-box;
        }
        .ec-input::placeholder { color: #B8A898; }
        .ec-input:focus, .ec-select:focus {
          border-color: #C9A96E;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
        }
        .ec-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='%239C8E7A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 14px;
          padding-right: 36px;
        }
        input[type="date"].ec-input { cursor: pointer; }

        /* Footer */
        .ec-footer {
          padding: 18px 28px; border-top: 1px solid #E8E4DC;
          background: #F5F0E8; display: flex; gap: 10px; align-items: center;
        }
        .ec-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 12px; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; cursor: pointer;
          transition: all 0.18s ease; letter-spacing: 0.01em;
        }
        .ec-btn:disabled { opacity: 0.5; cursor: wait; }
        .ec-btn-primary { background: #1A1612; color: #FAFAF8; }
        .ec-btn-primary:hover:not(:disabled) {
          background: #2A2420; transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(26,22,18,0.2);
        }
        .ec-btn-cancel { background: #FAFAF8; color: #5A4C38; border: 1px solid #E8E4DC; }
        .ec-btn-cancel:hover:not(:disabled) { background: #F0EBE1; }
        .ec-spin { animation: ecSpin 0.8s linear infinite; }
        @keyframes ecSpin { to { transform: rotate(360deg); } }

        @media (max-width: 560px) { .ec-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Page header */}
      <div className="ec-page-header">
        <div className="ec-page-title-row">
          <div className="ec-page-icon"><UserPen size={20} /></div>
          <div>
            <h1 className="ec-page-title">Edit Consumer</h1>
            <p className="ec-page-subtitle">Update the details of this account</p>
          </div>
        </div>
        <button className="ec-back-btn" onClick={() => router.back()}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="ec-divider" />

      {/* Loading */}
      {(loading || !form) ? (
        <div className="ec-loading">
          <div className="ec-loading-dot" />
          <div className="ec-loading-dot" />
          <div className="ec-loading-dot" />
        </div>
      ) : (
        <div className="ec-card">
          <div className="ec-card-header">
            <h2 className="ec-card-heading">Account Information</h2>
          </div>

          <form onSubmit={handleSave}>
            <div className="ec-body">
              <div className="ec-grid">

                <Field icon={<User size={14} />} label="Full Name">
                  <input
                    className="ec-input"
                    placeholder="Jane Doe"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </Field>

                <Field icon={<Phone size={14} />} label="Phone">
                  <input
                    className="ec-input"
                    placeholder="+977 9800000000"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  />
                </Field>

                <Field icon={<Calendar size={14} />} label="Date of Birth">
                  <input
                    className="ec-input"
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  />
                </Field>

                <Field icon={<Users size={14} />} label="Gender">
                  <select
                    className="ec-select"
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  >
                    <option value="">Select gender</option>
                    {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </Field>

                <Field icon={<Globe size={14} />} label="Country">
                  <select
                    className="ec-select"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>

              </div>
            </div>

            <div className="ec-footer">
              <button type="submit" className="ec-btn ec-btn-primary" disabled={saving}>
                {saving ? <Loader2 size={14} className="ec-spin" /> : <CheckCircle size={14} />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                className="ec-btn ec-btn-cancel"
                onClick={() => router.push(`/admin/consumers/${id}`)}
                disabled={saving}
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}

