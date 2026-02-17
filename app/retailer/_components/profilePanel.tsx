// src/app/retailer/_components/profilePanel.tsx
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { uploadRetailerLogo } from "@/lib/actions/retailer-actions";
import { Phone, Calendar, MapPin, Globe, User, Edit2, Loader2, Camera, Building2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

function resolveImg(src?: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050").replace(/\/+$/, "");
  return `${base}/${src.replace(/^\/+/, "")}`;
}

export default function RetailerProfilePanel({ retailer, onEditProfile }: Props) {
  const normalized: Retailer | null = (() => {
    if (!retailer) return null;
    if (typeof retailer === "object" && "success" in retailer && "data" in retailer)
      return (retailer as any).data ?? null;
    return retailer as Retailer;
  })();

  const [profilePicture, setProfilePicture] = useState<string | null>(resolveImg(normalized?.profilePicture));
  const [saving, setSaving] = useState(false);

  useEffect(() => { setProfilePicture(resolveImg(normalized?.profilePicture)); }, [normalized?.profilePicture]);

  const handleFileSelected = useCallback(async (file: File) => {
    if (!normalized) return;
    setSaving(true);
    try {
      const res = await uploadRetailerLogo(normalized.authId, file);
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5050").replace(/\/+$/, "");
      const updatedUrl =
        (res as any)?.data?.profilePicture ??
        (res as any)?.profilePicture ??
        (res as any)?.profilePictureUrl ??
        (typeof res === "string" ? res : null);

      if (updatedUrl) {
        setProfilePicture(resolveImg(updatedUrl));
        toast.success("Logo updated!");
      } else if ((res as any)?._id) {
        setProfilePicture(resolveImg((res as any).profilePicture));
        toast.success("Logo updated!");
      }
    } catch (err: any) {
      console.error("Upload failed", err);
      toast.error("Failed to upload logo.");
    } finally {
      setSaving(false);
    }
  }, [normalized]);

  if (!normalized) {
    return (
      <div style={{ fontFamily: "'DM Sans',sans-serif", color: "#9C8E7A", textAlign: "center", padding: 40 }}>
        No retailer profile data available.
      </div>
    );
  }

  const initials = normalized.organizationName
    .split(" ").filter(Boolean).slice(0, 2)
    .map((n) => n[0].toUpperCase()).join("");

  const dobFormatted = normalized.dateOfEstablishment
    ? new Date(normalized.dateOfEstablishment).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  const metaItems = [
    { icon: <User size={15} />,     label: "Owner",       value: normalized.ownerName },
    { icon: <Phone size={15} />,    label: "Phone",       value: normalized.phoneNumber },
    { icon: <Calendar size={15} />, label: "Established", value: dobFormatted },
    { icon: <MapPin size={15} />,   label: "Country",     value: normalized.country },
  ].filter((item) => item.value);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .rpp-panel {
          font-family: 'DM Sans', sans-serif;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.06);
        }
        .rpp-banner {
          height: 100px;
          background: linear-gradient(135deg, #1A1612 0%, #2A2420 50%, #3A2E24 100%);
          position: relative; overflow: hidden;
        }
        .rpp-banner::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            -45deg, transparent, transparent 20px,
            rgba(201,169,110,0.04) 20px, rgba(201,169,110,0.04) 40px
          );
        }
        .rpp-banner-accent {
          position: absolute;
          width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,0.16) 0%, transparent 70%);
          top: -130px; right: -40px;
        }

        .rpp-avatar-row {
          display: flex; align-items: flex-end; gap: 18px;
          padding: 0 28px; margin-top: -52px; margin-bottom: 18px;
          position: relative; z-index: 1;
        }
        .rpp-avatar-wrap { position: relative; flex-shrink: 0; }
        .rpp-avatar-ring {
          width: 104px; height: 104px; border-radius: 20px;
          border: 4px solid #FAFAF8;
          overflow: hidden;
          background: linear-gradient(135deg, #C9A96E 0%, #8B6B3D 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(26,22,18,0.15);
        }
        .rpp-avatar-ring img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .rpp-avatar-initials { font-size: 28px; font-weight: 600; color: #fff; }
        .rpp-upload-btn {
          position: absolute; bottom: -2px; right: -2px;
          width: 30px; height: 30px; border-radius: 8px;
          background: #1A1612; border: 2px solid #FAFAF8;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: #C9A96E; transition: background 0.18s ease; overflow: hidden;
        }
        .rpp-upload-btn:hover { background: #2A2420; }
        .rpp-upload-btn input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .rpp-saving-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 14px; background: #F5F0E8;
          border: 1px solid #E8E4DC; border-radius: 30px;
          font-size: 12px; color: #7A6A52; font-weight: 500;
          align-self: flex-end; margin-bottom: 10px;
        }
        .rpp-spin { animation: rppSpin 0.8s linear infinite; }
        @keyframes rppSpin { to { transform: rotate(360deg) } }

        .rpp-identity { padding: 0 28px 20px; }
        .rpp-org-name {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700; color: #1A1612;
          letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 4px;
        }
        .rpp-username { font-size: 13px; color: #9C8E7A; font-weight: 500; }

        .rpp-header-actions {
          display: flex; gap: 8px;
          margin-top: 14px;
        }
        .rpp-edit-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 16px; border-radius: 12px;
          border: 1px solid #E8E4DC; background: #F5F0E8;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; color: #5A4C38;
          transition: all 0.18s ease;
        }
        .rpp-edit-btn:hover { background: #EDE8DC; }

        .rpp-stats-bar {
          display: flex; border-top: 1px solid #F0EBE1;
          border-bottom: 1px solid #F0EBE1; background: #F5F0E8;
        }
        .rpp-stat {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          padding: 16px 12px; border-right: 1px solid #E8E4DC; gap: 2px;
        }
        .rpp-stat:last-child { border-right: none; }
        .rpp-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700; color: #1A1612;
          letter-spacing: -0.02em; line-height: 1;
        }
        .rpp-stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9C8E7A; font-weight: 500; }

        .rpp-details { padding: 22px 28px 26px; display: flex; flex-direction: column; gap: 14px; }
        .rpp-details-heading { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #9C8E7A; font-weight: 500; }
        .rpp-meta-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
        .rpp-meta-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 14px;
          background: #F5F0E8; border: 1px solid #E8E4DC; border-radius: 12px;
          transition: box-shadow 0.18s ease;
        }
        .rpp-meta-item:hover { box-shadow: 0 3px 10px rgba(26,22,18,0.06); }
        .rpp-meta-icon { color: #C9A96E; flex-shrink: 0; margin-top: 1px; }
        .rpp-meta-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #B8A898; font-weight: 500; }
        .rpp-meta-value { font-size: 13px; color: #1A1612; font-weight: 500; margin-top: 2px; }

        @media (max-width: 600px) {
          .rpp-avatar-row { padding: 0 16px; }
          .rpp-identity { padding: 0 16px 16px; }
          .rpp-details { padding: 18px 16px 22px; }
          .rpp-meta-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rpp-panel">
        <div className="rpp-banner"><div className="rpp-banner-accent" /></div>

        <div className="rpp-avatar-row">
          <div className="rpp-avatar-wrap">
            <div className="rpp-avatar-ring">
              {profilePicture
                ? <img src={profilePicture} alt={normalized.organizationName} />
                : <span className="rpp-avatar-initials">{initials}</span>
              }
            </div>
            <label className="rpp-upload-btn" title="Change logo">
              <Camera size={13} />
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelected(f); e.target.value = ""; }} />
            </label>
          </div>
          {saving && (
            <div className="rpp-saving-badge">
              <Loader2 size={13} className="rpp-spin" /> Uploading…
            </div>
          )}
        </div>

        <div className="rpp-identity">
          <div className="rpp-org-name">{normalized.organizationName}</div>
          <div className="rpp-username">@{normalized.username}</div>
          {onEditProfile && (
            <div className="rpp-header-actions">
              <button className="rpp-edit-btn" onClick={onEditProfile}>
                <Edit2 size={13} /> Edit Profile
              </button>
            </div>
          )}
        </div>

  

        <div className="rpp-details">
          <div className="rpp-details-heading">Business Details</div>
          {metaItems.length > 0 ? (
            <div className="rpp-meta-grid">
              {metaItems.map((item) => (
                <div key={item.label} className="rpp-meta-item">
                  <div className="rpp-meta-icon">{item.icon}</div>
                  <div>
                    <div className="rpp-meta-label">{item.label}</div>
                    <div className="rpp-meta-value">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#B8A898", fontStyle: "italic" }}>No details added yet.</div>
          )}
        </div>
      </div>
    </>
  );
}