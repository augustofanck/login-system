import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import { apiFetch, clearToken, getToken, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadMe(jwt = token) {
    if (!jwt) {
      setMe(null);
      return;
    }
    const data = await apiFetch("/me", { token: jwt });
    setMe(data);
  }

  async function login(email, password) {
    const resp = await apiFetch("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    // resp = { token }
    setToken(resp.token);
    setTokenState(resp.token);

    await loadMe(resp.token);
    return resp.token;
  }

  async function register({ name, email, password, cpf, role }) {
    await apiFetch("/auth/register", {
      method: "POST",
      body: { name, email, password, cpf, role },
    });
  }

  function logout() {
    clearToken();
    setTokenState(null);
    setMe(null);
    navigate('/login', { replace: true });
  }

  async function apiFetchAuth(path, opts = {}) {
    try {
      return await apiFetch(path, { ...opts, token: opts.token ?? token });
    } catch (e) {
        if(e?.status === 401 || e?.status === 403) {
          logout();
        }
        throw e;
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (token) {
          await loadMe(token);
        } else {
          setMe(null);
        }
      } catch (e) {
        if (e?.status === 401) logout();
        else console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const value = useMemo(
      () => ({ token, me, loading, login, register, logout, loadMe, apiFetchAuth }),
      [token, me, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return ctx;
}