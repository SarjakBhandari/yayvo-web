"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "../schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginData) => {
    console.log("Login data:", data);
    router.push("/dashboard");
  };

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

      {/* Auth Card */}
      <div className="auth-card">
        <div className="auth-left">
          <Image
            src="/images/logo.png"
            alt="Yayvo Logo"
            width={100}
            height={100}
            priority
          />
          <h1 className="auth-title">Welcome Back!</h1>
        </div>

        <div className="auth-right">
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <div className="input-icon">
                <Mail className="icon" />
                <input type="email" {...register("email")} />
              </div>
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon">
                <Lock className="icon" />
                <input type="password" {...register("password")} />
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <div className="form-links text-right">
              <Link href="/auth/forgot">Forgot Password?</Link>
            </div>

            <button type="submit" className="btn btn-primary">Login</button>
          </form>

          <div className="auth-footer-links">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/auth/register">Create Account</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="auth-footer">
        <p>© {new Date().getFullYear()} Yayvo — Lifestyle discovery through emotional design</p>
      </footer>
    </div>
  );
}
