const TOKEN_KEY = "auth_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Erro padronizado pra UI
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch(path, { method = "GET", body, token } = {}) {
  const jwt = token ?? getToken();

  const headers = {
    "Content-Type": "application/json",
  };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;

  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 204: sem body
  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  const hasJson = contentType.includes("application/json");

  const data = hasJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error || data.detail)) ||
      (typeof data === "string" && data) ||
      `Erro HTTP ${res.status}`;

    throw new ApiError(msg, res.status, data);
  }

  return data;
}