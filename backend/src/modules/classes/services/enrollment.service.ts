import { Class } from "@/modules/classes/models/class.model.js";
import { ClassEnrollment } from "@/modules/classes/models/classEnrollment.model.js";
import { ClassWaitlist } from "@/modules/classes/models/classWaitlist.model.js";
import { User } from "@/modules/users/models/user.model.js";
import { BadRequestException, NotFoundException } from "@/utils/appError.js";
import { getActivePlanService } from "@/modules/plans/services/userPlan.service.js";
import type { ListEnrollmentsQuery } from "../dto/enrollment.dto.js";

/**
 * Inscrever aluno em uma aula
 * - Verifica plano ativo
 * - Verifica capacidade
 * - Adiciona na fila se lotado
 */
export async function enrollInClassService(userId: number, classId: number) {
  // Validar que o usuário existe e é estudante
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundException("Usuário não encontrado");
  if (user.role !== "student") {
    throw new BadRequestException("Apenas alunos podem se inscrever em aulas");
  }

  // Validar que tem plano ativo e obter detalhes (limite semanal)
  const userPlan = await getActivePlanService(userId);
  if (!userPlan.plan) {
    throw new BadRequestException("Erro ao recuperar detalhes do plano.");
  }

  // Validar que a aula existe e está ativa
  const classItem = await Class.findByPk(classId);
  if (!classItem) throw new NotFoundException("Aula não encontrada");
  if (!classItem.isActive) {
    throw new BadRequestException("Esta aula não está mais disponível");
  }

  // Verificar limite semanal de aulas
  // Lógica: Contar quantas inscrições confirmadas o usuário já tem
  // ATENÇÃO: Se as aulas são recorrentes sem data específica (modelo Agenda Semanal),
  // o limite é simplesmente quantas turmas distintas ele está inscrito.
  const currentEnrollmentsCount = await ClassEnrollment.count({
    where: {
      userId,
      status: "confirmed",
    },
  });

  if (currentEnrollmentsCount >= userPlan.plan.weeklyClassLimit) {
    throw new BadRequestException(
      `Você atingiu o limite de ${userPlan.plan.weeklyClassLimit} aulas por semana do seu plano.`
    );
  }

  // Verificar se já está inscrito
  const existingEnrollment = await ClassEnrollment.findOne({
    where: {
      classId,
      userId,
      status: "confirmed",
    },
  });

  if (existingEnrollment) {
    throw new BadRequestException("Você já está inscrito nesta aula");
  }

  // Contar inscrições confirmadas
  const confirmedCount = await ClassEnrollment.count({
    where: {
      classId,
      status: "confirmed",
    },
  });

  // Se há vaga, inscrever diretamente
  if (confirmedCount < classItem.capacity) {
    const enrollment = await ClassEnrollment.create({
      classId,
      userId,
      status: "confirmed",
    });

    return {
      enrolled: true,
      waitlist: false,
      enrollment,
    };
  }

  // Se lotado, adicionar na fila
  const waitlistCount = await ClassWaitlist.count({
    where: {
      classId,
      status: "waiting",
    },
  });

  if (waitlistCount >= classItem.waitlistLimit) {
    throw new BadRequestException(
      "A aula está lotada e a fila de espera também está cheia"
    );
  }

  // Adicionar na fila
  const waitlistEntry = await ClassWaitlist.create({
    classId,
    userId,
    position: waitlistCount + 1,
    status: "waiting",
  });

  return {
    enrolled: false,
    waitlist: true,
    position: waitlistEntry.position,
    waitlistEntry,
  };
}

/**
 * Cancelar inscrição em uma aula
 * - Marca como cancelada
 * - Promove primeiro da fila
 */
export async function cancelEnrollmentService(userId: number, classId: number) {
  const enrollment = await ClassEnrollment.findOne({
    where: {
      classId,
      userId,
      status: "confirmed",
    },
  });

  if (!enrollment) {
    throw new NotFoundException("Inscrição não encontrada");
  }

  // Marcar como cancelada
  await enrollment.update({
    status: "cancelled",
    cancelledAt: new Date(),
  });

  // Promover primeiro da fila
  await promoteFromWaitlist(classId);
}

/**
 * Promove o primeiro da fila de espera para a aula
 */
async function promoteFromWaitlist(classId: number) {
  const firstInLine = await ClassWaitlist.findOne({
    where: {
      classId,
      status: "waiting",
    },
    order: [["position", "ASC"]],
  });

  if (!firstInLine) return; // Sem ninguém na fila

  // Criar inscrição
  await ClassEnrollment.create({
    classId,
    userId: firstInLine.userId,
    status: "confirmed",
  });

  // Marcar como promovido na fila
  await firstInLine.update({
    status: "promoted",
  });

  // TODO: Enviar notificação WhatsApp para o usuário
  console.log(`Usuário ${firstInLine.userId} promovido para aula ${classId}`);
}

/**
 * Listar inscrições de um aluno
 */
export async function getUserEnrollmentsService(
  userId: number,
  query: ListEnrollmentsQuery
) {
  const { page, pageSize, status } = query;
  const limit = Math.min(pageSize, 50);
  const offset = (page - 1) * limit;

  const where: any = { userId };
  if (status) where.status = status;

  const { rows, count } = await ClassEnrollment.findAndCountAll({
    where,
    limit,
    offset,
    order: [["enrolledAt", "DESC"]],
    include: [
      {
        model: Class,
        as: "class",
        include: [
          {
            model: User,
            as: "coach",
            attributes: ["id", "name"],
          },
        ],
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
 * Listar inscritos de uma aula
 */
export async function getClassEnrollmentsService(
  classId: number,
  query: ListEnrollmentsQuery
) {
  const { page, pageSize, status } = query;
  const limit = Math.min(pageSize, 50);
  const offset = (page - 1) * limit;

  const where: any = { classId };
  if (status) where.status = status;

  const { rows, count } = await ClassEnrollment.findAndCountAll({
    where,
    limit,
    offset,
    order: [["enrolledAt", "ASC"]],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "cellphone"],
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
 * Ver fila de espera de uma aula
 */
export async function getClassWaitlistService(classId: number) {
  const waitlist = await ClassWaitlist.findAll({
    where: {
      classId,
      status: "waiting",
    },
    order: [["position", "ASC"]],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "cellphone"],
      },
    ],
  });

  return waitlist;
}
