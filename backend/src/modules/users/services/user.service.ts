import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { User } from "@/modules/users/models/user.model.js";
import { BadRequestException, NotFoundException } from "@/utils/appError.js";
import type {
  CreateUserDto,
  UpdateUserDto,
  ListUserQuery,
} from "../dto/user.dto.js";

const sanitize = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export async function createUserService(data: CreateUserDto) {
  const exists = await User.findOne({ where: { email: data.email } });
  if (exists) throw new BadRequestException("E-mail já em uso");
  const { password, ...rest } = data;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ ...rest, passwordHash });
  return sanitize(user);
}

export async function listUsersService(query: ListUserQuery) {
  const { page, pageSize, search, role } = query;
  const limit = Math.min(pageSize, 50);
  const offset = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (role) where.role = role;

  const { rows, count } = await User.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    attributes: ["id", "name", "email", "role", "createdAt"],
  });

  return {
    data: rows.map(sanitize),
    page,
    pageSize: limit,
    total: count,
    totalPages: Math.ceil(count / limit),
  };
}

export async function getUserService(id: number) {
  const user = await User.findByPk(id, {
    attributes: ["id", "name", "email", "role", "createdAt"],
  });
  if (!user) throw new NotFoundException("Usuário não encontrado");
  return sanitize(user);
}

export async function updateUserService(id: number, data: UpdateUserDto) {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundException("Usuário não encontrado");

  if (data.email && data.email !== user.email) {
    const exists = await User.findOne({ where: { email: data.email } });
    if (exists) throw new BadRequestException("E-mail já em uso");
  }

  const updateData: Partial<{
    name: string;
    email: string;
    role: "admin" | "coach" | "student";
    passwordHash: string;
  }> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.password)
    updateData.passwordHash = await bcrypt.hash(data.password, 12);

  await user.update(updateData);
  return sanitize(user);
}

export async function deleteUserService(id: number) {
  const deleted = await User.destroy({ where: { id } });
  if (!deleted) throw new NotFoundException("Usuário não encontrado");
}
