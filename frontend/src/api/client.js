const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const TOKEN_KEY = "token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";

  const raw = await res.text();
  if (!raw) return null;

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  return raw;
}

export async function apiFetch(
  path,
  { method = "GET", body, token, headers = {}, ...rest } = {},
) {
  const finalHeaders = {
    Accept: "application/json",
    ...headers,
  };

  // Só coloca Content-Type quando tem body
  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const resolvedToken = token ?? getToken();
  if (
    resolvedToken &&
    resolvedToken !== "null" &&
    resolvedToken !== "undefined"
  ) {
    finalHeaders.Authorization = `Bearer ${resolvedToken}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    const msg =
      data && typeof data === "object" && data.message
        ? data.message
        : `Erro HTTP ${res.status}`;

    throw new ApiError(msg, res.status, data);
  }

  return data;
}

export const api = {
  get: (path, opts) => apiFetch(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => apiFetch(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => apiFetch(path, { ...opts, method: "PUT", body }),
  del: (path, opts) => apiFetch(path, { ...opts, method: "DELETE" }),
};
