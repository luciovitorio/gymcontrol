import { DataTypes, Model, type Optional, type NonAttribute } from "sequelize";
import { sequelize } from "@/libs/sequelize.js";
import { User } from "@/modules/users/models/user.model.js";
import { Plan } from "./plan.model.js";

type UserPlanAttributes = {
  id: number;
  userId: number;
  planId: number;
  startDate: Date;
  endDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

type UserPlanCreation = Optional<
  UserPlanAttributes,
  "id" | "endDate" | "createdAt" | "updatedAt"
>;

export class UserPlan
  extends Model<UserPlanAttributes, UserPlanCreation>
  implements UserPlanAttributes
{
  declare id: number;
  declare userId: number;
  declare planId: number;
  declare startDate: Date;
  declare endDate: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  // Associações
  declare user?: NonAttribute<User>;
  declare plan?: NonAttribute<Plan>;
}
UserPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    planId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "user_plans",
    indexes: [
      { fields: ["userId"] },
      { fields: ["planId"] },
      { fields: ["userId", "endDate"] },
    ],
  }
);

// Relacionamentos
UserPlan.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(UserPlan, { foreignKey: "userId", as: "userPlans" });
UserPlan.belongsTo(Plan, { foreignKey: "planId", as: "plan" });
Plan.hasMany(UserPlan, { foreignKey: "planId", as: "userPlans" });
