// components/ProfilePanel.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import ProfilePictureUploader from "../../admin/_components/ProfilePictureUploader";
import { uploadProfilePicture } from "../../../lib/actions/consumer-actions";

type Consumer = {
  _id: string;
  authId: string;
  fullName: string;
  username: string;
  phoneNumber?: string;
  dob?: string;
  gender?: string;
  country?: string;
  profilePicture?: string | null;
  bio?: string | null;
  website?: string | null;
};

type Props = {
  consumer: Consumer | { success: boolean; data: Consumer } | null;
  onEditProfile?: () => void;
};

function resolveProfileImage(src?: string | null) {
  if (!src) return null;
  // If already absolute URL, return as-is
  if (src.startsWith("http://") || src.startsWith("https://")) return src;

  // Otherwise prepend base URL (ensure it includes protocol in env)
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050";
  const cleanBase = base.replace(/\/+$/, "");
  const cleanSrc = src.replace(/^\/+/, "");
  return `${cleanBase}/${cleanSrc}`;
}

export default function ProfilePanel({ consumer, onEditProfile }: Props) {
  // normalize incoming prop (support wrapper { success, data } or direct consumer)
  const normalized: Consumer | null = (() => {
    if (!consumer) return null;
    if (typeof consumer === "object" && "success" in consumer && "data" in consumer) {
      // @ts-ignore
      return (consumer as { success: boolean; data: Consumer }).data ?? null;
    }
    return consumer as Consumer;
  })();

  // keep only profilePicture in local state so we don't duplicate the whole consumer object
  const [profilePicture, setProfilePicture] = useState<string | null>(
    resolveProfileImage(normalized?.profilePicture ?? null)
  );
  const [saving, setSaving] = useState(false);

  // sync when parent consumer prop changes
  useEffect(() => {
    setProfilePicture(resolveProfileImage(normalized?.profilePicture ?? null));
  }, [normalized?.profilePicture]);

  // log normalized consumer for debugging (prints actual data object)
  useEffect(() => {
    console.log("consumer (normalized):", normalized);
  }, [normalized]);

  const handleFileSelected = useCallback(
    async (file: File) => {
      if (!normalized) return;
      setSaving(true);
      try {
        const res = await uploadProfilePicture(normalized.authId, file);

        // Determine returned profile picture URL or updated consumer object
        let updatedUrl: string | null = null;

        if (res && typeof res === "object") {
          if ("success" in res && "data" in res) {
            // @ts-ignore
            updatedUrl = res.data?.profilePicture ?? null;
          } else {
            // @ts-ignore
            updatedUrl = res.profilePicture ?? res.profilePictureUrl ?? null;
          }
        } else if (typeof res === "string") {
          updatedUrl = res;
        }

        // If we got a URL, use it exactly as returned (resolve to absolute if needed)
        if (updatedUrl) {
          setProfilePicture(resolveProfileImage(updatedUrl));
          return;
        }

        // If API returned a full consumer object, merge by reading its profilePicture
        if (res && typeof res === "object" && (res as any)._id) {
          // @ts-ignore
          setProfilePicture(resolveProfileImage((res as any).profilePicture ?? null));
        }
      } catch (err) {
        console.error("Upload failed", err);
        alert("Failed to upload profile picture");
      } finally {
        setSaving(false);
      }
    },
    [normalized]
  );

  if (!normalized) {
    return (
      <section className="profile-panel">
        <div className="no-data">No profile data available.</div>

        <style jsx>{`
          .profile-panel {
            max-width: 940px;
            margin: 0 auto;
            padding: 32px 24px;
            background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
            border-radius: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }
          .no-data {
            color: #6b7280;
            text-align: center;
            padding: 24px;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="profile-panel">
      <div className="profile-header">
        <div className="profile-picture-section">
          <ProfilePictureUploader
            src={profilePicture}
            onFileSelected={handleFileSelected}
            size={160}
            alt={normalized.username}
          />
        </div>

        <div className="profile-info">
          <div className="profile-top">
            <h1 className="username">{normalized.username}</h1>
            <button onClick={() => onEditProfile?.()} className="edit-btn" aria-label="Edit profile">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11.5 2.5L13.5 4.5M1 15L3.5 14.5L13.5 4.5C14 4 14 3 13.5 2.5L13 2C12.5 1.5 11.5 1.5 11 2L1 12L1 15Z" />
              </svg>
              Edit Profile
            </button>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">posts</span>
            </div>

            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">followers</span>
            </div>

            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">following</span>
            </div>
          </div>

          <div className="profile-details">
            <h2 className="full-name">{normalized.fullName}</h2>

            <div className="details-grid">
              <div className="detail-item">
                <svg className="detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <div>
                  <div className="detail-label">Phone</div>
                  <div className="detail-value">{normalized.phoneNumber || "Not set"}</div>
                </div>
              </div>

              <div className="detail-item">
                <svg className="detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div>
                  <div className="detail-label">Date of Birth</div>
                  <div className="detail-value">{normalized.dob ? new Date(normalized.dob).toLocaleDateString() : "Not set"}</div>
                </div>
              </div>

              <div className="detail-item">
                <svg className="detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <div>
                  <div className="detail-label">Gender</div>
                  <div className="detail-value">{normalized.gender || "Not set"}</div>
                </div>
              </div>

              <div className="detail-item">
                <svg className="detail-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <div className="detail-label">Country</div>
                  <div className="detail-value">{normalized.country || "Not set"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {saving && (
        <div className="upload-status">
          <div className="spinner" />
          <span>Uploading picture...</span>
        </div>
      )}

      <style jsx>{`
        .profile-panel {
          max-width: 940px;
          margin: 0 auto;
          padding: 32px 24px;
          background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .profile-header {
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }

        .profile-picture-section {
          flex-shrink: 0;
        }

        .profile-info {
          flex: 1;
          min-width: 0;
        }

        .profile-top {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .username {
          font-size: 28px;
          font-weight: 300;
          margin: 0;
          color: #1a1a1a;
          letter-spacing: -0.5px;
        }

        .edit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #ffffff;
          border: 1px solid #dbdbdb;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          color: #262626;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-btn:hover {
          background: #fafafa;
          border-color: #a8a8a8;
        }

        .profile-stats {
          display: flex;
          gap: 32px;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #efefef;
        }

        .stat-item {
          display: flex;
          gap: 6px;
          align-items: baseline;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #262626;
        }

        .stat-label {
          font-size: 16px;
          color: #737373;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .full-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          color: #262626;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }

        .detail-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 12px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #f0f0f0;
          transition: all 0.2s ease;
        }

        .detail-item:hover {
          border-color: #e0e0e0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .detail-icon {
          flex-shrink: 0;
          color: #8e8e8e;
          margin-top: 2px;
        }

        .detail-label {
          font-size: 12px;
          font-weight: 600;
          color: #8e8e8e;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .detail-value {
          font-size: 14px;
          color: #262626;
          font-weight: 500;
        }

        .upload-status {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
          padding: 12px 16px;
          background: #e3f2fd;
          border-radius: 8px;
          color: #1976d2;
          font-size: 14px;
          font-weight: 500;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #bbdefb;
          border-top-color: #1976d2;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .profile-panel {
            padding: 24px 16px;
          }

          .profile-header {
            flex-direction: column;
            gap: 24px;
            align-items: center;
            text-align: center;
          }

          .profile-info {
            width: 100%;
          }

          .profile-top {
            justify-content: center;
          }

          .profile-stats {
            justify-content: center;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
