// One base URL for every frontend request.
// During `npm run dev`, Vite forwards `/api` to Express (see vite.config.js).
export const API_URL = import.meta.env.PROD
  ? "https://uni-support-three.vercel.app/api"
  : "/api";

export const apiFetch = async (input, options = {}) => {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem("token");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    localStorage.removeItem("token");

    const requestTarget =
      typeof input === "string" || input instanceof URL ? input : input.url;
    const requestPath = new URL(requestTarget, window.location.href).pathname;
    const isAuthenticationRequest = /\/(login|register)$/.test(requestPath);

    if (!isAuthenticationRequest && !window.location.hash.startsWith("#/login")) {
      window.location.hash = "#/login";
    }
  }

  return response;
};