"use client";
import { ChangeEvent, useState } from "react";

/**
 * Custom hook to manage login form state.
 * Tracks email and password, with simple validation.
 */
export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return false;
    }
    // Example success flow
    alert("Login Success");
    return true;
  };

  return {
    email,
    password,
    handleEmail,
    handlePassword,
    handleSubmit,
  };
};
