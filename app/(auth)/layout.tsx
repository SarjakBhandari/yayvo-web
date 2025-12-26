import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout">
      {/* AppBar */}
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

      {/* Main content */}
      <main className="auth-container">{children}</main>

      {/* Footer */}
      <footer className="auth-footer">
        <p>
          © {new Date().getFullYear()} Yayvo — Lifestyle discovery through emotional design
        </p>
      </footer>
    </div>
  );
}
