// app/admin/page.tsx
"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useConsumers } from "./_hooks/useConsumers";
import { useRetailers } from "./_hooks/useRetailers";
import AdminShell from "./_components/AdminShell";
import SearchInput from "./_components/searchInput";
import UserTable from "./_components/UserTable";
import PaginatedUserTable from "./_components/pageinatedUserTable";
import { Users, Store } from "lucide-react";

export default function AdminHome() {
  const router = useRouter();

  const { consumers, page, size, total, loading: lc, goToPage, setPageSize, doSearch } = useConsumers();
  const { retailers, loading: lr } = useRetailers();

  const [qC, setQC] = useState("");
  const [qR, setQR] = useState("");

  const filteredRetailers = useMemo(
    () =>
      retailers.filter((u) => {
        const name = u.organizationName ?? u.ownerName ?? "";
        return (
          !qR ||
          u.username?.toLowerCase().includes(qR.toLowerCase()) ||
          name.toLowerCase().includes(qR.toLowerCase())
        );
      }),
    [retailers, qR]
  );

  return (
    <AdminShell title="Dashboard" eyebrow="Overview">
      <style>{`
        .adm-section-header {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
        }
        .adm-section-title {
          display: flex; align-items: center; gap: 10px;
        }
        .adm-section-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #F0EBE1 0%, #E8E4DC 100%);
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E; flex-shrink: 0;
        }
        .adm-section-name {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em;
        }
        .adm-count-badge {
          display: inline-flex; align-items: center;
          padding: 3px 10px; border-radius: 30px;
          background: #F0EBE1; border: 1px solid #E8E4DC;
          font-size: 11px; font-weight: 600; color: #7A6A52;
          letter-spacing: 0.03em;
        }
        .adm-section { display: flex; flex-direction: column; gap: 14px; }
        .adm-stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px; margin-bottom: 8px;
        }
        .adm-stat-card {
          background: #FAFAF8; border: 1px solid #E8E4DC;
          border-radius: 16px; padding: 18px 20px;
          display: flex; flex-direction: column; gap: 6px;
          box-shadow: 0 2px 8px rgba(26,22,18,0.04);
        }
        .adm-stat-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.12em; color: #9C8E7A; font-weight: 500;
        }
        .adm-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em; line-height: 1;
        }
        .adm-stat-sub { font-size: 12px; color: #B8A898; }
      `}</style>

      {/* Stats */}
      <div className="adm-stats-row">
        <div className="adm-stat-card">
          <div className="adm-stat-label">Total Consumers</div>
          <div className="adm-stat-value">{lc ? "—" : total}</div>
          <div className="adm-stat-sub">Registered accounts</div>
        </div>
        <div className="adm-stat-card">
          <div className="adm-stat-label">Total Retailers</div>
          <div className="adm-stat-value">{lr ? "—" : retailers.length}</div>
          <div className="adm-stat-sub">Active stores</div>
        </div>
      </div>

      {/* Consumers */}
      <div className="adm-section">
        <div className="adm-section-header">
          <div className="adm-section-title">
            <div className="adm-section-icon"><Users size={18} /></div>
            <span className="adm-section-name">Consumers</span>
            {!lc && <span className="adm-count-badge">{total}</span>}
          </div>
          <SearchInput
            value={qC}
            onChange={(val) => { setQC(val); doSearch(val); }}
            placeholder="Search consumers…"
          />
        </div>
        <PaginatedUserTable
          users={consumers}
          onView={(id) => router.push(`/admin/consumers/${id}`)}
          columns={["Username", "Phone", "Full name"]}
          showPagination
          page={page}
          size={size}
          total={total}
          loading={lc}
          onPageChange={goToPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Retailers */}
      <div className="adm-section">
        <div className="adm-section-header">
          <div className="adm-section-title">
            <div className="adm-section-icon"><Store size={18} /></div>
            <span className="adm-section-name">Retailers</span>
            {!lr && <span className="adm-count-badge">{filteredRetailers.length}</span>}
          </div>
          <SearchInput
            value={qR}
            onChange={setQR}
            placeholder="Search retailers…"
          />
        </div>
        <UserTable
          users={filteredRetailers}
          onView={(id) => router.push(`/admin/retailers/${id}`)}
          columns={["Username", "Phone", "Organization"]}
        />
      </div>
    </AdminShell>
  );
}