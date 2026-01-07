import { Router } from "express";
import { classController } from "../controllers/class.controller.js";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware.js";

const router = Router();

// Listar e ver detalhes - qualquer usuário autenticado
router.get("/", requireAuth, classController.list);
router.get("/:id", requireAuth, classController.get);

// Criar - apenas admin
router.post("/", requireAuth, requireRole("admin"), classController.create);

// Editar - admin ou coach responsável (validado no controller)
router.put("/:id", requireAuth, classController.update);

// Deletar - apenas admin
router.delete(
  "/:id",
  requireAuth,
  requireRole("admin"),
  classController.remove
);

export { router as classRoutes };
