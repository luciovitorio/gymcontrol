import { Router } from "express";
import { enrollmentController } from "../controllers/enrollment.controller.js";
import { requireAuth, requireRole } from "@/middlewares/auth.middleware.js";

const router = Router();

// Inscrever-se em aula - aluno autenticado
router.post(
  "/classes/:classId/enroll",
  requireAuth,
  requireRole("student"),
  enrollmentController.enroll
);

// Cancelar inscrição - aluno autenticado
router.delete(
  "/classes/:classId/enroll",
  requireAuth,
  requireRole("student"),
  enrollmentController.cancel
);

// Ver minhas inscrições - validado no controller
router.get(
  "/users/:userId/enrollments",
  requireAuth,
  enrollmentController.getUserEnrollments
);

// Ver inscritos de uma aula - coach ou admin
router.get(
  "/classes/:classId/enrollments",
  requireAuth,
  requireRole("admin", "coach"),
  enrollmentController.getClassEnrollments
);

// Ver fila de espera - coach ou admin
router.get(
  "/classes/:classId/waitlist",
  requireAuth,
  requireRole("admin", "coach"),
  enrollmentController.getWaitlist
);

export { router as enrollmentRoutes };
