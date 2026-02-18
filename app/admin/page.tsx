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

  const {
    consumers,
    page,
    size,
    total,
    loading: lc,
    goToPage,
    setPageSize,
    doSearch,
  } = useConsumers();

  const { retailers, loading: lr } = useRetailers();

  const [qC, setQC] = useState("");
  const [qR, setQR] = useState("");

  const filteredRetailers = useMemo(() => {
    return retailers.filter((u) => {
      const name = u.organizationName || u.ownerName || "";
      return (
        !qR ||
        u.username?.toLowerCase().includes(qR.toLowerCase()) ||
        name.toLowerCase().includes(qR.toLowerCase())
      );
    });
  }, [retailers, qR]);

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
            <h2>Dashboard</h2>

            <section style={{ marginBottom: 32 }}>
              <h3>Consumers</h3>
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
              <SearchInput
                value={qR}
                onChange={setQR}
                placeholder="Search retailers..."
              />
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
          </div>
        </div>
      </div>
    </>
  );
}
