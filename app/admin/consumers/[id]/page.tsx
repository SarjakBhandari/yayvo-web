// app/admin/consumers/[id]/page.tsx
"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/admin/_hooks/useUsers";
import { deleteConsumer, uploadConsumerPicture } from "@/lib/api/admin";
import AdminSidebar from "@/app/admin/_components/AdminSideBar";
import UserDetailCard from "@/app/admin/_components/UserDetailCard";

export default function ConsumerDetail() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, setUser, loading } = useUser(id, "consumer");

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!user) return <p style={{ padding: 24 }}>Not found</p>;

  async function handleDelete() {
    await deleteConsumer(user.authId);
    router.push("/admin");
  }

  function handleEdit() {
    router.push(`/admin/consumers/${id}/edit`);
  }

  async function handleUpload(file: File) {
    const res = await uploadConsumerPicture(user.authId, file);
    const newProfile = res.profilePicture ?? res.path ?? res.profilePictureUrl;
    setUser((prev: any) => ({ ...prev, profilePicture: newProfile }));
    alert("Successfully uploaded profile picture");
    router.push(`/admin/`);
  }

  return (
    <>
      <style>{`
        .admin-root {
          height: 100vh;
          display: flex;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .admin-sidebar-col {
          position: relative;
          z-index: 1;
          flex: 0 0 260px;
          display: flex;
          flex-direction: column;
          padding: 28px 0 28px 28px;
        }

        .admin-sidebar-panel {
          flex: 1;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(26,22,18,0.05);
          display: flex;
          flex-direction: column;
        }

        .admin-main-col {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 28px 28px 28px 16px;
          min-width: 0;
          overflow: hidden;
        }

        .admin-main-inner {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .admin-sidebar-col { display: none; }
          .admin-main-col { padding: 20px; }
        }
      `}</style>

      <div className="admin-root">
        {/* Sidebar */}
        <div className="admin-sidebar-col">
          <div className="admin-sidebar-panel">
            <AdminSidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="admin-main-col">
          <div className="admin-main-inner">
            <h2>Consumer</h2>
            <UserDetailCard
              user={{ ...user, _role: "consumer" }}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUploadPicture={handleUpload}
            />
          </div>
        </div>
      </div>
    </>
  );
}
