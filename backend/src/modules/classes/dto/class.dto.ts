import { z } from "zod";

export const createClassSchema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório").max(100),
  description: z.string().optional(),
  coachId: z
    .number({ message: "O campo professor é obrigatório" })
    .int("O ID do professor deve ser um número inteiro")
    .positive("O ID do professor deve ser positivo"),
  dayOfWeek: z
    .number({ message: "O campo dia da semana é obrigatório" })
    .int()
    .min(0, "Dia da semana deve ser entre 0 (Domingo) e 6 (Sábado)")
    .max(6, "Dia da semana deve ser entre 0 (Domingo) e 6 (Sábado)"),
  startTime: z
    .string({ message: "O campo horário de início é obrigatório" })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato inválido. Use HH:MM"),
  endTime: z
    .string({ message: "O campo horário de término é obrigatório" })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato inválido. Use HH:MM"),
  capacity: z
    .number({ message: "O campo capacidade é obrigatório" })
    .int()
    .min(1, "A capacidade deve ser no mínimo 1"),
  waitlistLimit: z
    .number()
    .int()
    .min(0, "O limite da fila deve ser no mínimo 0")
    .default(5),
  isActive: z.boolean().default(true),
});

export const updateClassSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  coachId: z.number().int().positive().optional(),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato inválido. Use HH:MM")
    .optional(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato inválido. Use HH:MM")
    .optional(),
  capacity: z.number().int().min(1).optional(),
  waitlistLimit: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const listClassSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(20),
  dayOfWeek: z.coerce.number().int().min(0).max(6).optional(),
  coachId: z.coerce.number().int().positive().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CreateClassDto = z.infer<typeof createClassSchema>;
export type UpdateClassDto = z.infer<typeof updateClassSchema>;
export type ListClassQuery = z.infer<typeof listClassSchema>;
