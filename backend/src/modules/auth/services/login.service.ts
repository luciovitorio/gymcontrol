import { ErrorCodeEnum } from "@/enums/errorCode.enum.js";
import { UnauthorizedException } from "@/utils/appError.js";
import { createTokens } from "@/utils/jwt.js";
import { User } from "@/modules/users/models/user.model.js";
import bcrypt from "bcrypt";
import { RefreshToken } from "../models/refreshToken.model.js";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function loginService(email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    where: {
      email: normalizedEmail,
    },
    attributes: ["id", "name", "email", "passwordHash", "role", "tokenVersion"],
  });

  if (!user) {
    throw new UnauthorizedException(
      "E-mail ou senha incorretos",
      ErrorCodeEnum.AUTH_USER_NOT_FOUND
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedException(
      "E-mail ou senha incorretos",
      ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS
    );
  }

  const { accessToken, refreshToken } = await createTokens(
    user.id,
    user.role,
    user.tokenVersion
  );

  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + SEVEN_DAYS_MS),
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}
