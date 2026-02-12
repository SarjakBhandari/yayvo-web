"use client";
import { createProduct, CreateProductPayload, uploadProductImage } from "@/lib/api/products";
import { getUserData } from "@/lib/cookie";
import { getRetailerByAuthId } from "@/lib/api/retailer";
import { useCallback, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function useCreateProduct(onCreated?: (created: any) => void) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [retailerAuthId, setRetailerAuthId] = useState<string>("");
  const [retailerName, setRetailerName] = useState<string>("");
  const [retailerIcon, setRetailerIcon] = useState<string>("");
  const [targetSentiment, setTargetSentiment] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load retailer info from cookie/API on mount
  useEffect(() => {
    (async () => {
      try {
        const user = await getUserData();
        if (!user?.id) return toast.error("Retailer not found in cookies");

        setRetailerAuthId(user.id);

        // Fetch retailer data from API
        const retailer = await getRetailerByAuthId(user.id);
        setRetailerName(retailer?.name || "");
        setRetailerIcon(retailer?.profilePicture || "");
      } catch (err) {
        console.error("Failed to fetch retailer data", err);
        toast.error("Failed to fetch retailer data");
      }
    })();
  }, []);

  const handleTitle = useCallback((e: any) => setTitle(e.target.value), []);
  const handleDescription = useCallback((e: any) => setDescription(e.target.value), []);
  const handleFile = useCallback((e: any) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  }, []);

  const toggleSentiment = useCallback((s: string) => {
    setTargetSentiment((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }, []);

  const handleSubmit = useCallback(async () => {
    setErrors({});
    if (!title) {
      setErrors((e: any) => ({ ...e, title: "Title is required" }));
      return toast.error("Title is required");
    }
    if (!retailerAuthId) {
      setErrors((e: any) => ({ ...e, general: "Retailer not found" }));
      return toast.error("Retailer not found");
    }

    setIsSubmitting(true);
    try {
      const payload: CreateProductPayload = {
        title,
        description,
        retailerAuthId,
        retailerName,
        retailerIcon,
        targetSentiment,
      };

      const created = await createProduct(payload);
      const productId = created._id || (created as any).id;

      if (file && productId) {
        await uploadProductImage(productId, file);
      }

      toast.success("Product created successfully!");
      if (onCreated) onCreated(created);

      setTitle("");
      setDescription("");
      setTargetSentiment([]);
      setFile(null);
    } catch (err: any) {
      console.error("Create product failed", err);
      const message = err?.response?.data?.message || err.message || "Failed to create product";
      setErrors((e: any) => ({ ...e, general: message }));
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, retailerAuthId, retailerName, retailerIcon, targetSentiment, file, onCreated]);

  return {
    title,
    description,
    retailerAuthId,
    retailerName,
    retailerIcon,
    targetSentiment,
    file,
    errors,
    isSubmitting,
    handleTitle,
    handleDescription,
    handleFile,
    toggleSentiment,
    handleSubmit,
    setRetailerAuthId,
    setRetailerName,
    setRetailerIcon,
  };
}
