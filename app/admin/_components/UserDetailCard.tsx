// admin/components/UserDetailCard.tsx
"use client";

import React from "react";
import ProfilePictureUploader from "./ProfilePictureUploader";
import axiosInstance from "@/lib/api/axios";
import axios from "axios";

type Props = {
  user: Record<string, any>;
  onEdit: () => void;
  onDelete: () => void;
  // now accept optional id so caller can decide which id to use
  onUploadPicture: (file: File, id?: string) => Promise<void>;
};

export default function UserDetailCard({
  user,
  onEdit,
  onDelete,
  onUploadPicture,
}: Props) {
  // If your user object uses a different field name for the auth id, replace `authId` below.
  const uploadId = user.authId ?? user.auth_id ?? user.auth?.id ?? null;

  // Wrap the uploader callback so we always pass the desired id
  const handleFileSelected = async (file: File) => {
    if (!file) return;
    try {
      // Pass the auth id explicitly to the page handler
      await onUploadPicture(file, user.authId ?? undefined);
    } catch (err) {
      // Optional: handle upload errors locally or rethrow for page-level handling
      console.error("Upload failed", err);
      throw err;
    }
  };

  return (
    <div style={{ padding: 24, border: "1px solid #f0f0f0", borderRadius: 8 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <ProfilePictureUploader
          src={user.profilePicture ? `${process.env.NEXT_PUBLIC_API_BASE_URL || "localhost:5050"}${user.profilePicture}` : null}
          onFileSelected={handleFileSelected}
        />
        <div>
          <p>
            <strong>Username:</strong> {user.username ?? "-"}
          </p>
          <p>
            <strong>Role:</strong> {user._role ?? user.role ?? "-"}
          </p>
          {user.fullName && (
            <p>
              <strong>Full name:</strong> {user.fullName}
            </p>
          )}
          {user.phoneNumber && (
            <p>
              <strong>Phone:</strong> {user.phoneNumber}
            </p>
          )}
          {user.country && (
            <p>
              <strong>Country:</strong> {user.country}
            </p>
          )}          
          {user.gender && (
            <p>
              <strong>Gender:</strong> {user.gender}
            </p>
          )}

          {user.organizationName && (
            <p>
              <strong>Organization:</strong> {user.organizationName}
            </p>
          )}
        </div>
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
        <button onClick={onEdit} style={{ padding: "8px 12px", borderRadius: 6 }}>
          Update
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            background: "#e53e3e",
            color: "#fff",
            border: "none",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
