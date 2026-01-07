import { DataTypes, Model, type Optional, type NonAttribute } from "sequelize";
import { sequelize } from "@/libs/sequelize.js";
import { User } from "@/modules/users/models/user.model.js";
import { Class } from "./class.model.js";

type ClassWaitlistAttributes = {
  id: number;
  classId: number;
  userId: number;
  position: number;
  enteredAt: Date;
  notifiedAt?: Date | null;
  expiresAt?: Date | null;
  status: "waiting" | "notified" | "expired" | "promoted";
  createdAt?: Date;
  updatedAt?: Date;
};

type ClassWaitlistCreation = Optional<
  ClassWaitlistAttributes,
  | "id"
  | "enteredAt"
  | "notifiedAt"
  | "expiresAt"
  | "status"
  | "createdAt"
  | "updatedAt"
>;

export class ClassWaitlist
  extends Model<ClassWaitlistAttributes, ClassWaitlistCreation>
  implements ClassWaitlistAttributes
{
  declare id: number;
  declare classId: number;
  declare userId: number;
  declare position: number;
  declare enteredAt: Date;
  declare notifiedAt: Date | null;
  declare expiresAt: Date | null;
  declare status: "waiting" | "notified" | "expired" | "promoted";
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Associações
  declare class?: NonAttribute<Class>;
  declare user?: NonAttribute<User>;
}

ClassWaitlist.init(
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
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enteredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "entered_at",
    },
    notifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "notified_at",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "expires_at",
    },
    status: {
      type: DataTypes.ENUM("waiting", "notified", "expired", "promoted"),
      allowNull: false,
      defaultValue: "waiting",
    },
  },
  {
    sequelize,
    tableName: "class_waitlist",
    underscored: true,
  }
);

// Relacionamentos
ClassWaitlist.belongsTo(Class, { foreignKey: "classId", as: "class" });
Class.hasMany(ClassWaitlist, { foreignKey: "classId", as: "waitlist" });

ClassWaitlist.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(ClassWaitlist, { foreignKey: "userId", as: "waitlistEntries" });
