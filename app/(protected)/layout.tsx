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

  if (!token && !user) {
      await handleLogout();
      redirect("/login")
  }
  return children;
}
