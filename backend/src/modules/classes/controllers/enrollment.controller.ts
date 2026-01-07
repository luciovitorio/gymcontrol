import type { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/assyncHandler.middleware.js";
import { listEnrollmentsSchema } from "../dto/enrollment.dto.js";
import {
  enrollInClassService,
  cancelEnrollmentService,
  getUserEnrollmentsService,
  getClassEnrollmentsService,
  getClassWaitlistService,
} from "../services/enrollment.service.js";
import { ForbiddenException } from "@/utils/appError.js";

export const enrollmentController = {
  // POST /classes/:classId/enroll
  enroll: asyncHandler(async (req: Request, res: Response) => {
    const classId = Number(req.params.classId);
    const userId = req.user!.id; // Aluno logado

    const result = await enrollInClassService(userId, classId);
    res.status(201).json(result);
  }),

  // DELETE /classes/:classId/enroll
  cancel: asyncHandler(async (req: Request, res: Response) => {
    const classId = Number(req.params.classId);
    const userId = req.user!.id; // Aluno logado

    await cancelEnrollmentService(userId, classId);
    res.status(204).send();
  }),

  // GET /users/:userId/enrollments
  getUserEnrollments: asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);

    // Validação: aluno só pode ver próprias inscrições, admin vê qualquer um
    if (req.user?.role !== "admin" && req.user?.id !== userId) {
      throw new ForbiddenException(
        "Você não tem permissão para acessar estes dados"
      );
    }

    const query = listEnrollmentsSchema.parse(req.query);
    const result = await getUserEnrollmentsService(userId, query);
    res.json(result);
  }),

  // GET /classes/:classId/enrollments
  getClassEnrollments: asyncHandler(async (req: Request, res: Response) => {
    const classId = Number(req.params.classId);
    const query = listEnrollmentsSchema.parse(req.query);
    const result = await getClassEnrollmentsService(classId, query);
    res.json(result);
  }),

  // GET /classes/:classId/waitlist
  getWaitlist: asyncHandler(async (req: Request, res: Response) => {
    const classId = Number(req.params.classId);
    const result = await getClassWaitlistService(classId);
    res.json(result);
  }),
};
