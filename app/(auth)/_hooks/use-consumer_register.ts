"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumerData, consumerSchema } from "../_schema/consumer.schema";
import { handleRegisterConsumer } from "@/lib/actions/auth-actions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AuthResponse } from "@/app/types/auth";


export function useConsumerRegister(onSuccess?: (res: AuthResponse) => void) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errs, setError] = useState("");

  const form = useForm<ConsumerData>({
    resolver: zodResolver(consumerSchema),
  });

  const onSubmit = async (data: ConsumerData) => {
    setError("");
    try {
      const res = await handleRegisterConsumer(data);

      if (!res.success) {
        throw new Error(res.message || "Registration Failed");
      }

      localStorage.setItem("authToken", res.token);

      // optional success callback
      if (onSuccess) onSuccess(res);

      // redirect based on user role/type
      const userType = res.user?.role || "consumer";
      startTransition(() => {
        router.push(`/welcome/${userType}`);
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
