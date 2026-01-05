export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variável obrigatória não encontrada: ${key}`);
  }
  return value;
};

export const getEnvOptional = (key: string, defaultValue: string): string => {
  return process.env[key] ?? defaultValue;
};
