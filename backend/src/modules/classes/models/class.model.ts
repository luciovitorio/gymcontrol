import { DataTypes, Model, type Optional, type NonAttribute } from "sequelize";
import { sequelize } from "@/libs/sequelize.js";
import { User } from "@/modules/users/models/user.model.js";

type ClassAttributes = {
  id: number;
  name: string;
  description?: string;
  coachId: number;
  dayOfWeek: number; // 0=Dom, 1=Seg, ..., 6=Sáb
  startTime: string; // "08:00"
  endTime: string; // "09:00"
  capacity: number;
  waitlistLimit: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type ClassCreation = Optional<
  ClassAttributes,
  | "id"
  | "description"
  | "waitlistLimit"
  | "isActive"
  | "createdAt"
  | "updatedAt"
>;

export class Class
  extends Model<ClassAttributes, ClassCreation>
  implements ClassAttributes
{
  declare id: number;
  declare name: string;
  declare description?: string;
  declare coachId: number;
  declare dayOfWeek: number;
  declare startTime: string;
  declare endTime: string;
  declare capacity: number;
  declare waitlistLimit: number;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Associações
  declare coach?: NonAttribute<User>;
}

Class.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    coachId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "coach_id",
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "day_of_week",
      validate: {
        min: 0,
        max: 6,
      },
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: "start_time",
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: "end_time",
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    waitlistLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      field: "waitlist_limit",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
  },
  {
    sequelize,
    tableName: "classes",
    underscored: true,
  }
);

// Relacionamento com User (coach)
Class.belongsTo(User, { foreignKey: "coachId", as: "coach" });
User.hasMany(Class, { foreignKey: "coachId", as: "classes" });
