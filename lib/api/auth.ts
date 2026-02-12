// ACTUAL API CALLS

import axios from "./axios";
import { API } from "./endpoints";

export const registerConsumer = async (registerData: any) => {
  try {
    const response = await axios.post(API.AUTH.REGISTER_C, registerData);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || // backend error message
        err.message || // general axios message
        "Registration Failed", // fallback message
    );
  }
};

export const registerRetailer = async (registerData: any) => {
  try {
    const response = await axios.post(API.AUTH.REGISTER_R, registerData);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Registration Failed",
    );
  }
};

export const login = async (loginData: any) => {
  try {
    const response = await axios.post(API.AUTH.LOGIN, loginData);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || // backend error message
        err.message || // general axios message
        "Login Failed", // fallback message
    );
  }
};
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, {
      email,
    });
    return response.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "Password reset request failed",
    );
  }
};
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const url = API.AUTH.RESET_PASSWORD.replace(":token", token);
    const response = await axios.post(url, { newPassword });
    return response.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || err.message || "Password reset failed",
    );
  }
};
