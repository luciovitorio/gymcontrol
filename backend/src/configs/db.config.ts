import { getEnvOptional } from "../utils/getEnv.js";

export const dbConfig = {
  host: getEnvOptional("DB_HOST", "localhost"),
  port: Number(getEnvOptional("DB_PORT", "5432")),
  username: getEnvOptional("DB_USER", "postgres"),
  password: getEnvOptional("DB_PASS", ""),
  database: getEnvOptional("DB_NAME", "gymcontrol"),
  dialect: "postgres" as const,
  logging: getEnvOptional("DB_LOGGING", "false") === "true",
  ssl: getEnvOptional("DB_SSL", "false") === "true",
};
