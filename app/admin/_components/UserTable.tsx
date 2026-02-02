// admin/components/UserTable.tsx
"use client";

import React from "react";
import { Eye, User } from "lucide-react";

type Props = {
  users: Array<Record<string, any>>;
  onView: (id: string) => void;
  columns?: string[];
};

export default function UserTable({ users, onView, columns = ["Username", "Email", "Name"] }: Props) {
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
            {users.length === 0 && (
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
            )}
            {users.map((u, index) => {
              const id = u._id ?? u.id;
              const username = u.username ?? "-";
              const email = u.email ?? "-";
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}