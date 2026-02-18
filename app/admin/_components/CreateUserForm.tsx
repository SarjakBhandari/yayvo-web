// admin/components/CreateUserForm.tsx
"use client";

import React, { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { buildConsumerFormData, buildRetailerFormData } from "../_utils/formData";
import { createConsumer, createRetailer } from "@/lib/api/admin";
import {
  User, Building2, Mail, Lock, Phone, Calendar, Globe,
  Users, CheckCircle, X, Loader2, UserPlus, Store,
} from "lucide-react";
import { toast } from "react-toastify";

type Props = { initialType?: "consumer" | "retailer" };

const COUNTRIES = [
  "Nepal","India","China","United States","United Kingdom",
  "Australia","Canada","Germany","France","Japan",
];

export default function CreateUserForm({ initialType = "consumer" }: Props): JSX.Element {
  const router = useRouter();
  const [type, setType] = useState<"consumer" | "retailer">(initialType);
  const [loading, setLoading] = useState(false);

  const [consumer, setConsumer] = useState<any>({
    email: "", password: "", fullName: "", username: "",
    phoneNumber: "", dob: "", gender: "", country: "", profilePicture: null,
  });
  const [retailer, setRetailer] = useState<any>({
    email: "", password: "", ownerName: "", organizationName: "",
    username: "", phoneNumber: "", dateOfEstablishment: "", country: "", profilePicture: null,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const loadingId = toast.loading(`Creating ${type}…`);
    try {
      if (type === "consumer") await createConsumer(buildConsumerFormData(consumer));
      else await createRetailer(buildRetailerFormData(retailer));
      toast.update(loadingId, {
        render: `${type === "consumer" ? "Consumer" : "Retailer"} created!`,
        type: "success", isLoading: false, autoClose: 3000,
      });
      setTimeout(() => router.push("/admin"), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to create user";
      toast.update(loadingId, { render: msg, type: "error", isLoading: false, autoClose: 4000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .cuf-card {
          font-family: 'DM Sans', sans-serif;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.07);
          max-width: 860px;
          width: 100%;
        }

        /* Header */
        .cuf-header {
          padding: 24px 28px;
          border-bottom: 1px solid #E8E4DC;
          background: #F5F0E8;
          display: flex; flex-direction: column; gap: 18px;
        }
        .cuf-heading {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em; margin: 0;
        }

        /* Type selector */
        .cuf-type-row { display: flex; gap: 10px; }
        .cuf-type-btn {
          display: flex; align-items: center; gap: 9px;
          padding: 10px 18px; border-radius: 12px;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          transition: all 0.18s ease;
          border: 1.5px solid transparent;
          user-select: none;
        }
        .cuf-type-btn input[type=radio] { display: none; }
        .cuf-type-btn.inactive { background: #FAFAF8; border-color: #E8E4DC; color: #7A6A52; }
        .cuf-type-btn.inactive:hover { background: #F0EBE1; border-color: #D4C8B4; color: #1A1612; }
        .cuf-type-btn.active { background: #1A1612; border-color: #1A1612; color: #FAFAF8; }

        /* Body */
        .cuf-body { padding: 26px 28px; }
        .cuf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .cuf-field { display: flex; flex-direction: column; gap: 6px; }
        .cuf-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.1em; color: #9C8E7A; font-weight: 500;
          display: flex; align-items: center; gap: 6px;
        }
        .cuf-input-wrap { position: relative; display: flex; align-items: center; }
        .cuf-input-icon {
          position: absolute; left: 12px; color: #B8A898;
          pointer-events: none; display: flex; align-items: center;
          transition: color 0.18s ease;
        }
        .cuf-input-wrap:focus-within .cuf-input-icon { color: #C9A96E; }
        .cuf-input, .cuf-select {
          width: 100%;
          padding: 11px 14px 11px 38px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          border-radius: 12px; border: 1px solid #E8E4DC;
          background: #FAFAF8; color: #1A1612; outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          appearance: none; -webkit-appearance: none;
          box-sizing: border-box;
        }
        .cuf-input::placeholder { color: #B8A898; }
        .cuf-input:focus, .cuf-select:focus {
          border-color: #C9A96E;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
        }
        .cuf-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='%239C8E7A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 14px;
          padding-right: 36px;
        }
        input[type="date"].cuf-input { cursor: pointer; }

        /* Section label */
        .cuf-section { grid-column: 1 / -1; }
        .cuf-section-divider { height: 1px; background: #F0EBE1; margin: 2px 0; }
        .cuf-section-label {
          font-size: 10px; text-transform: uppercase;
          letter-spacing: 0.12em; color: #B8A898; font-weight: 500;
          margin-bottom: 2px;
        }

        /* Footer */
        .cuf-footer {
          padding: 18px 28px; border-top: 1px solid #E8E4DC;
          background: #F5F0E8;
          display: flex; gap: 10px; align-items: center;
        }
        .cuf-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 12px; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 600; cursor: pointer;
          transition: all 0.18s ease; letter-spacing: 0.01em;
        }
        .cuf-btn:disabled { opacity: 0.5; cursor: wait; }
        .cuf-btn-primary { background: #1A1612; color: #FAFAF8; }
        .cuf-btn-primary:hover:not(:disabled) {
          background: #2A2420; transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(26,22,18,0.2);
        }
        .cuf-btn-cancel { background: #FAFAF8; color: #5A4C38; border: 1px solid #E8E4DC; }
        .cuf-btn-cancel:hover:not(:disabled) { background: #F0EBE1; }
        .cuf-spin { animation: cufSpin 0.8s linear infinite; }
        @keyframes cufSpin { to { transform: rotate(360deg) } }

        @media (max-width: 560px) { .cuf-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="cuf-card">
        {/* Header */}
        <div className="cuf-header">
          <h2 className="cuf-heading">Create New User</h2>
          <div className="cuf-type-row">
            {(["consumer", "retailer"] as const).map((t) => (
              <label key={t} className={`cuf-type-btn ${type === t ? "active" : "inactive"}`}>
                <input type="radio" name="type" checked={type === t} onChange={() => setType(t)} />
                {t === "consumer" ? <User size={15} /> : <Store size={15} />}
                {t === "consumer" ? "Consumer" : "Retailer"}
              </label>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="cuf-body">
            <div className="cuf-grid">

              {/* ── Consumer fields ── */}
              {type === "consumer" && (<>
                <Field icon={<Mail size={14} />} label="Email *">
                  <input className="cuf-input" type="email" placeholder="you@example.com"
                    value={consumer.email} onChange={(e) => setConsumer({ ...consumer, email: e.target.value })} required />
                </Field>
                <Field icon={<Lock size={14} />} label="Password *">
                  <input className="cuf-input" type="password" placeholder="Min 8 characters"
                    value={consumer.password} onChange={(e) => setConsumer({ ...consumer, password: e.target.value })} required />
                </Field>
                <Field icon={<User size={14} />} label="Full Name *">
                  <input className="cuf-input" placeholder="Jane Doe"
                    value={consumer.fullName} onChange={(e) => setConsumer({ ...consumer, fullName: e.target.value })} required />
                </Field>
                <Field icon={<User size={14} />} label="Username *">
                  <input className="cuf-input" placeholder="janedoe"
                    value={consumer.username} onChange={(e) => setConsumer({ ...consumer, username: e.target.value })} required />
                </Field>
                <Field icon={<Phone size={14} />} label="Phone">
                  <input className="cuf-input" placeholder="+977 9800000000"
                    value={consumer.phoneNumber} onChange={(e) => setConsumer({ ...consumer, phoneNumber: e.target.value })} />
                </Field>
                <Field icon={<Calendar size={14} />} label="Date of Birth">
                  <input className="cuf-input" type="date"
                    value={consumer.dob} onChange={(e) => setConsumer({ ...consumer, dob: e.target.value })} />
                </Field>
                <Field icon={<Users size={14} />} label="Gender">
                  <select className="cuf-select"
                    value={consumer.gender} onChange={(e) => setConsumer({ ...consumer, gender: e.target.value })}>
                    <option value="">Select gender</option>
                    {["Male","Female","Other","Prefer not to say"].map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field icon={<Globe size={14} />} label="Country">
                  <select className="cuf-select"
                    value={consumer.country} onChange={(e) => setConsumer({ ...consumer, country: e.target.value })}>
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </>)}

              {/* ── Retailer fields ── */}
              {type === "retailer" && (<>
                <Field icon={<Mail size={14} />} label="Email *">
                  <input className="cuf-input" type="email" placeholder="you@business.com"
                    value={retailer.email} onChange={(e) => setRetailer({ ...retailer, email: e.target.value })} required />
                </Field>
                <Field icon={<Lock size={14} />} label="Password *">
                  <input className="cuf-input" type="password" placeholder="Min 8 characters"
                    value={retailer.password} onChange={(e) => setRetailer({ ...retailer, password: e.target.value })} required />
                </Field>
                <Field icon={<User size={14} />} label="Owner Name *">
                  <input className="cuf-input" placeholder="Owner full name"
                    value={retailer.ownerName} onChange={(e) => setRetailer({ ...retailer, ownerName: e.target.value })} required />
                </Field>
                <Field icon={<Building2 size={14} />} label="Organization *">
                  <input className="cuf-input" placeholder="Company Ltd."
                    value={retailer.organizationName} onChange={(e) => setRetailer({ ...retailer, organizationName: e.target.value })} required />
                </Field>
                <Field icon={<User size={14} />} label="Username *">
                  <input className="cuf-input" placeholder="@handle"
                    value={retailer.username} onChange={(e) => setRetailer({ ...retailer, username: e.target.value })} required />
                </Field>
                <Field icon={<Phone size={14} />} label="Phone">
                  <input className="cuf-input" placeholder="+977 9800000000"
                    value={retailer.phoneNumber} onChange={(e) => setRetailer({ ...retailer, phoneNumber: e.target.value })} />
                </Field>
                <Field icon={<Calendar size={14} />} label="Date of Establishment">
                  <input className="cuf-input" type="date"
                    value={retailer.dateOfEstablishment} onChange={(e) => setRetailer({ ...retailer, dateOfEstablishment: e.target.value })} />
                </Field>
                <Field icon={<Globe size={14} />} label="Country">
                  <select className="cuf-select"
                    value={retailer.country} onChange={(e) => setRetailer({ ...retailer, country: e.target.value })}>
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </>)}

            </div>
          </div>

          <div className="cuf-footer">
            <button type="submit" className="cuf-btn cuf-btn-primary" disabled={loading}>
              {loading ? <Loader2 size={14} className="cuf-spin" /> : <CheckCircle size={14} />}
              {loading ? "Creating…" : "Create User"}
            </button>
            <button type="button" className="cuf-btn cuf-btn-cancel" onClick={() => router.push("/admin")} disabled={loading}>
              <X size={14} /> Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

/** Reusable field wrapper */
function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="cuf-field">
      <label className="cuf-label">{icon}{label}</label>
      <div className="cuf-input-wrap">
        <span className="cuf-input-icon">{icon}</span>
        {children}
      </div>
    </div>
  );
}