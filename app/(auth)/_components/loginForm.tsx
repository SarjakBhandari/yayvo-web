"use client";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useLoginForm } from "../_hooks/use-login";
import Image from "next/image";

export default function LoginForm() {
  const {
    email,
    password,
    errors, // { email: "...", password: "...", general: "..." }
    handleEmail,
    handlePassword,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="auth-card">
      <div className="auth-left">
        <Image src="/images/logo.png" alt="Yayvo Logo" width={100} height={100} priority />
        <h1 className="auth-title">Welcome!</h1>
      </div>

      <div className="auth-right">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleSubmit();
          }}
          className="auth-form"
        >
          <div className="form-group">
            <label>Email</label>
            <div className="input-icon">
              <Mail className="icon" />
              <input
                type="email"
                value={email}
                onChange={handleEmail}
                placeholder="Enter your email"
                className={errors.email ? "input-error" : ""}
                required
              />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-icon">
              <Lock className="icon" />
              <input
                type="password"
                required
                value={password}
                onChange={handlePassword}
                placeholder="Enter your password"
                className={errors.password ? "input-error" : ""}
              />
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          {/* General error (not field-specific) */}
          {errors.general && <p className="form-error">{errors.general}</p>}

          <div className="form-links text-right">
            <Link href="/auth/forgot">Forgot Password?</Link>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Login
          </button>

          <div className="auth-footer-links" style={{ marginTop: "15px" }}>
            <p>
              Don&apos;t have an account? <Link href="/">Create Account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
