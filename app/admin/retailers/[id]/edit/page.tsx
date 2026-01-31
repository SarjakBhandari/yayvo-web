// app/admin/retailers/[id]/edit/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/admin/_hooks/useUsers";
import { updateRetailer } from "@/lib/api/admin";
import AdminSidebar from "@/app/admin/_components/AdminSideBar";

export default function EditRetailer() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, loading } = useUser(id, "retailer");
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ email: user.email ?? "", username: user.username ?? "", ownerName: user.ownerName ?? "", organizationName: user.organizationName ?? "", phoneNumber: user.phoneNumber ?? "", dateOfEstablishment: user.dateOfEstablishment ?? "", country: user.country ?? "" });
  }, [user]);

  if (loading || !form) return <p style={{ padding: 24 }}>Loading...</p>;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await updateRetailer(id, form); router.push(`/admin/retailers/${id}`); } catch (err) { console.error(err); alert("Update failed"); } finally { setSaving(false); }
  }

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 24 }}>
        <h2>Edit Retailer</h2>
        <form onSubmit={handleSave}>
          <div><label>Username<input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></label></div>
          <div><label>Owner name<input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} /></label></div>
          <div><label>Organization<input value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} /></label></div>
          <div><label>Phone<input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} /></label></div>
          <div><label>Country<input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></label></div>

          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => router.push(`/admin/retailers/${id}`)} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </form>
      </main>
    </div>
  );
}
