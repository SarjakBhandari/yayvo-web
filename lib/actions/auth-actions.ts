"use server";
import { AuthResponse } from "@/app/types/auth";
import { login, registerConsumer, registerRetailer } from "../api/auth";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import axios from "axios";
import { API } from "../api/endpoints";
// import {useAuth} from "@/context/AuthContext";

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

    if (res.success) {
      await setAuthToken(res.token);
      await setUserData(res.user);

      return {
        success: true,
        token: res.token,
        user: res.user,
        message: "Login Successful",
      };
    }

    return {
      success: false,
      message: res.message || "Login Failed",
      token: "",
      user: { id: "", email: "", role: "" },
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

/**
 * Clears auth cookies and returns a consistent response.
 */
export const handleLogout = async (): Promise<AuthResponse> => {
  try {
    await clearAuthCookies();

    return {
      success: true,
      message: "Logout Successful",
      token: "",
      user: { id: "", email: "", role: "" },
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Logout Failed",
      token: "",
      user: { id: "", email: "", role: "" },
    };
  }
};

export const updateProfile = async (formData: FormData) => {
    try {
        const response = await axios.put(API.AUTH.updateProfile, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Update profile failed')
    }
}