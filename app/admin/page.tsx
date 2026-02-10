// app/admin/page.tsx
"use client";
import React, { useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { useConsumers } from "./_hooks/useConsumers";
import { useRetailers } from "./_hooks/useRetailers";
import AdminSidebar from "./_components/AdminSideBar";
import SearchInput from "./_components/searchInput";
import UserTable from "./_components/UserTable";
import PaginatedUserTable from "./_components/pageinatedUserTable";

export default function AdminHome() {
  const router = useRouter();

  // paginated consumers hook (server-side)
  const {
    consumers,
    page,
    size,
    total,
    loading: lc,
    goToPage,
    setPageSize,
    doSearch,
    refresh,
  } = useConsumers();
console.log(`consumers in frontend:${consumers}`);
  // retailers remain client-side list
  const { retailers, loading: lr } = useRetailers();

  // local search state for UI input
  const [qC, setQC] = useState("");
  const [qR, setQR] = useState("");

  // For consumers we rely on server-side search (doSearch).
  // Keep a small local filter only for retailers (client-side).
  const filteredRetailers = useMemo(
    () =>
      retailers.filter(
        (u) =>
          !qR ||
          u.username?.toLowerCase().includes(qR.toLowerCase()) ||
          (u.organizationName ?? u.ownerName ?? "").toLowerCase().includes(qR.toLowerCase())
      ),
    [retailers, qR]
  );

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 24 }}>
        <h2>Dashboard</h2>

        <section style={{ marginBottom: 32 }}>
          <h3>Consumers</h3>

          {/* SearchInput triggers server-side search via doSearch */}
          <SearchInput
            value={qC}
            onChange={(val) => {
              setQC(val);
              doSearch(val);
            }}
            placeholder="Search consumers..."
          />

          {lc ? (
            <p>Loading...</p>
          ) : (
            <PaginatedUserTable
              users={consumers}
              onView={(id: any) => router.push(`/admin/consumers/${id}`)}
              columns={["Username", "Phone", "Full name"]}
              // pagination props
              showPagination={true}
              page={page}
              size={size}
              total={total}
              loading={lc}
              onPageChange={(p: number) => goToPage(p)}
              onPageSizeChange={(s: number) => setPageSize(s)}
            />
          )}
        </section>

        <section>
          <h3>Retailers</h3>
          <SearchInput value={qR} onChange={setQR} placeholder="Search retailers..." />
          {lr ? (
            <p>Loading...</p>
          ) : (
            <UserTable
              users={filteredRetailers}
              onView={(id) => router.push(`/admin/retailers/${id}`)}
              columns={["Username", "Phone", "Organization"]}
            />
          )}
        </section>
      </main>
    </div>
  );
}
