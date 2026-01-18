// app/admin/layout.tsx
"use server";

import { redirect } from "next/navigation";
import { getAuthToken, getUserData } from "@/lib/cookie";
import { handleLogout } from "@/lib/actions/auth-actions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAuthToken();
  const user = await getUserData();

  async function logout() {
    redirect("/login");
  }

  // If no token OR no user → logout
  if (!token || !user) {
    await logout();
  }

  // Only allow admin role
  if (user.role !== "admin") {
    await logout();
  }

  return children;
}
