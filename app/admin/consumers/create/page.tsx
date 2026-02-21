// app/admin/consumers/create/page.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { UserPlus, ArrowLeft } from "lucide-react";
import AdminShell from "../../_components/AdminShell";
import CreateUserForm from "../../_components/CreateUserForm";

export default function CreateConsumerPage() {
  const router = useRouter();

  return (
    <AdminShell title="Create Consumer" eyebrow="Consumers">
      <style>{`
        .cc-back-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 14px; border-radius: 10px;
          background: transparent; border: 1px solid #E8E4DC;
          font-size: 13px; font-weight: 500; color: #7A6A52;
          cursor: pointer; transition: all 0.18s ease;
          font-family: inherit;
        }
        .cc-back-btn:hover {
          background: #F0EBE1; border-color: #D4C9B8; color: #1A1612;
        }

        .cc-page-header {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .cc-page-title-row {
          display: flex; align-items: center; gap: 12px;
        }
        .cc-page-icon {
          width: 44px; height: 44px; border-radius: 14px;
          background: linear-gradient(135deg, #F0EBE1 0%, #E8E4DC 100%);
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(201,169,110,0.15);
        }
        .cc-page-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em;
          margin: 0;
        }
        .cc-page-subtitle {
          font-size: 13px; color: #9C8E7A; margin: 2px 0 0;
        }

        .cc-divider {
          height: 1px; background: linear-gradient(90deg, #E8E4DC, transparent);
          margin: 4px 0;
        }

        .cc-form-card {
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 24px rgba(26,22,18,0.05);
        }

        .cc-form-card-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 24px;
        }
        .cc-form-card-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.12em; color: #9C8E7A; font-weight: 600;
        }
        .cc-form-card-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #C9A96E; flex-shrink: 0;
        }
      `}</style>

      {/* Page header */}
      <div className="cc-page-header">
        <div className="cc-page-title-row">
          <div className="cc-page-icon">
            <UserPlus size={20} />
          </div>
          <div>
            <h1 className="cc-page-title">New Consumer</h1>
            <p className="cc-page-subtitle">Fill in the details to register a new account</p>
          </div>
        </div>
        <button className="cc-back-btn" onClick={() => router.back()}>
          <ArrowLeft size={14} />
          Back
        </button>
      </div>

      <div className="cc-divider" />

      {/* Form card */}
      <div className="cc-form-card">
        <div className="cc-form-card-header">
          <div className="cc-form-card-dot" />
          <span className="cc-form-card-label">Account information</span>
        </div>
        <CreateUserForm initialType="consumer" />
      </div>
    </AdminShell>
  );
}