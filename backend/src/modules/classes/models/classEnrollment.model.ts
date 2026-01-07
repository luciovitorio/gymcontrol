import { DataTypes, Model, type Optional, type NonAttribute } from "sequelize";
import { sequelize } from "@/libs/sequelize.js";
import { User } from "@/modules/users/models/user.model.js";
import { Class } from "./class.model.js";

type ClassEnrollmentAttributes = {
  id: number;
  classId: number;
  userId: number;
  enrolledAt: Date;
  status: "confirmed" | "cancelled" | "no_show";
  cancelledAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

type ClassEnrollmentCreation = Optional<
  ClassEnrollmentAttributes,
  "id" | "enrolledAt" | "status" | "cancelledAt" | "createdAt" | "updatedAt"
>;

export class ClassEnrollment
  extends Model<ClassEnrollmentAttributes, ClassEnrollmentCreation>
  implements ClassEnrollmentAttributes
{
  declare id: number;
  declare classId: number;
  declare userId: number;
  declare enrolledAt: Date;
  declare status: "confirmed" | "cancelled" | "no_show";
  declare cancelledAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Associações
  declare class?: NonAttribute<Class>;
  declare user?: NonAttribute<User>;
}

ClassEnrollment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "class_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    enrolledAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "enrolled_at",
    },
    status: {
      type: DataTypes.ENUM("confirmed", "cancelled", "no_show"),
      allowNull: false,
      defaultValue: "confirmed",
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "cancelled_at",
    },
  },
  {
    sequelize,
    tableName: "class_enrollments",
    underscored: true,
  }
);

// Relacionamentos
ClassEnrollment.belongsTo(Class, { foreignKey: "classId", as: "class" });
Class.hasMany(ClassEnrollment, { foreignKey: "classId", as: "enrollments" });

ClassEnrollment.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(ClassEnrollment, { foreignKey: "userId", as: "enrollments" });
