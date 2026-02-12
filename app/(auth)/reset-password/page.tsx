"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { handleResetPassword } from "@/lib/actions/auth-actions";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await handleResetPassword(token, newPassword);
    setStatus(res);
  }

  return (
    <main style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h1>Reset Password</h1>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {status && (
        <div style={{ marginTop: 12, color: status.success ? "green" : "red" }}>
          {status.message}
        </div>
      )}
    </main>
  );
}
