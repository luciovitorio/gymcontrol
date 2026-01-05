import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("E-mail inválido").min(1, "Campo obrigatório"),
  password: z.string("Campo obrigatório"),
});

export type LoginDto = z.infer<typeof loginSchema>;
