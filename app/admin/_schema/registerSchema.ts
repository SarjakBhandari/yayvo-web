// admin/schema/registerSchemas.ts
import { z } from "zod";

export const RegisterConsumerDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
  username: z.string().min(3),
  phoneNumber: z.string().min(5),
  dob: z.string(),
  gender: z.string(),
  country: z.string(),
  profilePicture: z.string().optional()
});
export type RegisterConsumerInput = z.infer<typeof RegisterConsumerDto>;

export const RegisterRetailerDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  ownerName: z.string().min(1),
  organizationName: z.string().min(1),
  username: z.string().min(3),
  phoneNumber: z.string().min(5),
  dateOfEstablishment: z.string(),
  country: z.string(),
  profilePicture: z.string().optional()
});
export type RegisterRetailerInput = z.infer<typeof RegisterRetailerDto>;
