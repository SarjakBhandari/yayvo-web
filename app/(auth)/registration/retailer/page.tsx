"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Calendar, MapPin, Briefcase } from "lucide-react";

/* ---------------- Schema ---------------- */
const retailerSchema = z
  .object({
    ownerName: z.string().min(1, "Owner name is required"),
    orgName: z.string().min(1, "Organization name is required"),
    email: z.string().email("Enter a valid email"),
    doe: z.string().min(1, "Date of Establishment is required"),
    country: z.string().min(1, "Country is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RetailerData = z.infer<typeof retailerSchema>;

/* ---------------- Country List ---------------- */
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

export default function RetailerRegistrationPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RetailerData>({
    resolver: zodResolver(retailerSchema),
  });

  const onSubmit = (data: RetailerData) => {
    console.log(data);
    alert("Retailer Registration Successful!");
    router.push("/auth/login"); // Redirect after success
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        {/* LEFT PANEL */}
        <div className="auth-left">
          <h1 className="auth-title">Create Retailer Account</h1>
          <p style={{ opacity: 0.9, marginTop: "0.5rem", textAlign: "center" }}>
            Join Yayvo and register your store
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* Owner Name */}
            <div className="form-group">
              <label>Owner Name</label>
              <div className="input-icon">
                <User className="icon" />
                <input type="text" {...register("ownerName")} />
              </div>
              {errors.ownerName && (
                <p className="form-error">{errors.ownerName.message}</p>
              )}
            </div>

            {/* Organization Name */}
            <div className="form-group">
              <label>Organization Name</label>
              <div className="input-icon">
                <Briefcase className="icon" />
                <input type="text" {...register("orgName")} />
              </div>
              {errors.orgName && (
                <p className="form-error">{errors.orgName.message}</p>
              )}
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
                  {...register("doe")}
                  onChange={(e) => setValue("doe", e.target.value)}
                />
              </div>
              {errors.doe && <p className="form-error">{errors.doe.message}</p>}
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
        </div>
      </div>
    </div>
  );
}
