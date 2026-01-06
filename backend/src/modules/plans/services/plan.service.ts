import { Op } from "sequelize";
import { Plan } from "@/modules/plans/models/plan.model.js";
import { BadRequestException, NotFoundException } from "@/utils/appError.js";
import type {
  CreatePlanDto,
  UpdatePlanDto,
  ListPlanQuery,
} from "../dto/plan.dto.js";
import { UserPlan } from "@/modules/plans/models/userPlan.model.js";

export async function createPlanService(data: CreatePlanDto) {
  const exists = await Plan.findOne({ where: { name: data.name } });

  if (exists) throw new BadRequestException("Já existe um plano com esse nome");

  const plan = await Plan.create(data);

  return plan;
}

export async function listPlansService(query: ListPlanQuery) {
  const { page, pageSize, search, isActive } = query;
  const limit = Math.min(pageSize, 50);
  const offset = (page - 1) * limit;
  const where: any = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (isActive !== undefined) where.isActive = isActive;

  const { rows, count } = await Plan.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
  return {
    data: rows,
    page,
    pageSize: limit,
    total: count,
    totalPages: Math.ceil(count / limit),
  };
}

export async function getPlanService(id: number) {
  const plan = await Plan.findByPk(id);

  if (!plan) throw new NotFoundException("Plano não encontrado");

  return plan;
}

export async function updatePlanService(id: number, data: UpdatePlanDto) {
  const plan = await Plan.findByPk(id);

  if (!plan) throw new NotFoundException("Plano não encontrado");

  if (data.name && data.name !== plan.name) {
    const exists = await Plan.findOne({ where: { name: data.name } });
    if (exists)
      throw new BadRequestException("Já existe um plano com esse nome");
  }

  await plan.update(data);

  return plan;
}

export async function deletePlanService(id: number) {
  const plan = await Plan.findByPk(id);

  if (!plan) throw new NotFoundException("Plano não encontrado");

  // Verificar se há alunos vinculados a este plano
  const activeUserPlans = await UserPlan.count({
    where: {
      planId: id,
      endDate: null,
    },
  });

  if (activeUserPlans > 0) {
    throw new BadRequestException(
      "Não é possível deletar um plano com alunos ativos vinculados"
    );
  }

  await plan.destroy();
}
