// admin/components/UserTable.tsx
"use client";

import React from "react";

type Props = {
  users: Array<Record<string, any>>;
  onView: (id: string) => void;
  columns?: string[];
};

export default function UserTable({ users, onView, columns = ["Username", "Email", "Name"] }: Props) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((c) => <th key={c} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee" }}>{c}</th>)}
            <th style={{ padding: 8, borderBottom: "1px solid #eee" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr><td colSpan={columns.length + 1} style={{ padding: 12, color: "#666" }}>No records</td></tr>
          )}
          {users.map((u) => {
            const id = u._id ?? u.id;
            const username = u.username ?? "-";
            const email = u.email ?? "-";
            const name = u.fullName ?? u.ownerName ?? u.organizationName ?? "-";
            return (
              <tr key={id} style={{ borderTop: "1px solid #f3f3f3" }}>
                <td style={{ padding: 8 }}>{username}</td>
                <td style={{ padding: 8 }}>{email}</td>
                <td style={{ padding: 8 }}>{name}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => onView(id)} style={{ padding: "6px 10px", borderRadius: 6 }}>View</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
