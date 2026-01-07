import { Router } from "express";
import { userPlanController } from "../controllers/userPlan.controller.js";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware.js";

const router = Router();

// Vincular/trocar plano - apenas admin
router.post(
  "/users/:userId/plans",
  requireAuth,
  requireRole("admin"),
  userPlanController.assign
);

// Ver histórico - admin ou o próprio aluno
router.get("/users/:userId/plans", requireAuth, userPlanController.getHistory);

// Ver plano ativo - admin, coach ou o próprio aluno
router.get(
  "/users/:userId/plans/active",
  requireAuth,
  userPlanController.getActive
);

// Cancelar plano - apenas admin
router.delete(
  "/users/:userId/plans/active",
  requireAuth,
  requireRole("admin"),
  userPlanController.cancel
);

export { router as userPlanRoutes };
