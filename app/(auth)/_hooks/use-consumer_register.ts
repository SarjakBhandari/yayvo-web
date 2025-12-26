import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ---------------- Schema ---------------- */
const consumerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Enter a valid email"),
    dob: z.string().min(1, "Date of Birth is required"),
    gender: z.enum(["Male", "Female", "Other"]),
    country: z.string().min(1, "Country is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ConsumerData = z.infer<typeof consumerSchema>;

export function useConsumerRegister() {
  const form = useForm<ConsumerData>({
    resolver: zodResolver(consumerSchema),
  });

  const onSubmit = (data: ConsumerData) => {
    console.log("Consumer Register:", data);
    alert("Registration successful!");
  };

  return {
    ...form,
    onSubmit,
  };
}
