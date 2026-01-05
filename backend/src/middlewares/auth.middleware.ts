import type { NextFunction, Request, Response } from "express";
import { UnauthorizedException, ForbiddenException } from "@/utils/appError.js";
import { verifyToken } from "@/utils/jwt.js";
import { User } from "@/modules/users/models/user.model.js";

export type AuthUser = { id: number; role: "admin" | "coach" | "student" };

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    throw new UnauthorizedException("Token ausente");
  const token = auth.slice("Bearer ".length);

  const payload = await verifyToken(token);
  if (!payload?.userId) throw new UnauthorizedException("Token inválido");

  const user = await User.findByPk(payload.userId, {
    attributes: ["id", "role", "tokenVersion"],
  });
  if (!user) throw new UnauthorizedException("Usuário não encontrado");

  if (!user || user.tokenVersion !== payload.tokenVersion)
    throw new UnauthorizedException("Token inválido");

  req.user = { id: user.id, role: user.role as AuthUser["role"] };
  next();
}

export const requireRole =
  (...roles: AuthUser["role"][]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new UnauthorizedException("Token inválido");
    if (!roles.includes(req.user.role))
      throw new ForbiddenException("Acesso negado");
    next();
  };
