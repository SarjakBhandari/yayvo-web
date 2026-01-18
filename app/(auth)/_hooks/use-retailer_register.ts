"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RetailerData, retailerSchema } from "../_schema/retailer.schema";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleRegisterRetailer } from "@/lib/actions/auth-actions";
import { AuthResponse } from "@/app/types/auth"; // define same type as for consumer

export function useRetailerRegister(onSuccess?: (res: AuthResponse) => void) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errs, setError] = useState("");

  const form = useForm<RetailerData>({
    resolver: zodResolver(retailerSchema),
  });

  const onSubmit = async (data: RetailerData) => {
    setError("");
    try {
      const res = await handleRegisterRetailer(data);

      if (!res.success) {
        throw new Error(res.message || "Registration Failed");
      }

      if (onSuccess) onSuccess(res);

      startTransition(() => {
        router.push(`/login`);
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration Failed");
      }
    }
  };

  return {
    ...form,
    onSubmit,
    errs,
    isPending,
  };
}
