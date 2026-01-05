import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8),
  cellphone: z.string().optional(),
  role: z.enum(["admin", "coach", "student"]),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  cellphone: z.string().optional(),
  role: z.enum(["admin", "coach", "student"]).optional(),
});

export const listUserSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(20),
  search: z.string().min(1).optional(),
  role: z.enum(["admin", "coach", "student"]).optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type ListUserQuery = z.infer<typeof listUserSchema>;
