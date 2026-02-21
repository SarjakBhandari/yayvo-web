// app/admin/consumers/[id]/page.tsx
"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/admin/_hooks/useUsers";
import { deleteConsumer, uploadConsumerPicture } from "@/lib/api/admin";
import AdminShell from "@/app/admin/_components/AdminShell";
import UserDetailCard from "@/app/admin/_components/UserDetailCard";
import { toast } from "react-toastify";

export default function ConsumerDetail() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, setUser, loading } = useUser(id, "consumer");

  if (loading) return <AdminShell title="Consumer" back="/admin"><SkeletonState /></AdminShell>;
  if (!user)   return <AdminShell title="Consumer" back="/admin"><NotFound /></AdminShell>;

  async function handleDelete() {
    await deleteConsumer(user.authId);
    toast.success("Consumer deleted");
    router.push("/admin");
  }

  async function handleUpload(file: File) {
    const res = await uploadConsumerPicture(user.authId, file);
    const newProfile = res.profilePicture ?? res.path ?? res.profilePictureUrl;
    setUser((prev: any) => ({ ...prev, profilePicture: newProfile }));
    router.refresh();
  }

  return (
    <AdminShell title={user.fullName ?? user.username ?? "Consumer"} eyebrow="User Detail" back="/admin">
      <UserDetailCard
        user={{ ...user, _role: "consumer" }}
        onEdit={() => router.push(`/admin/consumers/${id}/edit`)}
        onDelete={handleDelete}
        onUploadPicture={handleUpload}
      />
    </AdminShell>
  );
}

function SkeletonState() {
  return (
    <>
      <style>{`@keyframes cpSkimmer { 0%,100%{opacity:0.4} 50%{opacity:1} }`}</style>
      {[200, 300, 140].map((w, i) => (
        <div key={i} style={{ height: 14, width: w, borderRadius: 8, background: "#E8E4DC", animation: "cpSkimmer 1.4s infinite", marginBottom: 10 }} />
      ))}
    </>
  );
}

function NotFound() {
  return <p style={{ color: "#9C8E7A", fontSize: 14 }}>Consumer not found.</p>;
}