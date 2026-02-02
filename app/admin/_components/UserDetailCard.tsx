// admin/components/UserDetailCard.tsx
"use client";

import React from "react";
import ProfilePictureUploader from "./ProfilePictureUploader";
import { Edit2, Trash2, User, Phone, Globe, Users, Briefcase, Mail } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  user: Record<string, any>;
  onEdit: () => void;
  onDelete: () => void;
  onUploadPicture: (file: File, id?: string) => Promise<void>;
};

export default function UserDetailCard({
  user,
  onEdit,
  onDelete,
  onUploadPicture,
}: Props) {
  const uploadId = user.authId ?? user.auth_id ?? user.auth?.id ?? null;

  const handleFileSelected = async (file: File) => {
    if (!file) return;
    
    const uploadToast = toast.loading("Uploading profile picture...", {
      position: "top-right",
    });
    
    try {
      await onUploadPicture(file, user.authId ?? undefined);
      toast.update(uploadToast, {
        render: "Profile picture uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Upload failed", err);
      toast.update(uploadToast, {
        render: "Failed to upload profile picture",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleDelete = () => {
    const confirmToast = toast.warning(
      <div>
        <p style={{ marginBottom: 12, fontWeight: 600 }}>Are you sure you want to delete this user?</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              toast.dismiss(confirmToast);
              onDelete();
            }}
            style={{
              padding: "6px 16px",
              backgroundColor: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(confirmToast)}
            style={{
              padding: "6px 16px",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
      }
    );
  };

  const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | undefined }) => {
    if (!value) return null;
    
    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "12px 0",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <div
          style={{
            padding: 8,
            backgroundColor: "#f9fafb",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={18} strokeWidth={2} color="#6b7280" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 2, fontWeight: 500 }}>
            {label}
          </div>
          <div style={{ fontSize: 15, color: "#111827", fontWeight: 500 }}>
            {value}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          padding: "24px 28px",
          backgroundColor: "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <ProfilePictureUploader
            src={
              user.profilePicture
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL || "localhost:5050"}${user.profilePicture}`
                : null
            }
            onFileSelected={handleFileSelected}
          />
          <div style={{ flex: 1 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                color: "#111827",
                marginBottom: 4,
              }}
            >
              {user.fullName || user.organizationName || user.username || "User"}
            </h2>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                border: "1px solid #bfdbfe",
              }}
            >
              <User size={14} />
              <span>{user._role ?? user.role ?? "No Role"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div style={{ padding: "24px 28px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 0,
          }}
        >
          <InfoItem icon={User} label="Username" value={user.username} />
          <InfoItem icon={Mail} label="Email" value={user.email} />
          <InfoItem icon={User} label="Full Name" value={user.fullName} />
          <InfoItem icon={Phone} label="Phone Number" value={user.phoneNumber} />
          <InfoItem icon={Globe} label="Country" value={user.country} />
          <InfoItem icon={Users} label="Gender" value={user.gender} />
          <InfoItem icon={Briefcase} label="Organization" value={user.organizationName} />
        </div>
      </div>

      {/* Actions Section */}
      <div
        style={{
          padding: "20px 28px",
          backgroundColor: "#f9fafb",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: 12,
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={onEdit}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 8,
            backgroundColor: "#ffffff",
            color: "#374151",
            border: "1px solid #d1d5db",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9fafb";
            e.currentTarget.style.borderColor = "#9ca3af";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 2px 4px 0 rgba(0, 0, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.borderColor = "#d1d5db";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <Edit2 size={16} strokeWidth={2} />
          <span>Update</span>
        </button>
        <button
          onClick={handleDelete}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 8,
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            border: "1px solid #fecaca",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fecaca";
            e.currentTarget.style.borderColor = "#fca5a5";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 2px 4px 0 rgba(220, 38, 38, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fee2e2";
            e.currentTarget.style.borderColor = "#fecaca";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <Trash2 size={16} strokeWidth={2} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}