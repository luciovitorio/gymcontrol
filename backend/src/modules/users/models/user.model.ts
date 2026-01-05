import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "@/libs/sequelize.js";

type UserAttributes = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "coach" | "student";
  createdAt?: Date;
  updatedAt?: Date;
};

type UserCreation = Optional<UserAttributes, "id" | "createdAt" | "updatedAt">;

export class User
  extends Model<UserAttributes, UserCreation>
  implements UserAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare role: "admin" | "coach" | "student";
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
    role: {
      type: DataTypes.ENUM("admin", "coach", "student"),
      allowNull: false,
      defaultValue: "student",
    },
  },
  {
    sequelize,
    tableName: "users",
    indexes: [{ unique: true, fields: ["email"] }],
  }
);
