// admin/components/PaginatedUserTable.tsx
"use client";

import React, { useMemo } from "react";
import { Eye, User, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react";

type UserRecord = Record<string, any>;

type Props = {
  users: Array<UserRecord>;
  onView: (id: string) => void;
  columns?: string[];
  page?: number;
  size?: number;
  total?: number;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPagination?: boolean;
  pageWindow?: number;
};

export default function PaginatedUserTable({
  users = [],
  onView,
  columns = ["Username", "Email", "Name"],
  page = 1,
  size = 10,
  total = 0,
  loading = false,
  onPageChange,
  onPageSizeChange,
  showPagination = false,
  pageWindow = 5,
}: Props) {
  const totalPages = Math.max(1, Math.ceil((total ?? 0) / size));

  const handlePageChange = (p: number) => {
    if (!onPageChange) return;
    const next = Math.max(1, Math.min(totalPages, p));
    if (next !== page) onPageChange(next);
  };

  const startIndex = (page - 1) * size + 1;
  const endIndex = Math.min(total, page * size);

  const pageNumbers = useMemo(() => {
    const half = Math.floor(pageWindow / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + pageWindow - 1);
    if (end - start + 1 < pageWindow) start = Math.max(1, end - pageWindow + 1);
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [page, totalPages, pageWindow]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .put-wrap {
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(26,22,18,0.06);
          font-family: 'DM Sans', sans-serif;
        }

        /* Table */
        .put-scroll { overflow-x: auto; }
        .put-table { width: 100%; border-collapse: collapse; }

        /* Head */
        .put-thead tr {
          background: #F5F0E8;
          border-bottom: 1px solid #E8E4DC;
        }
        .put-th {
          text-align: left;
          padding: 14px 20px;
          font-size: 10px;
          font-weight: 600;
          color: #9C8E7A;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          white-space: nowrap;
        }
        .put-th-center { text-align: center; }

        /* Rows */
        .put-tr {
          border-top: 1px solid #F0EBE1;
          transition: background 0.15s ease;
        }
        .put-tr:first-child { border-top: none; }
        .put-tr:hover { background: #F5F0E8; }

        .put-td { padding: 15px 20px; font-size: 14px; vertical-align: middle; }
        .put-td-primary { color: #1A1612; font-weight: 500; }
        .put-td-secondary { color: #7A6A52; }
        .put-td-center { text-align: center; }

        /* Avatar cell */
        .put-avatar {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, #C9A96E, #8B6B3D);
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #FAFAF8;
          margin-right: 10px; flex-shrink: 0; vertical-align: middle;
        }

        /* View btn */
        .put-view-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 10px;
          background: #F0EBE1; color: #5A4C38;
          border: 1px solid #E8E4DC;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: all 0.18s ease;
        }
        .put-view-btn:hover {
          background: #1A1612; color: #FAFAF8;
          border-color: #1A1612; transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(26,22,18,0.18);
        }

        /* Empty / loading state */
        .put-empty {
          padding: 56px 20px;
          text-align: center;
          display: flex; flex-direction: column;
          align-items: center; gap: 14px;
        }
        .put-empty-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: #F0EBE1;
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E;
        }
        .put-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em; margin: 0;
        }
        .put-empty-sub { font-size: 13px; color: #9C8E7A; margin: 0; }
        .put-loading-spin { animation: putSpin 0.8s linear infinite; }
        @keyframes putSpin { to { transform: rotate(360deg) } }

        /* Pagination bar */
        .put-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          border-top: 1px solid #E8E4DC;
          background: #F5F0E8;
          gap: 12px;
          flex-wrap: wrap;
        }
        .put-pagination-info { font-size: 13px; color: #9C8E7A; }
        .put-pagination-info strong { color: #1A1612; font-weight: 600; }
        .put-pagination-controls { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }

        .put-pg-btn {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 9px;
          border: 1px solid #E8E4DC; background: #FAFAF8;
          cursor: pointer; color: #7A6A52;
          transition: all 0.18s ease;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
        }
        .put-pg-btn:hover:not(:disabled) {
          background: #1A1612; color: #FAFAF8;
          border-color: #1A1612;
        }
        .put-pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .put-pg-btn.active {
          background: #1A1612; color: #FAFAF8;
          border-color: #1A1612; font-weight: 600;
        }
        .put-pg-dots { color: #B8A898; font-size: 13px; padding: 0 2px; }

        .put-page-select {
          padding: 7px 28px 7px 10px; border-radius: 9px;
          border: 1px solid #E8E4DC; background: #FAFAF8;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: #5A4C38; cursor: pointer; outline: none;
          appearance: none; -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='%239C8E7A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
          transition: border-color 0.18s ease;
        }
        .put-page-select:focus { border-color: #C9A96E; box-shadow: 0 0 0 3px rgba(201,169,110,0.12); }
      `}</style>

      <div className="put-wrap">
        <div className="put-scroll">
          <table className="put-table">
            <thead className="put-thead">
              <tr>
                {columns.map((c) => <th key={c} className="put-th">{c}</th>)}
                <th className="put-th put-th-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1}>
                    <div className="put-empty">
                      <div className="put-empty-icon">
                        <Loader2 size={24} className="put-loading-spin" />
                      </div>
                      <p className="put-empty-sub">Loading users…</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1}>
                    <div className="put-empty">
                      <div className="put-empty-icon"><User size={24} /></div>
                      <p className="put-empty-title">No users found</p>
                      <p className="put-empty-sub">There are no records to display</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u, index) => {
                  const id = u._id ?? u.id ?? `${index}`;
                  const username = u.username ?? "-";
                  const email = u.email ?? u.phoneNumber ?? "-";
                  const name = u.fullName ?? u.ownerName ?? u.organizationName ?? "-";
                  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((n: string) => n[0].toUpperCase()).join("");

                  return (
                    <tr key={id} className="put-tr">
                      <td className="put-td put-td-primary">
                        <span className="put-avatar">{initials || "?"}</span>
                        {username}
                      </td>
                      <td className="put-td put-td-secondary">{email}</td>
                      <td className="put-td put-td-secondary">{name}</td>
                      <td className="put-td put-td-center">
                        <button
                          className="put-view-btn"
                          onClick={() => onView(id)}
                          aria-label={`View ${username}`}
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {showPagination && (
          <div className="put-pagination">
            <span className="put-pagination-info">
              {total > 0 ? (
                <>Showing <strong>{startIndex}</strong>–<strong>{endIndex}</strong> of <strong>{total}</strong></>
              ) : "No results"}
            </span>

            <div className="put-pagination-controls">
              <button className="put-pg-btn" onClick={() => handlePageChange(1)} disabled={page <= 1} aria-label="First page">
                <ChevronsLeft size={15} />
              </button>
              <button className="put-pg-btn" onClick={() => handlePageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
                <ChevronLeft size={15} />
              </button>

              {pageNumbers[0] > 1 && (
                <><button className="put-pg-btn" onClick={() => handlePageChange(1)}>1</button>
                {pageNumbers[0] > 2 && <span className="put-pg-dots">…</span>}</>
              )}

              {pageNumbers.map((p) => (
                <button key={p} className={`put-pg-btn${p === page ? " active" : ""}`} onClick={() => handlePageChange(p)} aria-current={p === page ? "page" : undefined}>
                  {p}
                </button>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>{pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="put-pg-dots">…</span>}
                <button className="put-pg-btn" onClick={() => handlePageChange(totalPages)}>{totalPages}</button></>
              )}

              <button className="put-pg-btn" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">
                <ChevronRight size={15} />
              </button>
              <button className="put-pg-btn" onClick={() => handlePageChange(totalPages)} disabled={page >= totalPages} aria-label="Last page">
                <ChevronsRight size={15} />
              </button>

              <select
                className="put-page-select"
                value={size}
                onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                aria-label="Rows per page"
              >
                {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n} / page</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    </>
  );
}