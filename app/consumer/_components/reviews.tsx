"use client";
import React, { useEffect, useState } from "react";
import { getReviewsPaginated, updateReview, deleteReview } from "@/lib/api/reviews";
import { Edit, Trash, X } from "lucide-react";

export default function ConsumerReviews({ authId }: { authId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", sentiments: "" });

  useEffect(() => {
    (async () => {
      const resp = await getReviewsPaginated({ page: 1, size: 20, authorId: authId });
      setReviews(resp?.items ?? []);
    })();
  }, [authId]);

  async function handleDelete(id: string) {
    await deleteReview(id);
    setReviews((s) => s.filter((r) => r._id !== id));
    setSelected(null);
  }

  async function handleSaveEdit(id: string) {
    const updates = {
      title: form.title,
      description: form.description,
      sentiments: form.sentiments.split(",").map((s) => s.trim()),
    };
    const updated = await updateReview(id, updates);
    setReviews((s) => s.map((r) => (r._id === id ? updated : r)));
    setEditing(false);
    setSelected(null);
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-6">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer transition"
              onClick={() => {
                setSelected(r);
                setForm({
                  title: r.title ?? "",
                  description: r.description ?? "",
                  sentiments: (r.sentiments ?? []).join(", "),
                });
              }}
            >
              {r.image ? (
                <img
                  src={r.image}
                  alt={r.title ?? "Review image"}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{r.title ?? "Untitled Review"}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {r.description ?? "No description provided"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>

            {!editing ? (
              <>
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt={selected.title ?? "Review image"}
                    className="w-full h-64 object-cover rounded mb-4"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 mb-4">
                    No image available
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{selected.title ?? "Untitled Review"}</h3>
                <p className="mb-4 text-gray-700">{selected.description ?? "No description provided"}</p>
                <p className="mb-2 text-sm text-gray-500">
                  Product: {selected.productName ?? "No product name"}
                </p>
                <p className="mb-2 text-sm text-gray-500">
                </p>
                <p className="mb-2 text-sm text-gray-500">
                </p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {(selected.sentiments ?? []).length > 0 ? (
                    (selected.sentiments ?? []).map((s: string, idx: number) => (
                      <span
                        key={`${s}-${idx}`}
                        className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700"
                      >
                        #{s}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No sentiments</span>
                  )}
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => setEditing(true)}
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(selected._id)}
                  >
                    <Trash size={16} /> Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-4">Edit Review</h3>
                <input
                  className="border rounded w-full p-2 mb-2"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Title"
                />
                <textarea
                  className="border rounded w-full p-2 mb-2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description"
                />
                <input
                  className="border rounded w-full p-2 mb-2"
                  value={form.sentiments}
                  onChange={(e) => setForm({ ...form, sentiments: e.target.value })}
                  placeholder="Sentiments (comma separated)"
                />
                <div className="flex justify-end gap-4">
                  <button
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => handleSaveEdit(selected._id)}
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
