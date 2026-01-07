import type { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/assyncHandler.middleware.js";
import {
  assignPlanSchema,
  userPlanHistorySchema,
} from "../dto/userPlan.dto.js";
import {
  assignPlanToUserService,
  getUserPlanHistoryService,
  getActivePlanService,
  cancelActivePlanService,
} from "../services/userPlan.service.js";
import { ForbiddenException } from "@/utils/appError.js";

export const userPlanController = {
  // POST /users/:userId/plans
  assign: asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const dto = assignPlanSchema.parse(req.body);
    const result = await assignPlanToUserService(userId, dto);
    res.status(201).json(result);
  }),

  // GET /users/:userId/plans
  getHistory: asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);

    // Validação: aluno só pode ver próprio histórico, admin vê qualquer um
    if (req.user?.role !== "admin" && req.user?.id !== userId) {
      throw new ForbiddenException(
        "Você não tem permissão para acessar estes dados"
      );
    }

    const query = userPlanHistorySchema.parse(req.query);
    const result = await getUserPlanHistoryService(userId, query);
    res.json(result);
  }),

  // GET /users/:userId/plans/active
  getActive: asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);

    // Validação: aluno só pode ver próprio plano, admin e coach veem qualquer um
    if (req.user?.role === "student" && req.user?.id !== userId) {
      throw new ForbiddenException(
        "Você não tem permissão para acessar estes dados"
      );
    }

    const result = await getActivePlanService(userId);
    res.json(result);
  }),

  // DELETE /users/:userId/plans/active
  cancel: asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    await cancelActivePlanService(userId);
    res.status(204).send();
  }),
};
