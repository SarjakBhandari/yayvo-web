"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Briefcase, Calendar, MapPin } from "lucide-react";
import { useRetailerRegister } from "../_hooks/use-retailer_register";

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

export default function RetailerRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    onSubmit,   // renamed for consistency with consumer hook
    errs,
  } = useRetailerRegister((res) => {
    // success callback
    alert("Registration successful!");
  });

  // show error alert if registration fails
  if (errs) {
    alert(errs);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      {/* Owner Name */}
      <div className="form-group">
        <label>Owner Name</label>
        <div className="input-icon">
          <User className="icon" />
          <input type="text" {...register("ownerName")} />
        </div>
        {errors.ownerName && <p className="form-error">{errors.ownerName.message}</p>}
      </div>

      {/* Organization Name */}
      <div className="form-group">
        <label>Organization Name</label>
        <div className="input-icon">
          <Briefcase className="icon" />
          <input type="text" {...register("organizationName")} />
        </div>
        {errors.organizationName && <p className="form-error">{errors.organizationName.message}</p>}
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

      {/* Date of Establishment */}
      <div className="form-group">
        <label>Date of Establishment</label>
        <div className="input-icon">
          <Calendar className="icon" />
          <input
            type="date"
            {...register("dateOfEstablishment")}
            onChange={(e) => setValue("dateOfEstablishment", e.target.value)}
          />
        </div>
        {errors.dateOfEstablishment && <p className="form-error">{errors.dateOfEstablishment.message}</p>}
      </div>

      {/* Country */}
      <div className="form-group">
        <label>Country</label>
        <div className="input-icon">
          <MapPin className="icon" />
          <select {...register("country")}>
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {errors.country && <p className="form-error">{errors.country.message}</p>}
      </div>

      {/* Password */}
      <div className="form-group">
        <label>Password</label>
        <div className="input-icon">
          <Lock className="icon" />
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ background: "transparent", border: "none", cursor: "pointer" }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && <p className="form-error">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <label>Confirm Password</label>
        <div className="input-icon">
          <Lock className="icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ background: "transparent", border: "none", cursor: "pointer" }}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="form-error">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
        Register
      </button>

      <p className="auth-footer-links" style={{ marginTop: "15px" }}>
        Already have an account? <Link href="/auth/login">Login</Link>
      </p>
    </form>
  );
}
