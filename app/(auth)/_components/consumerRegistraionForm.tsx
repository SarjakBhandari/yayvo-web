"use client";
import Link from "next/link";
import { Mail, Lock, User, Phone, Loader2, ChevronDown } from "lucide-react";
import { useConsumerRegister } from "../_hooks/use-consumer_register";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COUNTRIES = [
  "Nepal","India","China","United States","United Kingdom",
  "Australia","Canada","Germany","France","Japan",
];

const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rf-root {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: #F5F0E8;
    font-family: 'DM Sans', sans-serif;
    padding: 20px;
    position: relative; overflow: hidden;
  }
  .rf-blob {
    position: fixed; border-radius: 50%;
    filter: blur(80px); pointer-events: none; z-index: 0;
  }
  .rf-blob-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%);
    top: -150px; right: -80px;
  }
  .rf-blob-2 {
    width: 380px; height: 380px;
    background: radial-gradient(circle, rgba(139,107,61,0.07) 0%, transparent 70%);
    bottom: -80px; left: -60px;
  }
  .rf-card {
    position: relative; z-index: 1;
    background: #FAFAF8;
    border: 1px solid #E8E4DC;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(26,22,18,0.12);
    width: 100%; max-width: 600px;
  }
  .rf-card-header {
    padding: 32px 36px 24px;
    border-bottom: 1px solid #F0EBE1;
  }
  .rf-eyebrow {
    font-size: 11px; text-transform: uppercase;
    letter-spacing: 0.14em; color: #9C8E7A; font-weight: 500;
    margin-bottom: 4px;
  }
  .rf-heading {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 700;
    color: #1A1612; letter-spacing: -0.02em; line-height: 1.1;
  }
  .rf-card-body { padding: 28px 36px 36px; }
  .rf-form { display: flex; flex-direction: column; gap: 14px; }
  .rf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .rf-field { display: flex; flex-direction: column; gap: 6px; }
  .rf-label {
    font-size: 11px; text-transform: uppercase;
    letter-spacing: 0.1em; color: #9C8E7A; font-weight: 500;
  }
  .rf-input-wrap { position: relative; display: flex; align-items: center; }
  .rf-input-icon {
    position: absolute; left: 13px; color: #B8A898;
    pointer-events: none; display: flex; align-items: center;
    transition: color 0.18s ease;
  }
  .rf-input-wrap:focus-within .rf-input-icon { color: #C9A96E; }
  .rf-input, .rf-select, .rf-date {
    width: 100%; padding: 11px 14px 11px 40px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    border-radius: 12px; border: 1px solid #E8E4DC;
    background: #FAFAF8; color: #1A1612; outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    appearance: none; -webkit-appearance: none;
  }
  .rf-input.no-icon, .rf-date.no-icon, .rf-select.no-icon { padding-left: 14px; }
  .rf-input::placeholder { color: #B8A898; }
  .rf-input:focus, .rf-select:focus, .rf-date:focus {
    border-color: #C9A96E;
    box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
  }
  .rf-input.error, .rf-select.error, .rf-date.error { border-color: #E57373; }
  .rf-select-wrap { position: relative; }
  .rf-select-chevron {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%); color: #B8A898;
    pointer-events: none;
  }
  .rf-err { font-size: 12px; color: #C0392B; }

  /* Radio group */
  .rf-radio-group {
    display: flex; gap: 8px; flex-wrap: wrap; padding: 2px 0;
  }
  .rf-radio-label {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 14px; border-radius: 12px;
    border: 1px solid #E8E4DC; background: #FAFAF8;
    cursor: pointer; font-size: 13px; font-weight: 500; color: #5A4C38;
    transition: all 0.18s ease;
    user-select: none;
  }
  .rf-radio-label:hover { background: #F0EBE1; border-color: #D4C8B4; }
  .rf-radio-label input[type=radio] { display: none; }
  .rf-radio-dot {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid #D4C8B4; background: #FAFAF8;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.18s ease; flex-shrink: 0;
  }
  .rf-radio-label.checked { background: #1A1612; border-color: #1A1612; color: #FAFAF8; }
  .rf-radio-label.checked .rf-radio-dot {
    border-color: #C9A96E; background: #C9A96E;
  }
  .rf-radio-label.checked .rf-radio-dot::after {
    content: ''; width: 5px; height: 5px;
    border-radius: 50%; background: #1A1612;
  }

  /* Divider */
  .rf-divider {
    height: 1px; background: #F0EBE1; margin: 4px 0;
  }
  .rf-section-label {
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em;
    color: #B8A898; font-weight: 500;
  }

  /* Submit */
  .rf-submit-btn {
    width: 100%; padding: 13px;
    border-radius: 12px; border: none;
    background: #1A1612; color: #FAFAF8;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s ease; letter-spacing: 0.01em; margin-top: 6px;
  }
  .rf-submit-btn:hover:not(:disabled) {
    background: #2A2420; transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(26,22,18,0.2);
  }
  .rf-submit-btn:disabled { opacity: 0.6; cursor: wait; }
  .rf-spin { animation: rfSpin 0.8s linear infinite; }
  @keyframes rfSpin { to { transform: rotate(360deg) } }

  .rf-footer {
    text-align: center; font-size: 13px; color: #9C8E7A; margin-top: 4px;
  }
  .rf-footer a { color: #C9A96E; text-decoration: none; font-weight: 500; }
  .rf-footer a:hover { text-decoration: underline; }

  @media (max-width: 480px) {
    .rf-row { grid-template-columns: 1fr; }
    .rf-card-header, .rf-card-body { padding-left: 20px; padding-right: 20px; }
  }
`;

export default function ConsumerRegisterForm() {
  const {
    register, handleSubmit,
    formState: { errors, isSubmitting },
    onSubmit, errs,
  } = useConsumerRegister(() => {
    toast.success("Registration successful! Welcome to Yayvo.");
  });

  const [gender, setGender] = useState("Male");

  useEffect(() => {
    if (errs) toast.error(errs);
  }, [errs]);

  return (
    <>
      <style>{SHARED_STYLES}</style>
      <ToastContainer
        position="bottom-right" autoClose={4000}
        toastStyle={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, borderRadius: 12, background: "#1A1612", color: "#FAFAF8", border: "1px solid #2A2420" }}
      />

      <div className="rf-root">
        <div className="rf-blob rf-blob-1" />
        <div className="rf-blob rf-blob-2" />

        <div className="rf-card">
          <div className="rf-card-header">
            <div className="rf-eyebrow">Join Yayvo</div>
            <h1 className="rf-heading">Create your account</h1>
          </div>

          <div className="rf-card-body">
            <form className="rf-form" onSubmit={handleSubmit(onSubmit)}>

              {/* Name + Username */}
              <div className="rf-row">
                <div className="rf-field">
                  <label className="rf-label">Full Name</label>
                  <div className="rf-input-wrap">
                    <span className="rf-input-icon"><User size={14} /></span>
                    <input className={`rf-input${errors.fullName ? " error" : ""}`} type="text" placeholder="Jane Doe" {...register("fullName")} />
                  </div>
                  {errors.fullName && <span className="rf-err">{errors.fullName.message}</span>}
                </div>
                <div className="rf-field">
                  <label className="rf-label">Username</label>
                  <div className="rf-input-wrap">
                    <span className="rf-input-icon"><User size={14} /></span>
                    <input className={`rf-input${errors.username ? " error" : ""}`} type="text" placeholder="janedoe" {...register("username")} />
                  </div>
                  {errors.username && <span className="rf-err">{errors.username.message}</span>}
                </div>
              </div>

              {/* Email + Phone */}
              <div className="rf-row">
                <div className="rf-field">
                  <label className="rf-label">Email</label>
                  <div className="rf-input-wrap">
                    <span className="rf-input-icon"><Mail size={14} /></span>
                    <input className={`rf-input${errors.email ? " error" : ""}`} type="email" placeholder="you@example.com" {...register("email")} />
                  </div>
                  {errors.email && <span className="rf-err">{errors.email.message}</span>}
                </div>
                <div className="rf-field">
                  <label className="rf-label">Phone</label>
                  <div className="rf-input-wrap">
                    <span className="rf-input-icon"><Phone size={14} /></span>
                    <input className={`rf-input${errors.phoneNumber ? " error" : ""}`} type="tel" placeholder="+977 9800000000" {...register("phoneNumber")} />
                  </div>
                  {errors.phoneNumber && <span className="rf-err">{errors.phoneNumber.message}</span>}
                </div>
              </div>

              {/* DOB + Country */}
              <div className="rf-row">
                <div className="rf-field">
                  <label className="rf-label">Date of Birth</label>
                  <input className={`rf-date no-icon${errors.dob ? " error" : ""}`} type="date" {...register("dob")} />
                  {errors.dob && <span className="rf-err">{errors.dob.message}</span>}
                </div>
                <div className="rf-field">
                  <label className="rf-label">Country</label>
                  <div className="rf-select-wrap">
                    <select className={`rf-select no-icon${errors.country ? " error" : ""}`} {...register("country")}>
                      <option value="">Select country</option>
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="rf-select-chevron" />
                  </div>
                  {errors.country && <span className="rf-err">{errors.country.message}</span>}
                </div>
              </div>

              {/* Gender */}
              <div className="rf-field">
                <label className="rf-label">Gender</label>
                <div className="rf-radio-group">
                {["Male", "Female", "Other"].map((g) => (
  <label key={g} className={`rf-radio-label${gender === g ? " checked" : ""}`}>
    <input
      type="radio"
      value={g}
      {...register("gender")}
      onChange={(e) => {
        setGender(e.target.value);
        register("gender").onChange(e); // ← call RHF's onChange too
      }}
    />
    <span className="rf-radio-dot"><span /></span>
    {g}
  </label>
))}
                </div>
                {errors.gender && <span className="rf-err">{errors.gender.message}</span>}
              </div>

              <div className="rf-divider" />
              <div className="rf-section-label">Security</div>

              {/* Password + Confirm */}
              <div className="rf-row">
                <div className="rf-field">
                  <label className="rf-label">Password</label>
                  <div className="rf-input-wrap">
                    <span className="rf-input-icon"><Lock size={14} /></span>
                    <input className={`rf-input${errors.password ? " error" : ""}`} type="password" placeholder="Min 8 characters" {...register("password")} />
                  </div>
                  {errors.password && <span className="rf-err">{errors.password.message}</span>}
                </div>
                <div className="rf-field">
                  <label className="rf-label">Confirm Password</label>
                  <div className="rf-input-wrap">
                    <span className="rf-input-icon"><Lock size={14} /></span>
                    <input className={`rf-input${errors.confirmPassword ? " error" : ""}`} type="password" placeholder="Repeat password" {...register("confirmPassword")} />
                  </div>
                  {errors.confirmPassword && <span className="rf-err">{errors.confirmPassword.message}</span>}
                </div>
              </div>

              <button type="submit" className="rf-submit-btn" disabled={isSubmitting}>
                {isSubmitting && <Loader2 size={15} className="rf-spin" />}
                {isSubmitting ? "Creating Account…" : "Create Account"}
              </button>

              <div className="rf-footer">
                Already registered? <Link href="/login">Sign In</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}