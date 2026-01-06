import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório").max(100),
  description: z.string().optional(),
  weeklyClassLimit: z
    .number("O campo limite de aulas por semana deve ser um número")
    .int()
    .min(1, "O campo limite de aulas por semana deve ser no mínimo 1"),
  price: z
    .number("O campo preço deve ser um número")
    .min(0, "O campo preço não pode ser negativo"),
  isActive: z.boolean().default(true),
});

export const updatePlanSchema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório").max(100).optional(),
  description: z.string().optional(),
  weeklyClassLimit: z
    .number("O campo limite de aulas por semana deve ser um número")
    .int()
    .min(1, "O campo limite de aulas por semana deve ser no mínimo 1")
    .optional(),
  price: z
    .number("O campo preço deve ser um número")
    .min(0, "O campo preço não pode ser negativo")
    .optional(),
  isActive: z.boolean().optional(),
});

export const listPlanSchema = z.object({
  page: z.coerce
    .number("O campo página deve ser um número")
    .min(1, "O campo página deve ser maior ou igual a 1")
    .default(1),
  pageSize: z.coerce
    .number("O campo tamanho da página deve ser um número")
    .min(1, "O campo tamanho da página deve ser maior ou igual a 1")
    .max(50, "O campo tamanho da página deve ser menor ou igual a 50")
    .default(20),
  search: z
    .string("O campo de busca deve ser uma string")
    .min(1, "O campo de busca deve ter pelo menos 1 caractere")
    .optional(),
  isActive: z.coerce.boolean("O campo ativo deve ser um booleano").optional(),
});

export type CreatePlanDto = z.infer<typeof createPlanSchema>;
export type UpdatePlanDto = z.infer<typeof updatePlanSchema>;
export type ListPlanQuery = z.infer<typeof listPlanSchema>;
