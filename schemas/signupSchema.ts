import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(2, "username must be at least 2 characters")
    .max(50, "username must be at most 50 characters"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .min(3, "Email must be at least 3 characters"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export type SignupSchema = z.infer<typeof signupSchema>;
