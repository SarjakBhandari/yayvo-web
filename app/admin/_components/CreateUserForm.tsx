// admin/components/CreateUserForm.tsx
"use client";

import React, { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { buildConsumerFormData, buildRetailerFormData } from "../_utils/formData";
import { createConsumer, createRetailer } from "@/lib/api/admin";
import { 
  User, 
  Building2, 
  Mail, 
  Lock, 
  Phone, 
  Calendar, 
  Globe, 
  Users,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  initialType?: "consumer" | "retailer";
};

export default function CreateUserForm({ initialType = "consumer" }: Props): JSX.Element {
  const router = useRouter();
  const [type, setType] = useState<"consumer" | "retailer">(initialType);
  const [loading, setLoading] = useState(false);

  const [consumer, setConsumer] = useState<any>({
    email: "", password: "", fullName: "", username: "", phoneNumber: "", dob: "", gender: "", country: "", profilePicture: null
  });
  const [retailer, setRetailer] = useState<any>({
    email: "", password: "", ownerName: "", organizationName: "", username: "", phoneNumber: "", dateOfEstablishment: "", country: "", profilePicture: null
  });

  const handleFileChange = (setter: (v: any) => void, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter((prev: any) => ({ ...prev, [field]: e.target.files?.[0] ?? null }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const loadingToast = toast.loading(`Creating ${type}...`, {
      position: "top-right",
    });

    try {
      if (type === "consumer") {
        const fd = buildConsumerFormData(consumer);
        await createConsumer(fd);
      } else {
        const fd = buildRetailerFormData(retailer);
        await createRetailer(fd);
      }
      
      toast.update(loadingToast, {
        render: `${type === "consumer" ? "Consumer" : "Retailer"} created successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      
      setTimeout(() => router.push("/admin"), 1500);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message ?? err.message ?? "Failed to create user";
      toast.update(loadingToast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    boxSizing: "border-box",
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#ffffff",
    transition: "all 0.2s",
  };

  const labelStyle: React.CSSProperties = { 
    display: "block", 
    marginBottom: 8, 
    fontWeight: 600,
    fontSize: 14,
    color: "#374151"
  };

  const FormField = ({ 
    label, 
    icon: Icon, 
    children 
  }: { 
    label: string; 
    icon?: any; 
    children: React.ReactNode 
  }) => (
    <div>
      <label style={labelStyle}>
        {Icon && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon size={16} strokeWidth={2} />
            {label}
          </span>
        )}
        {!Icon && label}
      </label>
      {children}
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px 28px",
          backgroundColor: "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
          Create New User
        </h2>

        {/* Type Selector */}
        <div style={{ display: "flex", gap: 12 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 20px",
              borderRadius: 8,
              border: type === "consumer" ? "2px solid #2563eb" : "1px solid #d1d5db",
              backgroundColor: type === "consumer" ? "#eff6ff" : "#ffffff",
              cursor: "pointer",
              transition: "all 0.2s",
              fontWeight: 600,
              fontSize: 14,
              color: type === "consumer" ? "#2563eb" : "#6b7280",
            }}
          >
            <input
              type="radio"
              name="type"
              checked={type === "consumer"}
              onChange={() => setType("consumer")}
              style={{ margin: 0, cursor: "pointer" }}
            />
            <User size={18} strokeWidth={2} />
            <span>Consumer</span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 20px",
              borderRadius: 8,
              border: type === "retailer" ? "2px solid #2563eb" : "1px solid #d1d5db",
              backgroundColor: type === "retailer" ? "#eff6ff" : "#ffffff",
              cursor: "pointer",
              transition: "all 0.2s",
              fontWeight: 600,
              fontSize: 14,
              color: type === "retailer" ? "#2563eb" : "#6b7280",
            }}
          >
            <input
              type="radio"
              name="type"
              checked={type === "retailer"}
              onChange={() => setType("retailer")}
              style={{ margin: 0, cursor: "pointer" }}
            />
            <Building2 size={18} strokeWidth={2} />
            <span>Retailer</span>
          </label>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ padding: "28px" }}>
          {type === "consumer" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <FormField label="Email Address" icon={Mail}>
                <input
                  style={inputStyle}
                  placeholder="you@example.com"
                  type="email"
                  value={consumer.email}
                  onChange={(e) => setConsumer({ ...consumer, email: e.target.value })}
                  required
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>

              <FormField label="Password" icon={Lock}>
                <input
                  style={inputStyle}
                  placeholder="Choose a secure password"
                  type="password"
                  value={consumer.password}
                  onChange={(e) => setConsumer({ ...consumer, password: e.target.value })}
                  required
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>

              <FormField label="Full Name" icon={User}>
                <input
                  style={inputStyle}
                  placeholder="John Doe"
                  value={consumer.fullName}
                  onChange={(e) => setConsumer({ ...consumer, fullName: e.target.value })}
                  required
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>

              <FormField label="Username" icon={User}>
                <input
                  style={inputStyle}
                  placeholder="username"
                  value={consumer.username}
                  onChange={(e) => setConsumer({ ...consumer, username: e.target.value })}
                  required
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>

              <FormField label="Phone Number" icon={Phone}>
                <input
                  style={inputStyle}
                  placeholder="+1 555 555 5555"
                  value={consumer.phoneNumber}
                  onChange={(e) => setConsumer({ ...consumer, phoneNumber: e.target.value })}
                  required
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>

              <FormField label="Date of Birth" icon={Calendar}>
                <input
                  style={inputStyle}
                  type="date"
                  value={consumer.dob}
                  onChange={(e) => setConsumer({ ...consumer, dob: e.target.value })}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>

              <FormField label="Gender" icon={Users}>
                <select
                  style={inputStyle}
                  value={consumer.gender}
                  onChange={(e) => setConsumer({ ...consumer, gender: e.target.value })}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </FormField>

              <FormField label="Country" icon={Globe}>
                <input
                  style={inputStyle}
                  placeholder="Country"
                  value={consumer.country}
                  onChange={(e) => setConsumer({ ...consumer, country: e.target.value })}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <FormField label="Email Address" icon={Mail}>
                <input
                  style={inputStyle}
                  placeholder="you@business.com"
                  type="email"
                  value={retailer.email}
                  onChange={(e) => setRetailer({ ...retailer, email: e.target.value })}
                  required
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>

              <FormField label="Password" icon={Lock}>
                <input
                  style={inputStyle}
                  placeholder="Choose a secure password"
                  type="password"
                  value={retailer.password}
                  onChange={(e) => setRetailer({ ...retailer, password: e.target.value })}
                  required
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>

              <FormField label="Owner Name" icon={User}>
                <input
                  style={inputStyle}
                  placeholder="Owner full name"
                  value={retailer.ownerName}
                  onChange={(e) => setRetailer({ ...retailer, ownerName: e.target.value })}
                  required
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>

              <FormField label="Organization Name" icon={Building2}>
                <input
                  style={inputStyle}
                  placeholder="Company Ltd."
                  value={retailer.organizationName}
                  onChange={(e) => setRetailer({ ...retailer, organizationName: e.target.value })}
                  required
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>

              <FormField label="Username" icon={User}>
                <input
                  style={inputStyle}
                  placeholder="username"
                  value={retailer.username}
                  onChange={(e) => setRetailer({ ...retailer, username: e.target.value })}
                  required
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>

              <FormField label="Phone Number" icon={Phone}>
                <input
                  style={inputStyle}
                  placeholder="+1 555 555 5555"
                  value={retailer.phoneNumber}
                  onChange={(e) => setRetailer({ ...retailer, phoneNumber: e.target.value })}
                  required
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>

              <FormField label="Date of Establishment" icon={Calendar}>
                <input
                  style={inputStyle}
                  type="date"
                  value={retailer.dateOfEstablishment}
                  onChange={(e) => setRetailer({ ...retailer, dateOfEstablishment: e.target.value })}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>

              <FormField label="Country" icon={Globe}>
                <input
                  style={inputStyle}
                  placeholder="Country"
                  value={retailer.country}
                  onChange={(e) => setRetailer({ ...retailer, country: e.target.value })}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
                />
              </FormField>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px 28px",
            backgroundColor: "#f9fafb",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <button
            type="submit"
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 24px",
              borderRadius: 8,
              backgroundColor: loading ? "#93c5fd" : "#2563eb",
              color: "#ffffff",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#1d4ed8";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(37, 99, 235, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#2563eb";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} strokeWidth={2} style={{ animation: "spin 1s linear infinite" }} />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} strokeWidth={2} />
                <span>Create User</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin")}
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 24px",
              borderRadius: 8,
              backgroundColor: "#ffffff",
              color: "#374151",
              border: "1px solid #d1d5db",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#f9fafb";
                e.currentTarget.style.borderColor = "#9ca3af";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "#d1d5db";
              }
            }}
          >
            <XCircle size={16} strokeWidth={2} />
            <span>Cancel</span>
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}