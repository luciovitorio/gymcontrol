import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), userController.list);
router.post("/", requireAuth, requireRole("admin"), userController.create);

// Rotas de Perfil (precisa vir ANTES de /:id)
router.get("/me", requireAuth, userController.getProfile);
router.put("/me", requireAuth, userController.updateProfile);

router.get("/:id", requireAuth, userController.get); // owner ou admin validado no controller
router.put("/:id", requireAuth, requireRole("admin"), userController.update);
router.delete("/:id", requireAuth, requireRole("admin"), userController.remove);

export { router as userRoutes };
