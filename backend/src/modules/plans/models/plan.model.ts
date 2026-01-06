import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "@/libs/sequelize.js";
type PlanAttributes = {
  id: number;
  name: string;
  description?: string;
  weeklyClassLimit: number;
  price: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
type PlanCreation = Optional<
  PlanAttributes,
  "id" | "description" | "isActive" | "createdAt" | "updatedAt"
>;
export class Plan
  extends Model<PlanAttributes, PlanCreation>
  implements PlanAttributes
{
  declare id: number;
  declare name: string;
  declare description?: string;
  declare weeklyClassLimit: number;
  declare price: number;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
Plan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    weeklyClassLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "plans",
    indexes: [{ unique: true, fields: ["name"] }],
  }
);
