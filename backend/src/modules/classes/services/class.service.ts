import { Op } from "sequelize";
import { Class } from "@/modules/classes/models/class.model.js";
import { User } from "@/modules/users/models/user.model.js";
import { ClassEnrollment } from "@/modules/classes/models/classEnrollment.model.js";
import { BadRequestException, NotFoundException } from "@/utils/appError.js";
import type {
  CreateClassDto,
  UpdateClassDto,
  ListClassQuery,
} from "../dto/class.dto.js";

export async function createClassService(data: CreateClassDto) {
  // Validar que o coach existe e é coach
  const coach = await User.findByPk(data.coachId);
  if (!coach) throw new NotFoundException("Professor não encontrado");
  if (coach.role !== "coach") {
    throw new BadRequestException("O usuário selecionado não é um professor");
  }

  // Validar horários
  if (data.startTime >= data.endTime) {
    throw new BadRequestException(
      "O horário de término deve ser após o horário de início"
    );
  }

  const { description, ...rest } = data;
  const classItem = await Class.create({
    ...rest,
    ...(description && { description }),
  });

  // Retornar com dados do coach
  const result = await Class.findByPk(classItem.id, {
    include: [
      {
        model: User,
        as: "coach",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  return result;
}

export async function listClassesService(query: ListClassQuery) {
  const { page, pageSize, dayOfWeek, coachId, isActive } = query;
  const limit = Math.min(pageSize, 50);
  const offset = (page - 1) * limit;

  const where: any = {};
  if (dayOfWeek !== undefined) where.dayOfWeek = dayOfWeek;
  if (coachId !== undefined) where.coachId = coachId;
  if (isActive !== undefined) where.isActive = isActive;

  const { rows, count } = await Class.findAndCountAll({
    where,
    limit,
    offset,
    order: [
      ["dayOfWeek", "ASC"],
      ["startTime", "ASC"],
    ],
    include: [
      {
        model: User,
        as: "coach",
        attributes: ["id", "name", "email"],
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

export async function getClassService(id: number) {
  const classItem = await Class.findByPk(id, {
    include: [
      {
        model: User,
        as: "coach",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  if (!classItem) throw new NotFoundException("Aula não encontrada");
  return classItem;
}

export async function updateClassService(id: number, data: UpdateClassDto) {
  const classItem = await Class.findByPk(id);
  if (!classItem) throw new NotFoundException("Aula não encontrada");

  // Se está alterando o coach, validar
  if (data.coachId && data.coachId !== classItem.coachId) {
    const coach = await User.findByPk(data.coachId);
    if (!coach) throw new NotFoundException("Professor não encontrado");
    if (coach.role !== "coach") {
      throw new BadRequestException("O usuário selecionado não é um professor");
    }
  }

  // Validar horários se estiver alterando
  const startTime = data.startTime || classItem.startTime;
  const endTime = data.endTime || classItem.endTime;
  if (startTime >= endTime) {
    throw new BadRequestException(
      "O horário de término deve ser após o horário de início"
    );
  }

  // Construir objeto de update apenas com campos definidos
  const updateData: Partial<{
    name: string;
    description: string;
    coachId: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    capacity: number;
    waitlistLimit: number;
    isActive: boolean;
  }> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.coachId !== undefined) updateData.coachId = data.coachId;
  if (data.dayOfWeek !== undefined) updateData.dayOfWeek = data.dayOfWeek;
  if (data.startTime !== undefined) updateData.startTime = data.startTime;
  if (data.endTime !== undefined) updateData.endTime = data.endTime;
  if (data.capacity !== undefined) updateData.capacity = data.capacity;
  if (data.waitlistLimit !== undefined)
    updateData.waitlistLimit = data.waitlistLimit;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  await classItem.update(updateData);

  // Retornar com dados do coach
  const result = await Class.findByPk(id, {
    include: [
      {
        model: User,
        as: "coach",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  return result;
}

export async function deleteClassService(id: number) {
  const classItem = await Class.findByPk(id);
  if (!classItem) throw new NotFoundException("Aula não encontrada");

  // Verificar se há inscrições ativas
  const activeEnrollments = await ClassEnrollment.count({
    where: {
      classId: id,
      status: "confirmed",
    },
  });

  if (activeEnrollments > 0) {
    throw new BadRequestException(
      "Não é possível deletar uma aula com inscrições ativas"
    );
  }

  await classItem.destroy();
}
