import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "O campo nome é obrigatório")
    .max(120, "O campo nome deve ter no máximo 120 caracteres"),
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(8, "O campo senha deve ter no mínimo 8 caracteres"),
  cellphone: z.string().optional(),
  role: z.enum(["admin", "coach", "student"], "O campo perfil não é válido"),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, "O campo nome é obrigatório")
    .max(120, "O campo nome deve ter no máximo 120 caracteres")
    .optional(),
  email: z.string().email("Formato de email inválido").optional(),
  password: z
    .string()
    .min(8, "O campo senha deve ter no mínimo 8 caracteres")
    .optional(),
  cellphone: z.string().optional(),
  role: z
    .enum(["admin", "coach", "student"], "O campo perfil não é válido")
    .optional(),
});

export const listUserSchema = z.object({
  page: z.coerce
    .number()
    .min(1, "O campo página deve ser maior ou igual a 1")
    .default(1),
  pageSize: z.coerce
    .number()
    .min(1, "O campo tamanho da página deve ser maior ou igual a 1")
    .max(50, "O campo tamanho da página deve ser menor ou igual a 50")
    .default(20),
  search: z
    .string()
    .min(1, "O campo de busca deve ter pelo menos 1 caractere")
    .optional(),
  role: z.enum(["admin", "coach", "student"]).optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type ListUserQuery = z.infer<typeof listUserSchema>;
