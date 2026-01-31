// use-login.ts
"use client";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/actions/auth-actions";
import { AuthResponse } from "@/app/types/auth";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleSubmit = async () => {
    setErrors({});
    try {
      const res: AuthResponse = await handleLogin({ email, password });

      if (!res.success) {
        throw new Error(res.message || "Login Failed");
      }

      // success routing...
      if (res.user.role === "consumer") router.push("/consumer/");
      else if (res.user.role === "retailer") router.push("/retailer/");
      else if (res.user.role === "admin") router.push("/admin/");
      else {
        setErrors({ general: "User Not Verified! Please contact Support" });
        router.push("/login");
      }

      return true;
    } catch (err: any) {
  const fieldErrors: Record<string, string> = {};

  if (err.response?.data) {
    const data = err.response.data;
    if (Array.isArray(data)) {
      // Map each validation error into { field: message }
      data.forEach((e: any) => {
        if (e.path && e.path.length > 0) {
          fieldErrors[e.path[0]] = e.message;
        }
      });
    } else if (typeof data === "object" && data.message) {
      fieldErrors["general"] = data.message;
    }
  } else if (err instanceof Error) {
    fieldErrors["general"] = err.message;
  } else {
    fieldErrors["general"] = "Login Failed";
  }

  setErrors(fieldErrors);
  return false;
}



  };

  return {
    email,
    password,
    errors, // now an object keyed by field
    handleEmail,
    handlePassword,
    handleSubmit,
  };
};
