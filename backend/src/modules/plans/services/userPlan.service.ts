import { Op } from "sequelize";
import { UserPlan } from "@/modules/plans/models/userPlan.model.js";
import { User } from "@/modules/users/models/user.model.js";
import { Plan } from "@/modules/plans/models/plan.model.js";
import { BadRequestException, NotFoundException } from "@/utils/appError.js";
import type {
  AssignPlanDto,
  UserPlanHistoryQuery,
} from "../dto/userPlan.dto.js";

/**
 * Vincula ou troca o plano de um aluno
 * - Encerra o plano anterior (se existir)
 * - Cria novo registro em user_plans
 */
export async function assignPlanToUserService(
  userId: number,
  data: AssignPlanDto
) {
  // Validar que o usuário existe e é estudante
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundException("Usuário não encontrado");
  if (user.role !== "student") {
    throw new BadRequestException("Apenas alunos podem ter planos");
  }

  // Validar que o plano existe e está ativo
  const plan = await Plan.findByPk(data.planId);
  if (!plan) throw new NotFoundException("Plano não encontrado");
  if (!plan.isActive) {
    throw new BadRequestException("Este plano não está mais disponível");
  }

  // Encerrar plano anterior (se existir)
  const activePlan = await UserPlan.findOne({
    where: {
      userId,
      endDate: null,
    },
  });

  if (activePlan) {
    await activePlan.update({ endDate: new Date() });
  }

  // Criar novo vínculo
  const userPlan = await UserPlan.create({
    userId,
    planId: data.planId,
    startDate: new Date(),
  });

  // Retornar com dados do plano incluídos
  const result = await UserPlan.findByPk(userPlan.id, {
    include: [
      {
        model: Plan,
        as: "plan",
        attributes: ["id", "name", "description", "weeklyClassLimit", "price"],
      },
    ],
  });

  return result;
}

/**
 * Retorna o histórico de planos de um aluno
 */
export async function getUserPlanHistoryService(
  userId: number,
  query: UserPlanHistoryQuery
) {
  // Validar que o usuário existe
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundException("Usuário não encontrado");

  const { page, pageSize } = query;
  const limit = Math.min(pageSize, 50);
  const offset = (page - 1) * limit;

  const { rows, count } = await UserPlan.findAndCountAll({
    where: { userId },
    limit,
    offset,
    order: [["startDate", "DESC"]],
    include: [
      {
        model: Plan,
        as: "plan",
        attributes: ["id", "name", "description", "weeklyClassLimit", "price"],
      },
    ],
  });

  return {
    data: rows,
    page,
    pageSize: limit,
    total: count,
    totalPages: Math.ceil(count / limit),
  };
}

/**
 * Retorna o plano ativo do aluno
 */
export async function getActivePlanService(userId: number) {
  // Validar que o usuário existe
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundException("Usuário não encontrado");

  const activePlan = await UserPlan.findOne({
    where: {
      userId,
      endDate: null,
    },
    include: [
      {
        model: Plan,
        as: "plan",
        attributes: ["id", "name", "description", "weeklyClassLimit", "price"],
      },
    ],
  });

  if (!activePlan) {
    throw new NotFoundException("Este aluno não possui plano ativo");
  }

  return activePlan;
}

/**
 * Cancela o plano ativo do aluno
 */
export async function cancelActivePlanService(userId: number) {
  // Validar que o usuário existe
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundException("Usuário não encontrado");

  const activePlan = await UserPlan.findOne({
    where: {
      userId,
      endDate: null,
    },
  });

  if (!activePlan) {
    throw new NotFoundException("Este aluno não possui plano ativo");
  }

  await activePlan.update({ endDate: new Date() });
}

/**
 * Helper: Verifica se um aluno tem plano ativo
 * (útil para validações futuras, como ao se inscrever em aulas)
 */
export async function hasActivePlan(userId: number): Promise<boolean> {
  const count = await UserPlan.count({
    where: {
      userId,
      endDate: null,
    },
  });

  return count > 0;
}
