// app/consumer/create/CreateClient.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SentimentPicker from "@/app/_components/SentimentPicker";
import { createReviewClient, uploadReviewImageClient } from "@/lib/actions/review-actions";
import { getConsumerByAuthId } from "@/lib/api/consumer";

export default function CreateClient({ userData }: { userData: any | null }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consumer, setConsumer] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!userData) return;
        const candidate = userData;
        const authId = candidate?.id ?? null;
        if (!authId) {
          console.warn("CreateClient: no auth id found in userData", userData);
          return;
        }

        const cons = await getConsumerByAuthId(authId);
        setConsumer(cons.data ?? null);
      } catch (err) {
        console.error("CreateClient: failed to load consumer", err);
        setError("Failed to load profile. Please try again.");
      }
    })();
  }, [userData]);

  useEffect(() => {
    if (!imageFile) { setImagePreview(null); return; }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    console.log(consumer);
    const consumerId = consumer?._id ?? consumer?.id;
    if (!consumerId) {
      setError("Could not determine your consumer profile. Please complete your profile or re-login.");
      return;
    }
    if (!title.trim()) { setError("Title is required."); return; }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        sentiments: selectedSentiments,
        productName: productName.trim(),
        productImage: "", // explicit empty string per backend requirement
        authorId: consumerId,
        authorLocation: consumer?.location ?? "",
      };

      const created = await createReviewClient(payload);
      const createdId = created?.data?._id ?? created?._id ?? created?.id ?? created;

      if (imageFile && createdId) {
        try { await uploadReviewImageClient(createdId, imageFile); }
        catch (uploadErr) { console.error("Image upload failed", uploadErr); setError("Review created but image upload failed."); }
      }

      router.push("/consumer/");
    } catch (err: any) {
      console.error("Create failed:", err);
      const server = err?.response?.data ?? err?.message ?? err;
      if (server?.errors) setError(server.errors.map((x: any) => `${x.param}: ${x.msg}`).join("; "));
      else if (server?.message) setError(server.message);
      else setError(typeof server === "string" ? server : JSON.stringify(server));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="content" style={{ flex: 1 }}>
      <h1>Create Review</h1>

      {error && <div style={{ color: "#b91c1c", background: "#fff5f5", padding: 8, borderRadius: 8, marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleSubmit} className="form" style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 820 }}>
        <label style={{ fontWeight: 600, color: "#374151" }}>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short, descriptive title" required style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e6e6" }} />

        <label style={{ fontWeight: 600, color: "#374151" }}>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write your review..." rows={6} style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e6e6" }} />

        <label style={{ fontWeight: 600, color: "#374151" }}>Product name</label>
        <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product name (optional)" style={{ padding: 10, borderRadius: 8, border: "1px solid #e6e6e6" }} />

        <label style={{ fontWeight: 600, color: "#374151" }}>Choose sentiments</label>
        <SentimentPicker selected={selectedSentiments} onChange={(next) => setSelectedSentiments(next)} />

        <label style={{ fontWeight: 600, color: "#374151" }}>Product image (optional)</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {imagePreview && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img src={imagePreview} alt="preview" style={{ width: 140, height: 96, objectFit: "cover", borderRadius: 8, border: "1px solid #e6e6e6" }} />
            <div style={{ fontSize: 12, color: "#6b7280" }}>Image to upload</div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
          <button type="submit" disabled={submitting} style={{ padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: "#111827", color: "#fff" }}>
            {submitting ? "Creating…" : "Create Review"}
          </button>
          <button type="button" onClick={() => router.push("/consumer/")} disabled={submitting} style={{ padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: "#e5e7eb", color: "#111827" }}>
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
