// app/admin/page.tsx
"use client";
import React, { useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { useConsumers } from "./_hooks/useConsumers";
import { useRetailers } from "./_hooks/useRetailers";
import AdminSidebar from "./_components/AdminSideBar";
import SearchInput from "./_components/searchInput";
import UserTable from "./_components/UserTable";

export default function AdminHome() {
  const router = useRouter();
  const { consumers, loading: lc } = useConsumers();
  const { retailers, loading: lr } = useRetailers();
  const [qC, setQC] = useState("");
  const [qR, setQR] = useState("");

  const filteredConsumers = useMemo(() => consumers.filter(u =>
    !qC || (u.username?.toLowerCase().includes(qC.toLowerCase()) || (u.fullName ?? "").toLowerCase().includes(qC.toLowerCase()))
  ), [consumers, qC]);

  const filteredRetailers = useMemo(() => retailers.filter(u =>
    !qR || (u.username?.toLowerCase().includes(qR.toLowerCase()) || (u.organizationName ?? u.ownerName ?? "").toLowerCase().includes(qR.toLowerCase()))
  ), [retailers, qR]);

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 24 }}>
        <h2>Dashboard</h2>

        <section style={{ marginBottom: 32 }}>
          <h3>Consumers</h3>
          <SearchInput value={qC} onChange={setQC} placeholder="Search consumers..." />
          {lc ? <p>Loading...</p> : <UserTable users={filteredConsumers} onView={(id) => router.push(`/admin/consumers/${id}`)} columns={["Username", "Phone", "Full name"]} />}
        </section>

        <section>
          <h3>Retailers</h3>
          <SearchInput value={qR} onChange={setQR} placeholder="Search retailers..." />
          {lr ? <p>Loading...</p> : <UserTable users={filteredRetailers} onView={(id) => router.push(`/admin/retailers/${id}`)} columns={["Username", "Phone", "Organization"]} />}
        </section>
      </main>
    </div>
  );
}
