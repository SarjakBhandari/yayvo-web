"use server";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthToken, getUserData } from "@/lib/cookie";
import { handleLogout } from "@/lib/actions/auth-actions";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const token = await getAuthToken();
  const user = await getUserData();

  if (token && user) {
    if (user.role === "consumer") {
      redirect("/consumer");
    } else if (user.role === "retailer") {
      redirect("/retailer");
    } else if (user.role === "admin") {
      redirect("/admin");
    } else {
      await handleLogout();
      redirect("/login")
    }
  }

  return (
    <div className="auth-layout">
      <header className="appbar">
        <div className="appbar-inner">
          <div className="appbar-left">
            <Image src="/images/logo.png" alt="Yayvo Logo" width={40} height={40} />
            <span className="appbar-title">Yayvo</span>
          </div>
          <nav className="appbar-nav">
            <Link href="/" className="appbar-link">Home</Link>
          </nav>
        </div>
      </header>
      <main className="auth-container">{children}</main>
      <footer className="auth-footer">
        <p>© {new Date().getFullYear()} Yayvo — Lifestyle discovery through emotional design</p>
      </footer>
    </div>
  );
}
