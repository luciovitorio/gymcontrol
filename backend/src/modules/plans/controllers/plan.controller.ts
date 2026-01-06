import type { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/assyncHandler.middleware.js";
import {
  createPlanSchema,
  updatePlanSchema,
  listPlanSchema,
} from "../dto/plan.dto.js";
import {
  createPlanService,
  listPlansService,
  getPlanService,
  updatePlanService,
  deletePlanService,
} from "../services/plan.service.js";

export const planController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = listPlanSchema.parse(req.query);
    const result = await listPlansService(query);
    res.json(result);
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const plan = await getPlanService(id);
    res.json(plan);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const dto = createPlanSchema.parse(req.body);
    const plan = await createPlanService(dto);
    res.status(201).json(plan);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const dto = updatePlanSchema.parse(req.body);
    const plan = await updatePlanService(id, dto);
    res.json(plan);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await deletePlanService(id);
    res.status(204).send();
  }),
};
