// app/admin/retailers/[id]/page.tsx
"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/admin/_hooks/useUsers";
import { confirmAction } from "@/app/admin/_utils/confirm";
import { deleteRetailer,  uploadRetailerPicture, getRetailer } from "@/lib/api/admin";
import AdminSidebar from "@/app/admin/_components/AdminSideBar";
import UserDetailCard from "@/app/admin/_components/UserDetailCard";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function RetailerDetail() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, setUser, loading } = useUser(id, "retailer");

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!user) return <p style={{ padding: 24 }}>Not found</p>;

  async function handleDelete() {
    const ok = await confirmAction("Delete this retailer?");
    if (!ok) return;
    await deleteRetailer(id);
    router.push("/admin");
  }

  function handleEdit() {
    router.push(`/admin/retailers/${id}/edit`);
  }

  /**
   * Upload flow:
   * 1) Fetch the user by Mongo _id to obtain authId (if not already present)
   * 2) Call the upload endpoint that expects authId
   * 3) Update local state and refresh the route so server data revalidates
   */
  async function handleUpload(file: File) {
    if (!file) throw new Error("No file provided");

    try {
      // If user already has authId, use it; otherwise fetch the user by _id
      const authId = user.authId ?? user.auth_id ?? user.auth?.id ?? null;
      let resolvedAuthId = authId;

      if (!resolvedAuthId) {
        // fetch user by _id to get authId
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

      // Prefer the upload-by-auth helper if available
      // If your admin API helper exports uploadRetailerPictureByAuth, use it.
      // Fallback to uploadRetailerPicture(authId, file) if your endpoint expects authId in that helper.
      let uploadResult;
     
        uploadResult = await uploadRetailerPicture(resolvedAuthId, file);
   

      // Update local state with returned profile picture path (adjust keys as your API returns)
      setUser((prev: any) => ({
        ...prev,
        profilePicture: uploadResult.profilePicture ?? uploadResult.path ?? prev.profilePicture,
      }));

      // Revalidate server data (App Router) so server components / fetches refresh
      router.refresh();

      // Optional UX feedback
      // alert("Successfully uploaded profile picture");
    } catch (err: any) {
      console.error("Upload failed", err);
      // surface a simple alert or integrate your toast system
      alert(err?.message ?? "Upload failed");
    }
  }

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 24 }}>
        <h2>Retailer</h2>
        <UserDetailCard
          user={{ ...user, _role: "retailer" }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUploadPicture={handleUpload}
        />
      </main>
    </div>
  );
}
