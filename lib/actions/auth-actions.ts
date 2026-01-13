"use server";
import { AuthResponse } from "@/app/types/auth";
import { login, registerConsumer, registerRetailer } from "../api/auth";

export const handleRegisterConsumer = async (
  formData: any
): Promise<AuthResponse> => {
  try {
    const res = await registerConsumer(formData);

    if (!res.success) {
      return {
        success: false,
        message: res.message || "Registration Failed",
        token: "",
        user: { id: "", email: "", role: "" },
      };
    }

    return {
      success: true,
      token: res.token,
      user: res.user,
      message: "Registration Successful",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Registration Failed",
      token: "",
      user: { id: "", email: "", role: "" },
    };
  }
};

export const handleRegisterRetailer = async (
  formData: any
): Promise<AuthResponse> => {
  try {
    const res = await registerRetailer(formData);

    if (!res.success) {
      return {
        success: false,
        message: res.message || "Registration Failed",
        token: "",
        user: { id: "", email: "", role: "" },
      };
    }

    return {
      success: true,
      token: res.token,
      user: res.user,
      message: "Registration Successful",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Registration Failed",
      token: "",
      user: { id: "", email: "", role: "" },
    };
  }
};

export const handleLogin = async (formData: any): Promise<AuthResponse> => {
  try {
    const res = await login(formData);
    if (!res.success) {
      return {
        success: false,
        message: res.message || "Login Failed",
        token: "",
        user: { id: "", email: "", role: "" },
      };
    }
    return {
      success: true,
      token: res.token,
      user: res.user,
      message: "Login Successful",
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Login Failed",
      token: "",
      user: { id: "", email: "", role: "" },
    };
  }
};
