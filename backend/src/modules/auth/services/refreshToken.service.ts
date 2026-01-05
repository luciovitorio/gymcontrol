// src/modules/auth/refresh-token.service.ts
import { createTokens } from "@/utils/jwt.js";
import { verifyRefreshToken } from "@/utils/jwt.js";
import { UnauthorizedException } from "@/utils/appError.js";
import { RefreshToken } from "../models/refreshToken.model.js";
import { User } from "@/modules/users/models/user.model.js";
import { sequelize } from "@/libs/sequelize.js";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function refreshTokenService(oldRefreshToken: string) {
  // 1. Verifica se o token existe no banco e não expirou
  const tokenRecord = await RefreshToken.findOne({
    where: { token: oldRefreshToken },
    include: [
      { model: User, as: "user", attributes: ["id", "role", "tokenVersion"] },
    ],
  });

  if (!tokenRecord || tokenRecord.expiresAt.getTime() <= Date.now()) {
    throw new UnauthorizedException("Refresh token inválido ou expirado");
  }

  // 2. Verifica a assinatura
  const payload = await verifyRefreshToken(oldRefreshToken);
  if (!payload) {
    throw new UnauthorizedException("Token corrompido");
  }

  // 3. Gera novos tokens
  const { accessToken, refreshToken: newRefreshToken } = await createTokens(
    tokenRecord.userId,
    tokenRecord.user?.role ?? "student",
    tokenRecord.user?.tokenVersion ?? 0
  );

  // 4. Invalida o antigo e salva o novo (rotação de refresh token)
  await sequelize.transaction(async (t) => {
    await tokenRecord.destroy({ transaction: t });
    await RefreshToken.create(
      {
        token: newRefreshToken,
        userId: tokenRecord.userId,
        expiresAt: new Date(Date.now() + SEVEN_DAYS_MS),
      },
      { transaction: t }
    );
  });

  return { accessToken, refreshToken: newRefreshToken };
}
