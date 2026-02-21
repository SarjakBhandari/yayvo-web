// admin/components/UserTable.tsx
"use client";

import React from "react";
import { Eye, User } from "lucide-react";

type Props = {
  users: Array<Record<string, any>>;
  onView: (id: string) => void;
  columns?: string[];
};

export default function UserTable({
  users,
  onView,
  columns = ["Username", "Email", "Name"],
}: Props) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .ut-wrap {
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(26,22,18,0.06);
          font-family: 'DM Sans', sans-serif;
        }
        .ut-scroll { overflow-x: auto; }
        .ut-table { width: 100%; border-collapse: collapse; }

        .ut-thead tr {
          background: #F5F0E8;
          border-bottom: 1px solid #E8E4DC;
        }
        .ut-th {
          text-align: left;
          padding: 14px 20px;
          font-size: 10px; font-weight: 600;
          color: #9C8E7A; text-transform: uppercase;
          letter-spacing: 0.12em; white-space: nowrap;
        }
        .ut-th-center { text-align: center; }

        .ut-tr {
          border-top: 1px solid #F0EBE1;
          transition: background 0.15s ease;
        }
        .ut-tr:first-child { border-top: none; }
        .ut-tr:hover { background: #F5F0E8; }

        .ut-td { padding: 15px 20px; font-size: 14px; vertical-align: middle; }
        .ut-td-primary { color: #1A1612; font-weight: 500; }
        .ut-td-secondary { color: #7A6A52; }
        .ut-td-center { text-align: center; }

        .ut-avatar {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, #C9A96E, #8B6B3D);
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #FAFAF8;
          margin-right: 10px; flex-shrink: 0; vertical-align: middle;
        }

        .ut-view-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 10px;
          background: #F0EBE1; color: #5A4C38;
          border: 1px solid #E8E4DC;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: all 0.18s ease;
        }
        .ut-view-btn:hover {
          background: #1A1612; color: #FAFAF8;
          border-color: #1A1612; transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(26,22,18,0.18);
        }

        .ut-empty {
          padding: 56px 20px; text-align: center;
          display: flex; flex-direction: column;
          align-items: center; gap: 14px;
        }
        .ut-empty-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: #F0EBE1;
          display: flex; align-items: center; justify-content: center;
          color: #C9A96E;
        }
        .ut-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 700;
          color: #1A1612; letter-spacing: -0.02em; margin: 0;
        }
        .ut-empty-sub { font-size: 13px; color: #9C8E7A; margin: 0; }
      `}</style>

      <div className="ut-wrap">
        <div className="ut-scroll">
          <table className="ut-table">
            <thead className="ut-thead">
              <tr>
                {columns.map((c) => <th key={c} className="ut-th">{c}</th>)}
                <th className="ut-th ut-th-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1}>
                    <div className="ut-empty">
                      <div className="ut-empty-icon"><User size={24} /></div>
                      <p className="ut-empty-title">No users found</p>
                      <p className="ut-empty-sub">There are no records to display</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u, index) => {
                  const id = u._id ?? u.id ?? `${index}`;
                  const username = u.username ?? "-";
                  const email = u.email ?? "-";
                  const name = u.fullName ?? u.ownerName ?? u.organizationName ?? "-";
                  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((n: string) => n[0].toUpperCase()).join("");

                  return (
                    <tr key={id} className="ut-tr">
                      <td className="ut-td ut-td-primary">
                        <span className="ut-avatar">{initials || "?"}</span>
                        {username}
                      </td>
                      <td className="ut-td ut-td-secondary">{email}</td>
                      <td className="ut-td ut-td-secondary">{name}</td>
                      <td className="ut-td ut-td-center">
                        <button
                          className="ut-view-btn"
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
      </div>
    </>
  );
}