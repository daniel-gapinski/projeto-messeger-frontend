import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";

export function setupAPIClient(ctx = undefined) {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  api.interceptors.request.use((config) => {
    const cookies = parseCookies(ctx);
    const token = cookies["@messeger.token"];

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (typeof window !== "undefined") {
        console.log("Token inválido, deslogar o usuário");
        // signOut();
        // window.location.href = "/login";
      } else {
        return Promise.reject(new AuthTokenError());
      }
      return Promise.reject(error);
    }
  );

  return api;
}

