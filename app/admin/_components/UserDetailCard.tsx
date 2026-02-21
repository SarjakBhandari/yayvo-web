// admin/components/UserDetailCard.tsx
"use client";

import React, { useState } from "react";
import ProfilePictureUploader from "./ProfilePictureUploader";
import {
  Edit2, Trash2, User, Phone, Globe, Users,
  Briefcase, Mail, AlertTriangle, X, Check,
} from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  user: Record<string, any>;
  onEdit: () => void;
  onDelete: () => void;
  onUploadPicture: (file: File, id?: string) => Promise<void>;
};

export default function UserDetailCard({ user, onEdit, onDelete, onUploadPicture }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const name = user.fullName ?? user.organizationName ?? user.username ?? "User";
  const role = user._role ?? user.role ?? "User";
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((n: string) => n[0].toUpperCase()).join("");

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050";
  const avatarSrc = user.profilePicture ? `${BASE_URL}${user.profilePicture}` : null;

  async function handleFileSelected(file: File) {
    const id = toast.loading("Uploading photo…");
    try {
      await onUploadPicture(file, user.authId ?? undefined);
      toast.update(id, { render: "Photo updated!", type: "success", isLoading: false, autoClose: 3000 });
    } catch {
      toast.update(id, { render: "Upload failed", type: "error", isLoading: false, autoClose: 3000 });
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await onDelete();
      toast.success("User deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  const INFO_ROWS: { icon: any; label: string; value?: string }[] = [
    { icon: User,     label: "Username",     value: user.username },
    { icon: Mail,     label: "Email",        value: user.email },
    { icon: User,     label: "Full Name",    value: user.fullName },
    { icon: Phone,    label: "Phone",        value: user.phoneNumber },
    { icon: Globe,    label: "Country",      value: user.country },
    { icon: Users,    label: "Gender",       value: user.gender },
    { icon: Briefcase,label: "Organization", value: user.organizationName },
  ].filter((r) => !!r.value);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .udc-card {
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.07);
          font-family: 'DM Sans', sans-serif;
          max-width: 820px;
          width: 100%;
        }

        /* ── Banner ── */
        .udc-banner {
          height: 88px;
          background: linear-gradient(160deg, #1A1612 0%, #2A2420 60%, #3A2E24 100%);
          position: relative; overflow: hidden;
        }
        .udc-banner::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            -45deg, transparent, transparent 18px,
            rgba(201,169,110,0.05) 18px, rgba(201,169,110,0.05) 36px
          );
        }
        .udc-banner-glow {
          position: absolute; bottom: -40px; right: -30px;
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,0.2) 0%, transparent 70%);
        }

        /* ── Header ── */
        .udc-header {
          padding: 0 28px 24px;
          border-bottom: 1px solid #E8E4DC;
          position: relative;
        }
        .udc-avatar-row {
          display: flex; align-items: flex-end;
          gap: 18px; margin-top: -44px;
          position: relative; z-index: 1;
        }
        .udc-avatar-wrap {
          flex-shrink: 0;
          border-radius: 18px;
          border: 4px solid #FAFAF8;
          overflow: visible;
          background: #FAFAF8;
          box-shadow: 0 4px 16px rgba(26,22,18,0.14);
        }
        .udc-identity { padding-top: 48px; flex: 1; min-width: 0; }
        .udc-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em;
          margin: 0 0 8px; line-height: 1.15;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .udc-role-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 30px;
          background: #F0EBE1; border: 1px solid #E8E4DC;
          font-size: 11px; font-weight: 600; color: #7A6A52;
          text-transform: capitalize; letter-spacing: 0.04em;
        }

        /* ── Details ── */
        .udc-body { padding: 22px 28px; }
        .udc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 0;
        }
        .udc-info-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 13px 0;
          border-bottom: 1px solid #F0EBE1;
        }
        .udc-info-row:last-child { border-bottom: none; }
        .udc-info-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: #F0EBE1; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E;
        }
        .udc-info-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.1em; color: #9C8E7A;
          font-weight: 500; margin-bottom: 3px;
        }
        .udc-info-value { font-size: 14px; color: #1A1612; font-weight: 500; }

        .udc-empty-info {
          padding: 28px 0; text-align: center;
          font-size: 13px; color: #B8A898;
        }

        /* ── Footer actions ── */
        .udc-footer {
          padding: 18px 28px; border-top: 1px solid #E8E4DC;
          background: #F5F0E8;
          display: flex; gap: 10px; justify-content: flex-end;
          align-items: center;
        }
        .udc-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 12px; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.18s ease; letter-spacing: 0.01em;
        }
        .udc-btn-edit {
          background: #FAFAF8; color: #5A4C38;
          border: 1px solid #E8E4DC;
        }
        .udc-btn-edit:hover {
          background: #1A1612; color: #FAFAF8;
          border-color: #1A1612; transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(26,22,18,0.18);
        }
        .udc-btn-delete {
          background: #FFF1F1; color: #C0392B;
          border: 1px solid #FFDDD0;
        }
        .udc-btn-delete:hover {
          background: #C0392B; color: #fff;
          border-color: #C0392B; transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(192,57,43,0.22);
        }

        /* ── Delete confirm panel ── */
        .udc-confirm {
          margin: 0 28px 20px;
          background: #FFF1F1; border: 1px solid #FFDDD0;
          border-radius: 14px; padding: 16px 18px;
          display: flex; align-items: flex-start; gap: 14px;
          animation: udcSlideIn 0.2s ease;
        }
        @keyframes udcSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .udc-confirm-icon { color: #C0392B; flex-shrink: 0; margin-top: 1px; }
        .udc-confirm-title {
          font-size: 14px; font-weight: 600; color: #1A1612;
          margin-bottom: 4px;
        }
        .udc-confirm-sub { font-size: 13px; color: #7A6A52; }
        .udc-confirm-actions { display: flex; gap: 8px; margin-top: 12px; }
        .udc-confirm-del {
          padding: 8px 16px; border-radius: 10px; border: none;
          background: #C0392B; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 6px;
          transition: background 0.18s ease;
        }
        .udc-confirm-del:hover { background: #A93226; }
        .udc-confirm-del:disabled { opacity: 0.6; cursor: wait; }
        .udc-confirm-cancel {
          padding: 8px 16px; border-radius: 10px;
          background: #FAFAF8; color: #5A4C38;
          border: 1px solid #E8E4DC;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 6px;
          transition: all 0.18s ease;
        }
        .udc-confirm-cancel:hover { background: #F0EBE1; }

        @media (max-width: 600px) {
          .udc-avatar-row { flex-direction: column; align-items: flex-start; }
          .udc-identity { padding-top: 8px; }
          .udc-footer { justify-content: stretch; }
          .udc-btn { flex: 1; justify-content: center; }
        }
      `}</style>

      <div className="udc-card">
        {/* Banner */}
        <div className="udc-banner">
          <div className="udc-banner-glow" />
        </div>

        {/* Header */}
        <div className="udc-header">
          <div className="udc-avatar-row">
            <div className="udc-avatar-wrap">
              <ProfilePictureUploader
                src={avatarSrc}
                onFileSelected={handleFileSelected}
                size={88}
                alt={name}
              />
            </div>
            <div className="udc-identity">
              <h2 className="udc-name">{name}</h2>
              <span className="udc-role-badge">
                <User size={11} />
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="udc-body">
          {INFO_ROWS.length === 0 ? (
            <div className="udc-empty-info">No details available</div>
          ) : (
            <div className="udc-grid">
              {INFO_ROWS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="udc-info-row">
                  <div className="udc-info-icon"><Icon size={16} /></div>
                  <div>
                    <div className="udc-info-label">{label}</div>
                    <div className="udc-info-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="udc-confirm">
            <AlertTriangle size={18} className="udc-confirm-icon" />
            <div>
              <div className="udc-confirm-title">Delete this user?</div>
              <div className="udc-confirm-sub">This action cannot be undone. All their data will be permanently removed.</div>
              <div className="udc-confirm-actions">
                <button className="udc-confirm-del" onClick={confirmDelete} disabled={deleting}>
                  <Trash2 size={13} />
                  {deleting ? "Deleting…" : "Yes, delete"}
                </button>
                <button className="udc-confirm-cancel" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                  <X size={13} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="udc-footer">
          <button className="udc-btn udc-btn-edit" onClick={onEdit}>
            <Edit2 size={14} /> Update
          </button>
          <button className="udc-btn udc-btn-delete" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </>
  );
}