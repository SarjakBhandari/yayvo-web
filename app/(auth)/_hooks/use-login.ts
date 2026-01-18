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
    try {
      const res: AuthResponse = await handleLogin({ email, password });

      if (!res.success) {
        throw new Error(res.message || "Login Failed");
      }
      alert("Login Successful!");

      if (res.user.role === "consumer") {
        router.push("/consumer/");
      } else if (res.user.role === "retailer") {
        router.push("/retailer/");
      } else if(res.user.role=="admin"){
        router.push("/admin/");
      }else{
        alert("User Not Verified! Please contact Support");

         router.push("/login");
      }

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
