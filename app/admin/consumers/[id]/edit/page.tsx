// app/admin/consumers/[id]/edit/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/admin/_hooks/useUsers";
import { updateConsumer } from "@/lib/api/admin";
import AdminSidebar from "@/app/admin/_components/AdminSideBar";

export default function EditConsumer() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, loading } = useUser(id, "consumer");
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ email: user.email ?? "", username: user.username ?? "", fullName: user.fullName ?? "", phoneNumber: user.phoneNumber ?? "", dob: user.dob ?? "", gender: user.gender ?? "", country: user.country ?? "" });
  }, [user]);

  if (loading || !form) return <p style={{ padding: 24 }}>Loading...</p>;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await updateConsumer(id, form); router.push(`/admin/consumers/${id}`); } catch (err) { console.error(err); alert("Update failed"); } finally { setSaving(false); }
  }

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 24 }}>
        <h2>Edit Consumer</h2>
        <form onSubmit={handleSave}>
          <div><label>Full name<input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label></div>
          <div><label>Phone<input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} /></label></div>
          <div><label>DOB<input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} /></label></div>
          <div><label>Gender<input value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} /></label></div>
          <div><label>Country<input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></label></div>

          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => router.push(`/admin/consumers/${id}`)} style={{ marginLeft: 8 }}>Cancel</button>
          </div>
        </form>
      </main>
    </div>
  );
}
