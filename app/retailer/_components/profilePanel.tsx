// components/RetailerProfilePanel.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import ProfilePictureUploader from "../../admin/_components/ProfilePictureUploader";
import { uploadRetailerLogo } from "@/lib/actions/retailer-actions";

type Retailer = {
  _id: string;
  authId: string;
  ownerName: string;
  organizationName: string;
  username: string;
  phoneNumber?: string;
  dateOfEstablishment?: string;
  country?: string;
  profilePicture?: string | null;
};

type Props = {
  retailer: Retailer | { success: boolean; data: Retailer } | null;
  onEditProfile?: () => void;
};

export default function RetailerProfilePanel({ retailer, onEditProfile }: Props) {
  // normalize incoming prop (support wrapper { success, data } or direct retailer)
  const normalized: Retailer | null = (() => {
    if (!retailer) return null;
    if (typeof retailer === "object" && "success" in retailer && "data" in retailer) {
      // @ts-ignore
      return (retailer as { success: boolean; data: Retailer }).data ?? null;
    }
    return retailer as Retailer;
  })();
console.log("profilePicture:"+normalized?.profilePicture);
  const [profilePicture, setprofilePicture] = useState<string | null>(
    normalized?.profilePicture && (normalized.profilePicture.startsWith("http://") || normalized.profilePicture.startsWith("https://"))
      ? normalized.profilePicture
      : normalized?.profilePicture
      ? `${(process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050").replace(/\/+$/, "")}/${normalized.profilePicture.replace(/^\/+/, "")}`
      : null
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!normalized?.profilePicture) {
      setprofilePicture(null);
      return;
    }
    const src = normalized.profilePicture;
    if (src.startsWith("http://") || src.startsWith("https://")) {
      setprofilePicture(src);
    } else {
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050").replace(/\/+$/, "");
      setprofilePicture(`${base}/${src.replace(/^\/+/, "")}`);
    }
  }, [normalized?.profilePicture]);

  useEffect(() => {
    console.log("retailer (normalized):", normalized);
  }, [normalized]);

 const handleFileSelected = useCallback(
  async (file: File) => {
    if (!normalized) return;
    setSaving(true);

    // DEBUG: show what we will call
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050").replace(/\/+$/, "");
    const debugUrl = `${base}/api/retailers/${encodeURIComponent(normalized.authId)}/profilePicture`;
    console.log("DEBUG upload target (full URL):", debugUrl);

    try {
      // call the action wrapper (axios) you already use
      console.log("normalized :"+normalized.authId);
      const res = await uploadRetailerLogo(normalized.authId, file);

      console.log("DEBUG upload response (action):", res);

      const updatedUrl =
        (res && typeof res === "object" && "data" in res && res.data?.profilePicture) ||
        (res && typeof res === "object" && (res.profilePicture ?? res.profilePictureUrl)) ||
        (typeof res === "string" ? res : null);

      if (updatedUrl) {
        const final = updatedUrl.startsWith("http://") || updatedUrl.startsWith("https://")
          ? updatedUrl
          : `${base}/${updatedUrl.replace(/^\/+/, "")}`;
        setprofilePicture(final);
      } else if (res && typeof res === "object" && (res as any)._id) {
        const objprofilePicture = (res as any).profilePicture;
        if (objprofilePicture) {
          const final = objprofilePicture.startsWith("http://") || objprofilePicture.startsWith("https://")
            ? objprofilePicture
            : `${base}/${objprofilePicture.replace(/^\/+/, "")}`;
          setprofilePicture(final);
        }
      }
    } catch (err: any) {
      // show full error details
      console.error("Upload failed (component). Error object:", err);
      console.error("Upload failed (component). err.response:", err?.response);
      console.error("Upload failed (component). err.response?.status:", err?.response?.status);
      console.error("Upload failed (component). err.response?.data:", err?.response?.data);
      alert("Failed to upload profilePicture. See console for details.");
    } finally {
      setSaving(false);
    }
  },
  [normalized]
);


  if (!normalized) {
    return (
      <section className="profile-panel">
        <div className="no-data">No retailer profile data available.</div>

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
          <ProfilePictureUploader src={profilePicture} onFileSelected={handleFileSelected} size={160} alt={normalized.organizationName} />
        </div>

        <div className="profile-info">
          <div className="profile-top">
            <h1 className="username">{normalized.organizationName}</h1>
            <button onClick={() => onEditProfile?.()} className="edit-btn" aria-label="Edit profile">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11.5 2.5L13.5 4.5M1 15L3.5 14.5L13.5 4.5C14 4 14 3 13.5 2.5L13 2C12.5 1.5 11.5 1.5 11 2L1 12L1 15Z" />
              </svg>
              Edit Profile
            </button>
          </div>          
          <div className="profile-details">
            <h2 className="full-name">Owner: {normalized.ownerName}</h2>

            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-label">Username</div>
                <div className="detail-value">{normalized.username}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Phone</div>
                <div className="detail-value">{normalized.phoneNumber || "Not set"}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Established</div>
                <div className="detail-value">
                  {normalized.dateOfEstablishment ? new Date(normalized.dateOfEstablishment).toLocaleDateString() : "Not set"}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Country</div>
                <div className="detail-value">{normalized.country || "Not set"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {saving && (
        <div className="upload-status">
          <div className="spinner"></div>
          <span>Uploading profilePicture...</span>
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
          padding: 12px;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          background: #fff;
        }

        .detail-label {
          font-size: 12px;
          font-weight: 600;
          color: #8e8e8e;
          text-transform: uppercase;
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
