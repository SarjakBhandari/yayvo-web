// app/admin/retailers/[id]/page.tsx
"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/admin/_hooks/useUsers";
import { confirmAction } from "@/app/admin/_utils/confirm";
import { deleteRetailer, uploadRetailerPicture } from "@/lib/api/admin";
import AdminShell from "@/app/admin/_components/AdminShell";
import UserDetailCard from "@/app/admin/_components/UserDetailCard";
import { Store, ArrowLeft } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function RetailerDetail() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, setUser, loading } = useUser(id, "retailer");

  async function handleDelete() {
    const ok = await confirmAction("Delete this retailer?");
    if (!ok) return;
    await deleteRetailer(id);
    router.push("/admin");
  }

  async function handleUpload(file: File) {
    if (!file) throw new Error("No file provided");
    try {
      const authId = user.authId ?? user.auth_id ?? user.auth?.id ?? null;
      let resolvedAuthId = authId;

      if (!resolvedAuthId) {
        const res = await fetch(`${BASE_URL}/admin/users/${encodeURIComponent(id)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch user: ${res.status} ${text}`);
        }
        const fetched = await res.json();
        resolvedAuthId = fetched.authId ?? fetched.auth_id ?? fetched.auth?.id;
        if (!resolvedAuthId) throw new Error("authId not found on user");
      }

      const uploadResult = await uploadRetailerPicture(resolvedAuthId, file);
      setUser((prev: any) => ({
        ...prev,
        profilePicture: uploadResult.profilePicture ?? uploadResult.path ?? prev.profilePicture,
      }));
      router.refresh();
    } catch (err: any) {
      console.error("Upload failed", err);
      alert(err?.message ?? "Upload failed");
    }
  }

  return (
    <AdminShell title="Retailer Detail" eyebrow="Retailers">
      <style>{`
        .rd-back-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 14px; border-radius: 10px;
          background: transparent; border: 1px solid #E8E4DC;
          font-size: 13px; font-weight: 500; color: #7A6A52;
          cursor: pointer; transition: all 0.18s ease; font-family: inherit;
        }
        .rd-back-btn:hover { background: #F0EBE1; border-color: #D4C9B8; color: #1A1612; }

        .rd-page-header {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .rd-page-title-row { display: flex; align-items: center; gap: 12px; }
        .rd-page-icon {
          width: 44px; height: 44px; border-radius: 14px;
          background: linear-gradient(135deg, #F0EBE1 0%, #E8E4DC 100%);
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(201,169,110,0.15);
        }
        .rd-page-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em; margin: 0;
        }
        .rd-page-subtitle { font-size: 13px; color: #9C8E7A; margin: 2px 0 0; }

        .rd-divider {
          height: 1px; background: linear-gradient(90deg, #E8E4DC, transparent);
          margin: 4px 0;
        }

        /* Loading */
        .rd-loading {
          display: flex; align-items: center; justify-content: center;
          padding: 64px 0; gap: 10px;
        }
        .rd-loading-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #C9A96E;
          animation: rd-pulse 1.2s ease-in-out infinite;
        }
        .rd-loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .rd-loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes rd-pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }

        /* Not found */
        .rd-not-found {
          display: flex; align-items: center; justify-content: center;
          padding: 64px 0; font-size: 14px; color: #9C8E7A;
        }
      `}</style>

      {/* Page header */}
      <div className="rd-page-header">
        <div className="rd-page-title-row">
          <div className="rd-page-icon"><Store size={20} /></div>
          <div>
            <h1 className="rd-page-title">Retailer Detail</h1>
            <p className="rd-page-subtitle">View and manage this store's account</p>
          </div>
        </div>
        <button className="rd-back-btn" onClick={() => router.push("/admin")}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="rd-divider" />

      {/* States */}
      {loading ? (
        <div className="rd-loading">
          <div className="rd-loading-dot" />
          <div className="rd-loading-dot" />
          <div className="rd-loading-dot" />
        </div>
      ) : !user ? (
        <div className="rd-not-found">Retailer not found.</div>
      ) : (
        <UserDetailCard
          user={{ ...user, _role: "retailer" }}
          onEdit={() => router.push(`/admin/retailers/${id}/edit`)}
          onDelete={handleDelete}
          onUploadPicture={handleUpload}
        />
      )}
    </AdminShell>
  );
}