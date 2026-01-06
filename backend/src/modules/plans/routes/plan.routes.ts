import { Router } from "express";
import { planController } from "../controllers/plan.controller.js";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), planController.list);
router.get("/:id", requireAuth, requireRole("admin"), planController.get);
router.post("/", requireAuth, requireRole("admin"), planController.create);
router.put("/:id", requireAuth, requireRole("admin"), planController.update);
router.delete("/:id", requireAuth, requireRole("admin"), planController.remove);

export { router as planRoutes };
