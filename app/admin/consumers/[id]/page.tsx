// app/admin/consumers/[id]/page.tsx
"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/admin/_hooks/useUsers";
import { confirmAction } from "@/app/admin/_utils/confirm";
import { deleteConsumer, uploadConsumerPicture } from "@/lib/api/admin";
import AdminSidebar from "@/app/admin/_components/AdminSideBar";
import UserDetailCard from "@/app/admin/_components/UserDetailCard";


export default function ConsumerDetail() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, setUser, loading } = useUser(id, "consumer");

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  console.log(user);
  if (!user) return <p style={{ padding: 24 }}>Not found</p>;

  async function handleDelete() {
    await deleteConsumer(user.authId);
    router.push("/admin");
  }

  function handleEdit() { router.push(`/admin/consumers/${id}/edit`); }

  async function handleUpload(file: File) {

    const res = await uploadConsumerPicture(user.authId, file);

    const newProfile = res.profilePicture ?? res.path ?? res.profilePictureUrl;

setUser((prev: any) => ({ ...prev, profilePicture: newProfile }));
alert("successfully uploded profile picture");
            router.push(`/admin/`);

}

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 24 }}>
        <h2>Consumer</h2>
        <UserDetailCard user={{ ...user, _role: "consumer" }} onEdit={handleEdit} onDelete={handleDelete} onUploadPicture={handleUpload} />
      </main>
    </div>
  );
}
