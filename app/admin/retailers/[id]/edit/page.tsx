// app/admin/retailers/[id]/edit/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/admin/_hooks/useUsers";
import { updateRetailer } from "@/lib/api/admin";
import AdminShell from "@/app/admin/_components/AdminShell";
import {
  Store, ArrowLeft,
  User, Building2, Phone, Calendar, Globe, CheckCircle, Loader2, X,
} from "lucide-react";

const COUNTRIES = [
  "Nepal","India","China","United States","United Kingdom",
  "Australia","Canada","Germany","France","Japan",
];

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="er-field">
      <label className="er-label">{icon}{label}</label>
      <div className="er-input-wrap">
        <span className="er-input-icon">{icon}</span>
        {children}
      </div>
    </div>
  );
}

export default function EditRetailer() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, loading } = useUser(id, "retailer");
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        ownerName: user.ownerName ?? "",
        organizationName: user.organizationName ?? "",
        phoneNumber: user.phoneNumber ?? "",
        dateOfEstablishment: user.dateOfEstablishment ?? "",
        country: user.country ?? "",
      });
    }
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateRetailer(id, form);
      router.push(`/admin/retailers/${id}`);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="Edit Retailer" eyebrow="Retailers">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .er-back-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 14px; border-radius: 10px;
          background: transparent; border: 1px solid #E8E4DC;
          font-size: 13px; font-weight: 500; color: #7A6A52;
          cursor: pointer; transition: all 0.18s ease; font-family: inherit;
        }
        .er-back-btn:hover { background: #F0EBE1; border-color: #D4C9B8; color: #1A1612; }

        .er-page-header {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .er-page-title-row { display: flex; align-items: center; gap: 12px; }
        .er-page-icon {
          width: 44px; height: 44px; border-radius: 14px;
          background: linear-gradient(135deg, #F0EBE1 0%, #E8E4DC 100%);
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(201,169,110,0.15);
        }
        .er-page-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em; margin: 0;
        }
        .er-page-subtitle { font-size: 13px; color: #9C8E7A; margin: 2px 0 0; }

        .er-divider {
          height: 1px; background: linear-gradient(90deg, #E8E4DC, transparent);
          margin: 4px 0;
        }

        /* Loading */
        .er-loading {
          display: flex; align-items: center; justify-content: center;
          padding: 64px 0; gap: 10px;
        }
        .er-loading-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #C9A96E;
          animation: er-pulse 1.2s ease-in-out infinite;
        }
        .er-loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .er-loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes er-pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }

        /* Card */
        .er-card {
          font-family: 'DM Sans', sans-serif;
          background: #FAFAF8; border: 1px solid #E8E4DC;
          border-radius: 22px; overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.07);
          max-width: 860px; width: 100%;
        }
        .er-card-header {
          padding: 24px 28px; border-bottom: 1px solid #E8E4DC;
          background: #F5F0E8;
        }
        .er-card-heading {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em; margin: 0;
        }

        /* Body & grid */
        .er-body { padding: 26px 28px; }
        .er-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

        /* Fields */
        .er-field { display: flex; flex-direction: column; gap: 6px; }
        .er-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.1em; color: #9C8E7A; font-weight: 500;
          display: flex; align-items: center; gap: 6px;
        }
        .er-input-wrap { position: relative; display: flex; align-items: center; }
        .er-input-icon {
          position: absolute; left: 12px; color: #B8A898;
          pointer-events: none; display: flex; align-items: center;
          transition: color 0.18s ease;
        }
        .er-input-wrap:focus-within .er-input-icon { color: #C9A96E; }
        .er-input, .er-select {
          width: 100%;
          padding: 11px 14px 11px 38px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          border-radius: 12px; border: 1px solid #E8E4DC;
          background: #FAFAF8; color: #1A1612; outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          appearance: none; -webkit-appearance: none;
          box-sizing: border-box;
        }
        .er-input::placeholder { color: #B8A898; }
        .er-input:focus, .er-select:focus {
          border-color: #C9A96E;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
        }
        .er-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='%239C8E7A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 14px;
          padding-right: 36px;
        }
        input[type="date"].er-input { cursor: pointer; }

        /* Footer */
        .er-footer {
          padding: 18px 28px; border-top: 1px solid #E8E4DC;
          background: #F5F0E8; display: flex; gap: 10px; align-items: center;
        }
        .er-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 12px; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; cursor: pointer;
          transition: all 0.18s ease; letter-spacing: 0.01em;
        }
        .er-btn:disabled { opacity: 0.5; cursor: wait; }
        .er-btn-primary { background: #1A1612; color: #FAFAF8; }
        .er-btn-primary:hover:not(:disabled) {
          background: #2A2420; transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(26,22,18,0.2);
        }
        .er-btn-cancel { background: #FAFAF8; color: #5A4C38; border: 1px solid #E8E4DC; }
        .er-btn-cancel:hover:not(:disabled) { background: #F0EBE1; }
        .er-spin { animation: erSpin 0.8s linear infinite; }
        @keyframes erSpin { to { transform: rotate(360deg); } }

        @media (max-width: 560px) { .er-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Page header */}
      <div className="er-page-header">
        <div className="er-page-title-row">
          <div className="er-page-icon"><Store size={20} /></div>
          <div>
            <h1 className="er-page-title">Edit Retailer</h1>
            <p className="er-page-subtitle">Update the details of this store</p>
          </div>
        </div>
        <button className="er-back-btn" onClick={() => router.back()}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="er-divider" />

      {/* Loading */}
      {(loading || !form) ? (
        <div className="er-loading">
          <div className="er-loading-dot" />
          <div className="er-loading-dot" />
          <div className="er-loading-dot" />
        </div>
      ) : (
        <div className="er-card">
          <div className="er-card-header">
            <h2 className="er-card-heading">Store Information</h2>
          </div>

          <form onSubmit={handleSave}>
            <div className="er-body">
              <div className="er-grid">

                <Field icon={<User size={14} />} label="Owner Name">
                  <input
                    className="er-input"
                    placeholder="Owner full name"
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                  />
                </Field>

                <Field icon={<Building2 size={14} />} label="Organization">
                  <input
                    className="er-input"
                    placeholder="Company Ltd."
                    value={form.organizationName}
                    onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                  />
                </Field>

                <Field icon={<Phone size={14} />} label="Phone">
                  <input
                    className="er-input"
                    placeholder="+977 9800000000"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  />
                </Field>

                <Field icon={<Calendar size={14} />} label="Date of Establishment">
                  <input
                    className="er-input"
                    type="date"
                    value={form.dateOfEstablishment}
                    onChange={(e) => setForm({ ...form, dateOfEstablishment: e.target.value })}
                  />
                </Field>

                <Field icon={<Globe size={14} />} label="Country">
                  <select
                    className="er-select"
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

            <div className="er-footer">
              <button type="submit" className="er-btn er-btn-primary" disabled={saving}>
                {saving ? <Loader2 size={14} className="er-spin" /> : <CheckCircle size={14} />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                className="er-btn er-btn-cancel"
                onClick={() => router.push(`/admin/retailers/${id}`)}
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