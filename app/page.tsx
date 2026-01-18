// app/page.tsx
"use server";

import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthToken, getUserData } from "@/lib/cookie";

export default async function Page() {
  // Check cookies using your cookie.ts helpers
  const token = await getAuthToken();
  const user = await getUserData();

  // If user is logged in → redirect to dashboard
  if (token && user) {
    // You can redirect based on role if needed
    if (user.role === "consumer") {
      redirect("/consumer/");
    } else if (user.role === "retailer") {
      redirect("/retailer/");
    } else if (user.role === "admin") {
      redirect("/admin/");
    } else {
      redirect("/dashboard"); // fallback
    }
  }

  // If not logged in → show landing page
  return (
    <div className="home-layout">
      {/* AppBar / Header */}
      <header className="appbar">
        <div className="appbar-inner">
          <div className="appbar-left">
            <Image
              src="/images/logo.png"
              alt="Yayvo Logo"
              width={40}
              height={40}
              priority
            />
            <span className="appbar-title">Yayvo</span>
          </div>
          <nav className="appbar-nav hide-on-mobile">
            <Link href="/login" className="appbar-link">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>
          Products That <span>Feel Right</span>
        </h1>
        <p>
          Express how products make you feel with icons, stories, and authentic
          sentiment.
        </p>
        <p className="hero-subtext">
          Instead of star ratings, Yayvo highlights{" "}
          <strong>sentiment-based reviews</strong> — showing how products truly
          make people feel.
        </p>

        {/* Centered button group */}
        <div className="button-group">
          <Link href="/registration/consumer" className="btn btn-primary">
            Start as Consumer
          </Link>
          <Link href="/registration/retailer" className="btn btn-primary">
            Start as Retailer
          </Link>
          <Link href="/login" className="btn btn-outline">
            Already have an account? Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="section container grid-3">
        <div className="card">
          <h3>Emotion-First Discovery</h3>
          <p>
            Find products based on how they make you feel, not just what they
            do.
          </p>
        </div>
        <div className="card">
          <h3>Personalized For You</h3>
          <p>Recommendations tailored to your mood and lifestyle.</p>
        </div>
        <div className="card">
          <h3>Authentic Community</h3>
          <p>Connect with real people sharing genuine experiences.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="auth-footer">
        <p>
          © {new Date().getFullYear()} Yayvo — Lifestyle discovery through
          emotional design · Web API coursework
        </p>
      </footer>
    </div>
  );
}
