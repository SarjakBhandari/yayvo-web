// app/admin/retailers/create/page.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Store, ArrowLeft } from "lucide-react";
import AdminShell from "../../_components/AdminShell";
import CreateUserForm from "../../_components/CreateUserForm";

export default function CreateRetailerPage() {
  const router = useRouter();

  return (
    <AdminShell title="Create Retailer" eyebrow="Retailers">
      <style>{`
        .cr-back-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 14px; border-radius: 10px;
          background: transparent; border: 1px solid #E8E4DC;
          font-size: 13px; font-weight: 500; color: #7A6A52;
          cursor: pointer; transition: all 0.18s ease;
          font-family: inherit;
        }
        .cr-back-btn:hover {
          background: #F0EBE1; border-color: #D4C9B8; color: #1A1612;
        }

        .cr-page-header {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .cr-page-title-row {
          display: flex; align-items: center; gap: 12px;
        }
        .cr-page-icon {
          width: 44px; height: 44px; border-radius: 14px;
          background: linear-gradient(135deg, #F0EBE1 0%, #E8E4DC 100%);
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(201,169,110,0.15);
        }
        .cr-page-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em;
          margin: 0;
        }
        .cr-page-subtitle {
          font-size: 13px; color: #9C8E7A; margin: 2px 0 0;
        }

        .cr-divider {
          height: 1px; background: linear-gradient(90deg, #E8E4DC, transparent);
          margin: 4px 0;
        }

        .cr-form-card {
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 24px rgba(26,22,18,0.05);
        }

        .cr-form-card-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 24px;
        }
        .cr-form-card-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.12em; color: #9C8E7A; font-weight: 600;
        }
        .cr-form-card-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #C9A96E; flex-shrink: 0;
        }
      `}</style>

      {/* Page header */}
      <div className="cr-page-header">
        <div className="cr-page-title-row">
          <div className="cr-page-icon">
            <Store size={20} />
          </div>
          <div>
            <h1 className="cr-page-title">New Retailer</h1>
            <p className="cr-page-subtitle">Fill in the details to register a new store</p>
          </div>
        </div>
        <button className="cr-back-btn" onClick={() => router.back()}>
          <ArrowLeft size={14} />
          Back
        </button>
      </div>

      <div className="cr-divider" />

      {/* Form card */}
      <div className="cr-form-card">
        <div className="cr-form-card-header">
          <div className="cr-form-card-dot" />
          <span className="cr-form-card-label">Store information</span>
        </div>
        <CreateUserForm initialType="retailer" />
      </div>
    </AdminShell>
  );
}