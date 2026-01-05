import rateLimit from "express-rate-limit";
import { ErrorCodeEnum } from "@/enums/errorCode.enum.js";
import { BadRequestException } from "@/utils/appError.js";

export const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto de janela
  max: 5, // Máximo 5 tentativas por IP no período
  message: "Muitas tentativas de login. Tente novamente em 1 minuto.",
  standardHeaders: true, // Envia headers como RateLimit-Remaining
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new BadRequestException(
        "Muitas tentativas de login. Espere 1 minuto.",
        ErrorCodeEnum.AUTH_TOO_MANY_ATTEMPTS
      )
    );
  },
});
