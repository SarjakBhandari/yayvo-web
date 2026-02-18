"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Lock, User, Briefcase, Calendar, MapPin, Phone, Loader2, ChevronDown } from "lucide-react";
import { useRetailerRegister } from "../_hooks/use-retailer_register";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COUNTRIES = [
  "Nepal","India","China","United States","United Kingdom",
  "Australia","Canada","Germany","France","Japan",
];

export default function RetailerRegisterForm() {
  const {
    register, handleSubmit,
    formState: { errors, isSubmitting },
    setValue, onSubmit, errs,
  } = useRetailerRegister(() => {
    toast.success("Registration successful! Welcome to Yayvo.");
  });

  useEffect(() => {
    if (errs) toast.error(errs);
  }, [errs]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rrf-root {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          background: #F5F0E8;
          font-family: 'DM Sans', sans-serif;
          padding: 20px;
          position: relative; overflow: hidden;
        }
        .rrf-blob {
          position: fixed; border-radius: 50%;
          filter: blur(80px); pointer-events: none; z-index: 0;
        }
        .rrf-blob-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%);
          top: -150px; right: -80px;
        }
        .rrf-blob-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(139,107,61,0.07) 0%, transparent 70%);
          bottom: -80px; left: -60px;
        }

        .rrf-card {
          position: relative; z-index: 1;
          background: #FAFAF8;
          border: 1px solid #E8E4DC;
          border-radius: 24px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(26,22,18,0.12);
          width: 100%; max-width: 620px;
        }
        .rrf-card-header {
          background: linear-gradient(135deg, #1A1612 0%, #2A2420 100%);
          padding: 28px 36px;
          position: relative; overflow: hidden;
        }
        .rrf-card-header::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            -45deg, transparent, transparent 18px,
            rgba(201,169,110,0.04) 18px, rgba(201,169,110,0.04) 36px
          );
        }
        .rrf-header-blob {
          position: absolute;
          width: 240px; height: 240px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%);
          bottom: -100px; right: -60px; pointer-events: none;
        }
        .rrf-eyebrow {
          position: relative; z-index: 1;
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.14em; color: rgba(250,250,248,0.5);
          font-weight: 500; margin-bottom: 4px;
        }
        .rrf-heading {
          position: relative; z-index: 1;
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700;
          color: #FAFAF8; letter-spacing: -0.02em; line-height: 1.1;
        }

        .rrf-card-body { padding: 28px 36px 36px; }
        .rrf-form { display: flex; flex-direction: column; gap: 14px; }
        .rrf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .rrf-field { display: flex; flex-direction: column; gap: 6px; }
        .rrf-label {
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.1em; color: #9C8E7A; font-weight: 500;
        }
        .rrf-input-wrap { position: relative; display: flex; align-items: center; }
        .rrf-input-icon {
          position: absolute; left: 13px; color: #B8A898;
          pointer-events: none; display: flex; align-items: center;
          transition: color 0.18s ease;
        }
        .rrf-input-wrap:focus-within .rrf-input-icon { color: #C9A96E; }
        .rrf-input, .rrf-select, .rrf-date {
          width: 100%; padding: 11px 14px 11px 40px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          border-radius: 12px; border: 1px solid #E8E4DC;
          background: #FAFAF8; color: #1A1612; outline: none;
          transition: border-color 0.18s ease, box-shadow 0.18s ease;
          appearance: none; -webkit-appearance: none;
        }
        .rrf-input.no-icon, .rrf-date.no-icon, .rrf-select.no-icon { padding-left: 14px; }
        .rrf-input::placeholder { color: #B8A898; }
        .rrf-input:focus, .rrf-select:focus, .rrf-date:focus {
          border-color: #C9A96E;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
        }
        .rrf-input.error, .rrf-select.error, .rrf-date.error { border-color: #E57373; }
        .rrf-select-wrap { position: relative; }
        .rrf-select-chevron {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%); color: #B8A898; pointer-events: none;
        }
        .rrf-err { font-size: 12px; color: #C0392B; }

        .rrf-divider { height: 1px; background: #F0EBE1; margin: 4px 0; }
        .rrf-section-label {
          font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em;
          color: #B8A898; font-weight: 500;
        }

        .rrf-submit-btn {
          width: 100%; padding: 13px;
          border-radius: 12px; border: none;
          background: #1A1612; color: #FAFAF8;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s ease; letter-spacing: 0.01em; margin-top: 6px;
        }
        .rrf-submit-btn:hover:not(:disabled) {
          background: #2A2420; transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(26,22,18,0.2);
        }
        .rrf-submit-btn:disabled { opacity: 0.6; cursor: wait; }
        .rrf-spin { animation: rrfSpin 0.8s linear infinite; }
        @keyframes rrfSpin { to { transform: rotate(360deg) } }

        .rrf-footer {
          text-align: center; font-size: 13px; color: #9C8E7A; margin-top: 4px;
        }
        .rrf-footer a { color: #C9A96E; text-decoration: none; font-weight: 500; }
        .rrf-footer a:hover { text-decoration: underline; }

        @media (max-width: 520px) {
          .rrf-row { grid-template-columns: 1fr; }
          .rrf-card-header, .rrf-card-body { padding-left: 20px; padding-right: 20px; }
        }
      `}</style>

      <ToastContainer
        position="bottom-right" autoClose={4000}
        toastStyle={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, borderRadius: 12, background: "#1A1612", color: "#FAFAF8", border: "1px solid #2A2420" }}
      />

      <div className="rrf-root">
        <div className="rrf-blob rrf-blob-1" />
        <div className="rrf-blob rrf-blob-2" />

        <div className="rrf-card">
          <div className="rrf-card-header">
            <div className="rrf-header-blob" />
            <div className="rrf-eyebrow">Retailer Onboarding</div>
            <h1 className="rrf-heading">Create your business account</h1>
          </div>

          <div className="rrf-card-body">
            <form className="rrf-form" onSubmit={handleSubmit(onSubmit)}>

              {/* Owner Name + Org Name */}
              <div className="rrf-row">
                <div className="rrf-field">
                  <label className="rrf-label">Owner Name</label>
                  <div className="rrf-input-wrap">
                    <span className="rrf-input-icon"><User size={14} /></span>
                    <input className={`rrf-input${errors.ownerName ? " error" : ""}`} type="text" placeholder="Your full name" {...register("ownerName")} />
                  </div>
                  {errors.ownerName && <span className="rrf-err">{errors.ownerName.message}</span>}
                </div>
                <div className="rrf-field">
                  <label className="rrf-label">Organization</label>
                  <div className="rrf-input-wrap">
                    <span className="rrf-input-icon"><Briefcase size={14} /></span>
                    <input className={`rrf-input${errors.organizationName ? " error" : ""}`} type="text" placeholder="Company name" {...register("organizationName")} />
                  </div>
                  {errors.organizationName && <span className="rrf-err">{errors.organizationName.message}</span>}
                </div>
              </div>

              {/* Username + Phone */}
              <div className="rrf-row">
                <div className="rrf-field">
                  <label className="rrf-label">Username</label>
                  <div className="rrf-input-wrap">
                    <span className="rrf-input-icon"><User size={14} /></span>
                    <input className={`rrf-input${errors.username ? " error" : ""}`} type="text" placeholder="@handle" {...register("username")} />
                  </div>
                  {errors.username && <span className="rrf-err">{errors.username.message}</span>}
                </div>
                <div className="rrf-field">
                  <label className="rrf-label">Phone</label>
                  <div className="rrf-input-wrap">
                    <span className="rrf-input-icon"><Phone size={14} /></span>
                    <input className={`rrf-input${errors.phoneNumber ? " error" : ""}`} type="text" placeholder="+977 9800000000" {...register("phoneNumber")} />
                  </div>
                  {errors.phoneNumber && <span className="rrf-err">{errors.phoneNumber.message}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="rrf-field">
                <label className="rrf-label">Business Email</label>
                <div className="rrf-input-wrap">
                  <span className="rrf-input-icon"><Mail size={14} /></span>
                  <input className={`rrf-input${errors.email ? " error" : ""}`} type="email" placeholder="hello@company.com" {...register("email")} />
                </div>
                {errors.email && <span className="rrf-err">{errors.email.message}</span>}
              </div>

              {/* Date of Establishment + Country */}
              <div className="rrf-row">
                <div className="rrf-field">
                  <label className="rrf-label">Date of Establishment</label>
                  <div className="rrf-input-wrap">
                    <span className="rrf-input-icon"><Calendar size={14} /></span>
                    <input
                      className={`rrf-date${errors.dateOfEstablishment ? " error" : ""}`}
                      type="date"
                      {...register("dateOfEstablishment")}
                      onChange={(e) => setValue("dateOfEstablishment", e.target.value)}
                    />
                  </div>
                  {errors.dateOfEstablishment && <span className="rrf-err">{errors.dateOfEstablishment.message}</span>}
                </div>
                <div className="rrf-field">
                  <label className="rrf-label">Country</label>
                  <div className="rrf-input-wrap rrf-select-wrap">
                    <span className="rrf-input-icon"><MapPin size={14} /></span>
                    <select className={`rrf-select${errors.country ? " error" : ""}`} {...register("country")}>
                      <option value="">Select country</option>
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="rrf-select-chevron" />
                  </div>
                  {errors.country && <span className="rrf-err">{errors.country.message}</span>}
                </div>
              </div>

              <div className="rrf-divider" />
              <div className="rrf-section-label">Security</div>

              {/* Password + Confirm */}
              <div className="rrf-row">
                <div className="rrf-field">
                  <label className="rrf-label">Password</label>
                  <div className="rrf-input-wrap">
                    <span className="rrf-input-icon"><Lock size={14} /></span>
                    <input className={`rrf-input${errors.password ? " error" : ""}`} type="password" placeholder="Min 8 characters" {...register("password")} />
                  </div>
                  {errors.password && <span className="rrf-err">{errors.password.message}</span>}
                </div>
                <div className="rrf-field">
                  <label className="rrf-label">Confirm Password</label>
                  <div className="rrf-input-wrap">
                    <span className="rrf-input-icon"><Lock size={14} /></span>
                    <input className={`rrf-input${errors.confirmPassword ? " error" : ""}`} type="password" placeholder="Repeat password" {...register("confirmPassword")} />
                  </div>
                  {errors.confirmPassword && <span className="rrf-err">{errors.confirmPassword.message}</span>}
                </div>
              </div>

              <button type="submit" className="rrf-submit-btn" disabled={isSubmitting}>
                {isSubmitting && <Loader2 size={15} className="rrf-spin" />}
                {isSubmitting ? "Creating Account…" : "Create Business Account"}
              </button>

              <div className="rrf-footer">
                Already have an account? <Link href="/login">Sign In</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}