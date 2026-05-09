import axios from "axios";

/**
 * Cliente HTTP compartilhado. Módulos importam daqui e montam paths no próprio service.
 * `NEXT_PUBLIC_API_URL` — base da API (ex.: https://api.exemplo.com).
 */
export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
  withCredentials: false,
});
