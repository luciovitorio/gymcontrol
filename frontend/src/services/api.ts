import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
  withCredentials: true, // Para enviar cookies (refresh token)
});

// Interceptor para adicionar o token JWT
api.interceptors.request.use((config) => {
  // O token geralmente é armazenado no localStorage ou em memória (Zustand)
  // Como vamos usar Zustand, podemos injetar depois ou pegar do localStorage se persistido
  const token = localStorage.getItem("gymcontrol:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor de erro (opcional, para refresh token automático no futuro)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
