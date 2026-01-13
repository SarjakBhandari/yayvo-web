import { z } from "zod";

export const retailerSchema = z
  .object({
    ownerName: z.string().min(1, "Owner name is required"),
    organizationName: z.string().min(1, "Organization name is required"),
    email: z.string().email("Enter a valid email"),
    dateOfEstablishment: z.string().min(1, "Date of Establishment is required"),
    country: z.string().min(1, "Country is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RetailerData = z.infer<typeof retailerSchema>;
