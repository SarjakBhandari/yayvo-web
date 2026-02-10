// admin/components/PaginatedUserTable.tsx
"use client";

import React, { useMemo } from "react";
import { Eye, User } from "lucide-react";

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
  // optional small page window for numbered pages
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

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    if (onPageSizeChange) onPageSizeChange(newSize);
  };

  const startIndex = (page - 1) * size + 1;
  const endIndex = Math.min(total, page * size);

  const pageNumbers = useMemo(() => {
    const half = Math.floor(pageWindow / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + pageWindow - 1);
    if (end - start + 1 < pageWindow) {
      start = Math.max(1, end - pageWindow + 1);
    }
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [page, totalPages, pageWindow]);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
              {columns.map((c) => (
                <th
                  key={c}
                  style={{
                    textAlign: "left",
                    padding: "16px 20px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {c}
                </th>
              ))}
              <th
                style={{
                  padding: "16px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  textAlign: "center",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  style={{ padding: "32px 20px", textAlign: "center", color: "#6b7280" }}
                >
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  style={{
                    padding: "48px 20px",
                    textAlign: "center",
                    color: "#9ca3af",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <User size={48} strokeWidth={1.5} color="#d1d5db" />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>
                        No users found
                      </div>
                      <div style={{ fontSize: 14, color: "#9ca3af" }}>
                        There are no records to display
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((u, index) => {
                const id = u._id ?? u.id ?? `${index}`;
                const username = u.username ?? "-";
                const email = u.email ?? u.phoneNumber ?? "-";
                const name = u.fullName ?? u.ownerName ?? u.organizationName ?? "-";

                return (
                  <tr
                    key={id}
                    style={{
                      borderTop: index === 0 ? "none" : "1px solid #f3f4f6",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td
                      style={{
                        padding: "16px 20px",
                        fontSize: 14,
                        color: "#111827",
                        fontWeight: 500,
                      }}
                    >
                      {username}
                    </td>

                    <td
                      style={{
                        padding: "16px 20px",
                        fontSize: 14,
                        color: "#6b7280",
                      }}
                    >
                      {email}
                    </td>

                    <td
                      style={{
                        padding: "16px 20px",
                        fontSize: 14,
                        color: "#374151",
                      }}
                    >
                      {name}
                    </td>

                    <td
                      style={{
                        padding: "16px 20px",
                        textAlign: "center",
                      }}
                    >
                      <button
                        onClick={() => onView(id)}
                        aria-label={`View ${username}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "8px 16px",
                          borderRadius: 8,
                          backgroundColor: "#eff6ff",
                          color: "#2563eb",
                          border: "1px solid #bfdbfe",
                          fontSize: 14,
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#dbeafe";
                          e.currentTarget.style.borderColor = "#93c5fd";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#eff6ff";
                          e.currentTarget.style.borderColor = "#bfdbfe";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <Eye size={16} strokeWidth={2} />
                        <span>View</span>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            borderTop: "1px solid #f3f4f6",
            background: "#ffffff",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            {total > 0 ? (
              <>
                Showing <strong>{startIndex}</strong>–<strong>{endIndex}</strong> of <strong>{total}</strong>
              </>
            ) : (
              <>No results</>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => handlePageChange(1)}
              disabled={page <= 1}
              aria-label="First page"
              style={paginationButtonStyle(page <= 1)}
            >
              {"<<"}
            </button>

            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
              style={paginationButtonStyle(page <= 1)}
            >
              Prev
            </button>

            {/* Numbered pages */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {pageNumbers[0] > 1 && (
                <button
                  onClick={() => handlePageChange(1)}
                  style={pageNumberStyle(1 === page)}
                  aria-label={`Page 1`}
                >
                  1
                </button>
              )}

              {pageNumbers[0] > 2 && <span style={{ color: "#9ca3af" }}>…</span>}

              {pageNumbers.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  aria-current={p === page ? "page" : undefined}
                  style={pageNumberStyle(p === page)}
                >
                  {p}
                </button>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span style={{ color: "#9ca3af" }}>…</span>}

              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  style={pageNumberStyle(totalPages === page)}
                  aria-label={`Page ${totalPages}`}
                >
                  {totalPages}
                </button>
              )}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
              style={paginationButtonStyle(page >= totalPages)}
            >
              Next
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={page >= totalPages}
              aria-label="Last page"
              style={paginationButtonStyle(page >= totalPages)}
            >
              {">>"}
            </button>

            <select
              value={size}
              onChange={handleSizeChange}
              aria-label="Rows per page"
              style={{ padding: "8px", borderRadius: 8, border: "1px solid #e5e7eb" }}
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

function paginationButtonStyle(disabled: boolean) {
  return {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: disabled ? "#f3f4f6" : "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
  } as React.CSSProperties;
}

function pageNumberStyle(active: boolean) {
  return {
    padding: "6px 10px",
    borderRadius: 6,
    border: active ? "1px solid #2563eb" : "1px solid transparent",
    background: active ? "#eff6ff" : "transparent",
    color: active ? "#2563eb" : "#374151",
    cursor: "pointer",
    fontWeight: active ? 600 : 500,
  } as React.CSSProperties;
}
