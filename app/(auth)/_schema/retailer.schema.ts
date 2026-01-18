import { z } from "zod";

export const retailerSchema = z
  .object({
    ownerName: z.string().min(1, "Owner name is required"),
    organizationName: z.string().min(1, "Organization name is required"),
    email: z.string().email("Enter a valid email"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    phoneNumber: z.string().min(5, "Phone number must be at least 5 digits"),
    dateOfEstablishment: z.string().optional(),
    country: z.string().optional(),
    profilePicture: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RetailerData = z.infer<typeof retailerSchema>;
