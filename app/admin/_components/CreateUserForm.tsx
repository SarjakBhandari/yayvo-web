// admin/components/CreateUserForm.tsx
"use client";

import React, { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { buildConsumerFormData, buildRetailerFormData } from "../_utils/formData";
import { createConsumer, createRetailer } from "@/lib/api/admin";

type Props = {
  initialType?: "consumer" | "retailer";
};

export default function CreateUserForm({ initialType = "consumer" }: Props): JSX.Element {
  const router = useRouter();
  const [type, setType] = useState<"consumer" | "retailer">(initialType);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
    setMessage(null);
    try {
      if (type === "consumer") {
        const fd = buildConsumerFormData(consumer);
        await createConsumer(fd);
      } else {
        const fd = buildRetailerFormData(retailer);
        await createRetailer(fd);
      }
      setMessage("Created successfully");
      router.push("/admin");
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? err.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #dcdcdc",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = { display: "block", marginBottom: 6, fontWeight: 600 };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ maxWidth: 820, margin: "0 auto", gap: 12 }}>
      <div style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <label style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input type="radio" name="type" checked={type === "consumer"} onChange={() => setType("consumer")} /> <span>Consumer</span>
        </label>
        <label style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input type="radio" name="type" checked={type === "retailer"} onChange={() => setType("retailer")} /> <span>Retailer</span>
        </label>
      </div>

      {type === "consumer" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} placeholder="you@example.com" value={consumer.email} onChange={(e) => setConsumer({ ...consumer, email: e.target.value })} required />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input style={inputStyle} placeholder="Choose a password" type="password" value={consumer.password} onChange={(e) => setConsumer({ ...consumer, password: e.target.value })} required />
          </div>

          <div>
            <label style={labelStyle}>Full name</label>
            <input style={inputStyle} placeholder="John Doe" value={consumer.fullName} onChange={(e) => setConsumer({ ...consumer, fullName: e.target.value })} required />
          </div>

          <div>
            <label style={labelStyle}>Username</label>
            <input style={inputStyle} placeholder="username" value={consumer.username} onChange={(e) => setConsumer({ ...consumer, username: e.target.value })} required />
          </div>

          <div>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle} placeholder="+1 555 555 5555" value={consumer.phoneNumber} onChange={(e) => setConsumer({ ...consumer, phoneNumber: e.target.value })} required />
          </div>

          <div>
            <label style={labelStyle}>Date of birth</label>
            <input style={inputStyle} type="date" value={consumer.dob} onChange={(e) => setConsumer({ ...consumer, dob: e.target.value })} />
          </div>

          <div>
            <label style={labelStyle}>Gender</label>
            <input style={inputStyle} placeholder="Male / Female / Other" value={consumer.gender} onChange={(e) => setConsumer({ ...consumer, gender: e.target.value })} />
          </div>

          <div>
            <label style={labelStyle}>Country</label>
            <input style={inputStyle} placeholder="Country" value={consumer.country} onChange={(e) => setConsumer({ ...consumer, country: e.target.value })} />
          </div>

        
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} placeholder="you@business.com" value={retailer.email} onChange={(e) => setRetailer({ ...retailer, email: e.target.value })} required />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input style={inputStyle} placeholder="Choose a password" type="password" value={retailer.password} onChange={(e) => setRetailer({ ...retailer, password: e.target.value })} required />
          </div>

          <div>
            <label style={labelStyle}>Owner name</label>
            <input style={inputStyle} placeholder="Owner full name" value={retailer.ownerName} onChange={(e) => setRetailer({ ...retailer, ownerName: e.target.value })} required />
          </div>

          <div>
            <label style={labelStyle}>Organization name</label>
            <input style={inputStyle} placeholder="Company Ltd." value={retailer.organizationName} onChange={(e) => setRetailer({ ...retailer, organizationName: e.target.value })} required />
          </div>

          <div>
            <label style={labelStyle}>Username</label>
            <input style={inputStyle} placeholder="username" value={retailer.username} onChange={(e) => setRetailer({ ...retailer, username: e.target.value })} required />
          </div>

          <div>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle} placeholder="+1 555 555 5555" value={retailer.phoneNumber} onChange={(e) => setRetailer({ ...retailer, phoneNumber: e.target.value })} required />
          </div>

          <div>
            <label style={labelStyle}>Date of establishment</label>
            <input style={inputStyle} type="date" value={retailer.dateOfEstablishment} onChange={(e) => setRetailer({ ...retailer, dateOfEstablishment: e.target.value })} />
          </div>

          <div>
            <label style={labelStyle}>Country</label>
            <input style={inputStyle} placeholder="Country" value={retailer.country} onChange={(e) => setRetailer({ ...retailer, country: e.target.value })} />
          </div>

         
        </div>
      )}

      <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <button type="submit" disabled={loading} style={{ padding: "10px 16px", borderRadius: 8, background: "#2563eb", color: "#fff", border: "none" }}>
          {loading ? "Creating..." : "Create"}
        </button>

        <button type="button" onClick={() => router.push("/admin")} style={{ padding: "10px 16px", borderRadius: 8, background: "#f3f4f6", border: "1px solid #e5e7eb" }}>
          Cancel
        </button>

        {message && <p style={{ marginLeft: 12, color: message.includes("Failed") ? "#dc2626" : "#16a34a" }}>{message}</p>}
      </div>
    </form>
  );
}
