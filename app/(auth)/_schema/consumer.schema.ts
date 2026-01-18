import { z } from "zod";

export const consumerSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    phoneNumber: z.string().min(7, "Phone number is required"),
    email: z.string().email("Enter a valid email"),
    dob: z.string().optional(), // optional
    gender: z.enum(["Male", "Female", "Other"]),
    country: z.string().min(1, "Country is required"),
    profilePicture: z.string().url("Must be a valid URL").optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ConsumerData = z.infer<typeof consumerSchema>;
