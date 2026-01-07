import { z } from "zod";

export const enrollInClassSchema = z.object({
  classId: z
    .number({ message: "O campo aula é obrigatório" })
    .int("O ID da aula deve ser um número inteiro")
    .positive("O ID da aula deve ser positivo"),
});

export const listEnrollmentsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(20),
  status: z.enum(["confirmed", "cancelled", "no_show"]).optional(),
});

export type EnrollInClassDto = z.infer<typeof enrollInClassSchema>;
export type ListEnrollmentsQuery = z.infer<typeof listEnrollmentsSchema>;
