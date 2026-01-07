import type { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/assyncHandler.middleware.js";
import {
  createClassSchema,
  updateClassSchema,
  listClassSchema,
} from "../dto/class.dto.js";
import {
  createClassService,
  listClassesService,
  getClassService,
  updateClassService,
  deleteClassService,
} from "../services/class.service.js";
import { ForbiddenException } from "@/utils/appError.js";

export const classController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = listClassSchema.parse(req.query);
    const result = await listClassesService(query);
    res.json(result);
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const classItem = await getClassService(id);
    res.json(classItem);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const dto = createClassSchema.parse(req.body);
    const classItem = await createClassService(dto);
    res.status(201).json(classItem);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const dto = updateClassSchema.parse(req.body);

    // Validação: apenas admin ou o próprio coach pode editar
    const classItem = await getClassService(id);
    if (req.user?.role !== "admin" && req.user?.id !== classItem.coachId) {
      throw new ForbiddenException(
        "Apenas o professor responsável ou admin podem editar esta aula"
      );
    }

    const result = await updateClassService(id, dto);
    res.json(result);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await deleteClassService(id);
    res.status(204).send();
  }),
};
