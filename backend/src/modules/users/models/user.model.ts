import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "@/libs/sequelize.js";

type UserAttributes = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  cellphone?: string;
  role: "admin" | "coach" | "student";
  tokenVersion: number;
  createdAt?: Date;
  updatedAt?: Date;
};

type UserCreation = Optional<
  UserAttributes,
  "id" | "createdAt" | "updatedAt" | "tokenVersion" | "cellphone"
>;

export class User
  extends Model<UserAttributes, UserCreation>
  implements UserAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare cellphone?: string;
  declare role: "admin" | "coach" | "student";
  declare tokenVersion: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(180),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    cellphone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "coach", "student"),
      allowNull: false,
      defaultValue: "student",
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "users",
    indexes: [{ unique: true, fields: ["email"] }],
  }
);
