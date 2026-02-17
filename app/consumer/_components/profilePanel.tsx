// components/ProfilePanel.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import ProfilePictureUploader from "../../admin/_components/ProfilePictureUploader";
import { uploadProfilePicture } from "../../../lib/actions/consumer-actions";
import { Phone, Calendar, User, MapPin, Globe, Loader2, Camera } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

function resolveProfileImage(src?: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050").replace(/\/+$/, "");
  return `${base}/${src.replace(/^\/+/, "")}`;
}

export default function ProfilePanel({ consumer, onEditProfile }: Props) {
  const normalized: Consumer | null = (() => {
    if (!consumer) return null;
    if (typeof consumer === "object" && "success" in consumer && "data" in consumer) {
      return (consumer as { success: boolean; data: Consumer }).data ?? null;
    }
    return consumer as Consumer;
  })();

  const [profilePicture, setProfilePicture] = useState<string | null>(
    resolveProfileImage(normalized?.profilePicture ?? null)
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProfilePicture(resolveProfileImage(normalized?.profilePicture ?? null));
  }, [normalized?.profilePicture]);

  const handleFileSelected = useCallback(
    async (file: File) => {
      if (!normalized) return;
      setSaving(true);
      try {
        const res = await uploadProfilePicture(normalized.authId, file);
        let updatedUrl: string | null = null;

        if (res && typeof res === "object") {
          if ("success" in res && "data" in res) {
            updatedUrl = (res as any).data?.profilePicture ?? null;
          } else {
            updatedUrl = (res as any).profilePicture ?? (res as any).profilePictureUrl ?? null;
          }
        } else if (typeof res === "string") {
          updatedUrl = res;
        }

        if (updatedUrl) {
          setProfilePicture(resolveProfileImage(updatedUrl));
          toast.success("Profile picture updated!");
          return;
        }

        if (res && typeof res === "object" && (res as any)._id) {
          setProfilePicture(resolveProfileImage((res as any).profilePicture ?? null));
          toast.success("Profile picture updated!");
        }
      } catch (err) {
        console.error("Upload failed", err);
        toast.error("Failed to upload profile picture.");
      } finally {
        setSaving(false);
      }
    },
    [normalized]
  );

  const initials = normalized
    ? (normalized.fullName ?? normalized.username ?? "?")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n: string) => n[0].toUpperCase())
        .join("")
    : "?";

  const dobFormatted = normalized?.dob
    ? new Date(normalized.dob).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  if (!normalized) {
    return (
      <>
        <ToastContainer position="bottom-right" />
        <div className="pp-empty">No profile data available.</div>
        <style>{`.pp-empty { font-family:'DM Sans',sans-serif; color:#9C8E7A; text-align:center; padding:40px; }`}</style>
      </>
    );
  }

  const metaItems = [
    { icon: <Phone size={15} />, label: "Phone", value: normalized.phoneNumber },
    { icon: <Calendar size={15} />, label: "Date of Birth", value: dobFormatted },
    { icon: <User size={15} />, label: "Gender", value: normalized.gender },
    { icon: <MapPin size={15} />, label: "Country", value: normalized.country },
    { icon: <Globe size={15} />, label: "Website", value: normalized.website },
  ].filter((item) => item.value);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        toastStyle={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          borderRadius: 12,
          background: "#1A1612",
          color: "#FAFAF8",
          boxShadow: "0 8px 24px rgba(26,22,18,0.25)",
          border: "1px solid #2A2420",
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        .pp-panel {
          font-family: 'DM Sans', sans-serif;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.06);
        }

        /* Top banner */
        .pp-banner {
          height: 100px;
          background: linear-gradient(135deg, #2A2420 0%, #1A1612 50%, #3A2E24 100%);
          position: relative;
          overflow: hidden;
        }
        .pp-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(201,169,110,0.04) 20px,
            rgba(201,169,110,0.04) 40px
          );
        }
        .pp-banner-accent {
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,0.18) 0%, transparent 70%);
          top: -120px; right: -60px;
        }

        /* Avatar area */
        .pp-avatar-row {
          display: flex;
          align-items: flex-end;
          gap: 20px;
          padding: 0 28px;
          margin-top: -52px;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
          flex-wrap: wrap;
        }
        .pp-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .pp-avatar-ring {
          width: 104px; height: 104px;
          border-radius: 50%;
          border: 4px solid #FAFAF8;
          overflow: hidden;
          background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(26,22,18,0.15);
        }
        .pp-avatar-ring img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .pp-avatar-initials {
          font-size: 28px;
          font-weight: 600;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: -0.01em;
        }
        .pp-avatar-upload-btn {
          position: absolute;
          bottom: 2px; right: 2px;
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #1A1612;
          border: 2px solid #FAFAF8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A96E;
          transition: background 0.18s ease;
          overflow: hidden;
        }
        .pp-avatar-upload-btn:hover { background: #2A2420; }
        .pp-avatar-upload-btn input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
        }

        /* Saving indicator */
        .pp-saving-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          background: #F5F0E8;
          border: 1px solid #E8E4DC;
          border-radius: 30px;
          font-size: 12px;
          color: #7A6A52;
          font-weight: 500;
          align-self: center;
          margin-top: 8px;
        }
        .pp-spin { animation: ppSpin 0.8s linear infinite; }
        @keyframes ppSpin { to { transform: rotate(360deg) } }

        /* Name / username row */
        .pp-identity {
          padding: 0 28px 20px;
        }
        .pp-fullname {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          color: #1A1612;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 4px;
        }
        .pp-username {
          font-size: 14px;
          color: #9C8E7A;
          font-weight: 500;
        }
        .pp-bio {
          font-size: 14px;
          color: #5A4C38;
          line-height: 1.65;
          margin-top: 10px;
          font-style: italic;
        }

        /* Stats bar */
        .pp-stats-bar {
          display: flex;
          gap: 0;
          border-top: 1px solid #F0EBE1;
          border-bottom: 1px solid #F0EBE1;
          background: #F5F0E8;
        }
        .pp-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 12px;
          border-right: 1px solid #E8E4DC;
          gap: 2px;
        }
        .pp-stat:last-child { border-right: none; }
        .pp-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #1A1612;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .pp-stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9C8E7A;
          font-weight: 500;
        }

        /* Details grid */
        .pp-details {
          padding: 22px 28px 26px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .pp-details-heading {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9C8E7A;
          font-weight: 500;
        }
        .pp-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
        }
        .pp-meta-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: #F5F0E8;
          border: 1px solid #E8E4DC;
          border-radius: 12px;
          transition: box-shadow 0.18s ease;
        }
        .pp-meta-item:hover {
          box-shadow: 0 3px 10px rgba(26,22,18,0.06);
        }
        .pp-meta-icon {
          color: #C9A96E;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .pp-meta-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #B8A898;
          font-weight: 500;
        }
        .pp-meta-value {
          font-size: 13px;
          color: #1A1612;
          font-weight: 500;
          margin-top: 2px;
          word-break: break-word;
        }

        /* Empty details */
        .pp-no-details {
          font-size: 13px;
          color: #B8A898;
          font-style: italic;
        }

        @media (max-width: 600px) {
          .pp-avatar-row { padding: 0 16px; }
          .pp-identity { padding: 0 16px 16px; }
          .pp-details { padding: 18px 16px 22px; }
          .pp-fullname { font-size: 22px; }
          .pp-meta-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="pp-panel">
        {/* Banner */}
        <div className="pp-banner">
          <div className="pp-banner-accent" />
        </div>

        {/* Avatar + saving badge */}
        <div className="pp-avatar-row">
          <div className="pp-avatar-wrap">
            <div className="pp-avatar-ring">
              {profilePicture ? (
                <img src={profilePicture} alt={normalized.username} />
              ) : (
                <span className="pp-avatar-initials">{initials}</span>
              )}
            </div>
            {/* Upload trigger */}
            <label className="pp-avatar-upload-btn" title="Change photo">
              <Camera size={13} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelected(f);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          {saving && (
            <div className="pp-saving-badge">
              <Loader2 size={13} className="pp-spin" />
              Uploading…
            </div>
          )}
        </div>

        {/* Identity */}
        <div className="pp-identity">
          <div className="pp-fullname">{normalized.fullName}</div>
          <div className="pp-username">@{normalized.username}</div>
          {normalized.bio && <p className="pp-bio">"{normalized.bio}"</p>}
        </div>

      

        {/* Details */}
        <div className="pp-details">
          <div className="pp-details-heading">Profile Details</div>

          {metaItems.length > 0 ? (
            <div className="pp-meta-grid">
              {metaItems.map((item) => (
                <div key={item.label} className="pp-meta-item">
                  <div className="pp-meta-icon">{item.icon}</div>
                  <div>
                    <div className="pp-meta-label">{item.label}</div>
                    <div className="pp-meta-value">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pp-no-details">No additional details added yet.</div>
          )}
        </div>
      </div>
    </>
  );
}