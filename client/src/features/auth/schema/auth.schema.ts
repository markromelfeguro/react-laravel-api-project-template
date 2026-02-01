import { z } from 'zod';

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  password: z.string()
    .min(8, "8-16 characters required")
    .max(16, "8-16 characters required")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[a-z]/, "Include a lowercase letter")
    .regex(/[0-9]/, "Include a number")
    .regex(/[@#$%!]/, "Include a symbol (@#$%!)"),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;