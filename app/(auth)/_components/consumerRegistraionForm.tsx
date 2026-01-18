"use client";

import Link from "next/link";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useConsumerRegister } from "../_hooks/use-consumer_register";

const countries = [
  "Nepal",
  "India",
  "China",
  "United States",
  "United Kingdom",
  "Australia",
  "Canada",
  "Germany",
  "France",
  "Japan",
];

export default function ConsumerRegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    errs
  } = useConsumerRegister(() => {
    // success callback
    alert("Registration successful!");
  });

  // watch for errors and show alert
  if (errs) {
    alert(errs);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      {/* Full Name */}
      <div className="form-group">
        <label>Full Name</label>
        <div className="input-icon">
          <User className="icon" />
          <input type="text" {...register("fullName")} />
        </div>
        {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
      </div>

      {/* Username */}
      <div className="form-group">
        <label>Username</label>
        <div className="input-icon">
          <User className="icon" />
          <input type="text" {...register("username")} />
        </div>
        {errors.username && <p className="form-error">{errors.username.message}</p>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email</label>
        <div className="input-icon">
          <Mail className="icon" />
          <input type="email" {...register("email")} />
        </div>
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>

      {/* Phone Number */}
      <div className="form-group">
        <label>Phone Number</label>
        <div className="input-icon">
          <Phone className="icon" />
          <input type="tel" {...register("phoneNumber")} />
        </div>
        {errors.phoneNumber && <p className="form-error">{errors.phoneNumber.message}</p>}
      </div>

      {/* Date of Birth */}
      <div className="form-group">
        <label>Date of Birth</label>
        <input type="date" {...register("dob")} />
        {errors.dob && <p className="form-error">{errors.dob.message}</p>}
      </div>

      {/* Gender */}
      <div className="form-group">
        <label>Gender</label>
        <div className="flex gap-6">
          {["Male", "Female", "Other"].map((g) => (
            <label key={g} className="flex items-center gap-2">
              <input type="radio" value={g} {...register("gender")} />
              <span>{g}</span>
            </label>
          ))}
        </div>
        {errors.gender && <p className="form-error">{errors.gender.message}</p>}
      </div>

      {/* Country */}
      <div className="form-group">
        <label>Country</label>
        <select {...register("country")}>
          <option value="">Select country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.country && <p className="form-error">{errors.country.message}</p>}
      </div>

      {/* Password */}
      <div className="form-group">
        <label>Password</label>
        <div className="input-icon">
          <Lock className="icon" />
          <input type="password" {...register("password")} />
        </div>
        {errors.password && <p className="form-error">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <label>Confirm Password</label>
        <div className="input-icon">
          <Lock className="icon" />
          <input type="password" {...register("confirmPassword")} />
        </div>
        {errors.confirmPassword && (
          <p className="form-error">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
        Register
      </button>

      <p className="auth-footer-links" style={{ marginTop: "12px" }}>
        Already registered? <Link href="/auth/login">Login</Link>
      </p>
    </form>
  );
}
