"use client";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/actions/auth-actions";
import { AuthResponse } from "@/app/types/auth";

/**
 * Custom hook to manage login form state.
 * Tracks email and password, validates, and calls backend login.
 */
export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      alert("Please enter both email and password");
      return false;
    }

    try {
      const res: AuthResponse = await handleLogin({ email, password });

      if (!res.success) {
        throw new Error(res.message || "Login Failed");
      }

      if (res.token) {
        localStorage.setItem("authToken", res.token);
      }

      alert("Login Successful!");

      // redirect based on role
      const role = res.user?.role || "consumer";
      router.push(`/welcome/${role}`);

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        alert(err.message);
      } else {
        setError("Login Failed");
        alert("Login Failed");
      }
      return false;
    }
  };

  return {
    email,
    password,
    error,
    handleEmail,
    handlePassword,
    handleSubmit,
  };
};
