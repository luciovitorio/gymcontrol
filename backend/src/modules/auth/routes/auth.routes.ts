import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { loginRateLimiter } from "@/middlewares/loginRateLimit.middleware.js";

const router = Router();

router.post("/login", loginRateLimiter, authController.login);
router.post("/refresh-token", authController.refresh);
router.post("/logout", authController.logout);

export { router as authRoutes };
