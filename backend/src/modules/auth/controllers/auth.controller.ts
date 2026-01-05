import { asyncHandler } from "@/middlewares/assyncHandler.middleware.js";
import type { Request, Response } from "express";
import { loginSchema } from "../dto/login.dto.js";
import { loginService } from "../services/login.service.js";
import { UnauthorizedException } from "@/utils/appError.js";
import { refreshTokenService } from "../services/refreshToken.service.js";
import { logoutService } from "../services/logout.service.js";
import { logoutSchema } from "../dto/logout.dto.js";
import { config } from "@/configs/app.config.js";

const cookieOptions = {
  httpOnly: true,
  secure: config.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);
    const result = await loginService(email, password);
    res
      .cookie("refreshToken", result.refreshToken, cookieOptions)
      .json({ user: result.user, accessToken: result.accessToken });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const tokenFromCookie = req.cookies?.refreshToken;
    if (!tokenFromCookie)
      throw new UnauthorizedException("Refresh token obrigatório");

    const tokens = await refreshTokenService(tokenFromCookie);

    res
      .cookie("refreshToken", tokens.refreshToken, cookieOptions)
      .json({ accessToken: tokens.accessToken });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const token =
      req.cookies?.refreshToken ?? logoutSchema.parse(req.body).refreshToken;
    await logoutService(token);
    res.clearCookie("refreshToken", {
      path: "/auth",
      sameSite: "lax",
      secure: config.NODE_ENV === "production",
      httpOnly: true,
    });
    res.status(204).send();
  }),
};
