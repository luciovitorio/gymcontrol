import { z } from "zod";

export const logoutSchema = z.object({
  refreshToken: z
    .string("Token obrigatório para logout")
    .refine((val) => val.trim().length > 0, {
      message: "Token não pode ser vazio",
    }),
});

export type LogoutDto = z.infer<typeof logoutSchema>;
