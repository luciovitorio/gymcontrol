import { getEnv, getEnvOptional } from "../utils/getEnv.js";

export const config = {
  PORT: Number(getEnvOptional("PORT", "5000")),
  NODE_ENV: getEnvOptional("NODE_ENV", "development") as
    | "development"
    | "production"
    | "test",

  BASE_PATH: getEnvOptional("BASE_PATH", "/api"),
  FRONTEND_ORIGIN: getEnvOptional("FRONTEND_ORIGIN", "http://localhost:5173"),
  JWT_EXPIRES_IN: getEnvOptional("JWT_EXPIRES_IN", "8h"),
  REFRESH_EXPIRES_IN: getEnvOptional("REFRESH_EXPIRES_IN", "7d"),

  // OBRIGATÓRIAS (se faltar, o app nem sobe — melhor assim!)
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
} as const;
