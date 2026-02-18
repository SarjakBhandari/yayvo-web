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
    if (user) {
      setForm({
        email: user.email ?? "",
        username: user.username ?? "",
        fullName: user.fullName ?? "",
        phoneNumber: user.phoneNumber ?? "",
        dob: user.dob ?? "",
        gender: user.gender ?? "",
        country: user.country ?? "",
      });
    }
  }, [user]);

  if (loading || !form) return <p style={{ padding: 24 }}>Loading...</p>;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateConsumer(id, form);
      router.push(`/admin/consumers/${id}`);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
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

        form label {
          display: block;
          margin-bottom: 12px;
        }

        form input {
          width: 100%;
          padding: 8px;
          margin-top: 4px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        button {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        button[type="submit"] {
          background: #4CAF50;
          color: white;
        }

        button[type="button"] {
          background: #ccc;
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
            <h2>Edit Consumer</h2>
            <form onSubmit={handleSave}>
              <label>
                Full name
                <input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </label>
              <label>
                Phone
                <input
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm({ ...form, phoneNumber: e.target.value })
                  }
                />
              </label>
              <label>
                DOB
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                />
              </label>
              <label>
                Gender
                <input
                  value={form.gender}
                  onChange={(e) =>
                    setForm({ ...form, gender: e.target.value })
                  }
                />
              </label>
              <label>
                Country
                <input
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                />
              </label>

              <div style={{ marginTop: 12 }}>
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/admin/consumers/${id}`)}
                  style={{ marginLeft: 8 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
