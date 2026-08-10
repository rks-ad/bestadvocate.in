import { z } from "zod";

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Name is too long"),
  mobile: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine(
      (v) => /^(\+91)?[6-9]\d{9}$/.test(v),
      "Enter a valid 10-digit Indian mobile number",
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .max(120),
  caseDescription: z
    .string()
    .trim()
    .min(20, "Please describe your case in at least 20 characters")
    .max(5000, "Description is too long"),
});

export const otpVerifySchema = z.object({
  sessionId: z.string().min(8).max(64),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit OTP"),
});

export type LeadInput = z.infer<typeof leadSchema>;
