import { z } from "zod";

export const assignPlanSchema = z.object({
  planId: z
    .number({ message: "O campo plano é obrigatório" })
    .int("O ID do plano deve ser um número inteiro")
    .positive("O ID do plano deve ser positivo"),
});

export const userPlanHistorySchema = z.object({
  page: z.coerce
    .number("O campo página deve ser um número")
    .min(1, "O campo página deve ser maior ou igual a 1")
    .default(1),
  pageSize: z.coerce
    .number("O campo tamanho da página deve ser um número")
    .min(1, "O campo tamanho da página deve ser maior ou igual a 1")
    .max(50, "O campo tamanho da página deve ser menor ou igual a 50")
    .default(20),
});

export type AssignPlanDto = z.infer<typeof assignPlanSchema>;
export type UserPlanHistoryQuery = z.infer<typeof userPlanHistorySchema>;
