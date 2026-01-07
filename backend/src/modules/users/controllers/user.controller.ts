import type { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/assyncHandler.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
  listUserSchema,
} from "../dto/user.dto.js";
import {
  createUserService,
  listUsersService,
  getUserService,
  updateUserService,
  deleteUserService,
} from "../services/user.service.js";
import { ForbiddenException } from "@/utils/appError.js";

export const userController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = listUserSchema.parse(req.query);
    const result = await listUsersService(query);
    res.json(result);
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (req.user?.role !== "admin" && req.user?.id !== id) {
      throw new ForbiddenException("Acesso negado");
    }
    const user = await getUserService(id);
    res.json(user);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const dto = createUserSchema.parse(req.body);
    const user = await createUserService(dto);
    res.status(201).json(user);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const dto = updateUserSchema.parse(req.body);
    const user = await updateUserService(id, dto);
    res.json(user);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await deleteUserService(id);
    res.status(204).send();
  }),

  // === Profile Methods ===
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const id = req.user!.id; // Garantido pelo requireAuth
    const user = await getUserService(id);
    res.json(user);
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const id = req.user!.id;
    // Remove "role" do body para evitar escalação de privilégio
    const { role, ...safeData } = updateUserSchema.parse(req.body);

    // Chama o service. O service faz hash da senha se vier no safeData.
    const user = await updateUserService(id, safeData);
    res.json(user);
  }),
};
