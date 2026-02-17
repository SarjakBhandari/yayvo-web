import SentimentPicker from "@/app/_components/SentimentPicker";
import { useState } from "react";

export function ReviewEditForm({ review, onSave, onCancel }: { review: any; onSave: (updates:any)=>void; onCancel:()=>void }) {
  const [title, setTitle] = useState(review.title);
  const [description, setDescription] = useState(review.description);
  const [productName, setProductName] = useState(review.productName ?? "");
  const [sentiments, setSentiments] = useState(review.sentiments ?? []);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [preview, setPreview] = useState<string|null>(review.image ?? null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const updates = { title, description, productName, sentiments };
    // call onSave with updates and imageFile
    await onSave({ ...updates, imageFile });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" />
      <input value={productName} onChange={e=>setProductName(e.target.value)} placeholder="Product name" />
      <SentimentPicker selected={sentiments} onChange={setSentiments} />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" className="w-32 h-24 object-cover rounded" />}
      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
      </div>
    </form>
  );
}
