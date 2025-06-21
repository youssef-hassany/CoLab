import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(3, "identifier must be at least 3 characters"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
