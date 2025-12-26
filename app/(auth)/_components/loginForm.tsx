"use client";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useLoginForm } from "../_hooks/use-login";
import Image from "next/image";


export default function LoginForm() {
  const {
    email,
    password,
    handleEmail,
    handlePassword,
    handleSubmit,
  } = useLoginForm();

  return (
        <div className="auth-card">
      <div className="auth-left">
        <Image
          src="/images/logo.png"
          alt="Yayvo Logo"
          width={100}
          height={100}
          priority
        />
        <h1 className="auth-title">Welcome!</h1>
      </div>
      <div className="auth-right"> <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="auth-form"
    >
      <div className="form-group">
        <label>Email</label>
        <div className="input-icon">
          <Mail className="icon" />
          <input type="email" value={email} onChange={handleEmail} />
        </div>
      </div>

      <div className="form-group">
        <label>Password</label>
        <div className="input-icon">
          <Lock className="icon" />
          <input type="password" value={password} onChange={handlePassword} />
        </div>
      </div>

      <div className="form-links text-right">
        <Link href="/auth/forgot">Forgot Password?</Link>
      </div>

      <button type="submit" className="btn btn-primary">
        Login
      </button>

      <div className="auth-footer-links">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register">Create Account</Link>
        </p>
      </div>
    </form></div>
    </div>
   
  );
}
