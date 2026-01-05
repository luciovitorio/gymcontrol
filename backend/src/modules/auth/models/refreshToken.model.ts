import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "@/libs/sequelize.js";
import { User } from "@/modules/users/models/user.model.js";

type RefreshTokenAttrs = {
  id: number;
  token: string;
  userId: number;
  expiresAt: Date;
  revokedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

type RefreshTokenCreation = Optional<
  RefreshTokenAttrs,
  "id" | "revokedAt" | "createdAt" | "updatedAt"
>;

export class RefreshToken
  extends Model<RefreshTokenAttrs, RefreshTokenCreation>
  implements RefreshTokenAttrs
{
  declare id: number;
  declare token: string;
  declare userId: number;
  declare expiresAt: Date;
  declare revokedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "refresh_tokens",
    indexes: [{ unique: true, fields: ["token"] }],
  }
);

RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
