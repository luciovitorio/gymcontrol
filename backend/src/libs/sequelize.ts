import { Sequelize } from "sequelize";
import { dbConfig } from "../configs/db.config.js";

export const sequelize = new Sequelize({
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  dialectOptions: dbConfig.ssl
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  define: { underscored: true, timestamps: true },
});
