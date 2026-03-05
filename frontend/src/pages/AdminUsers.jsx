import { useEffect, useMemo, useState } from "react";
import { apiFetch, ApiError } from "../api/client";
import AppLayout from "../layouts/AppLayout";
import { Card, CardContent } from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

const ENDPOINT_LIST_USERS = "/admin/users";

export default function AdminUsers() {
  const { me, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => {
      const name = (u.name ?? "").toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      const cpf = (u.cpf ?? "").toLowerCase();
      const role = (u.role ?? "").toLowerCase();
      return (
        name.includes(term) ||
        email.includes(term) ||
        cpf.includes(term) ||
        role.includes(term)
      );
    });
  }, [users, q]);

  async function loadUsers(targetPage = page) {
    setErr("");
    setLoading(true);

    try {
      const data = await apiFetch(
        `${ENDPOINT_LIST_USERS}?page=${targetPage}&size=${size}`
      );
      setUsers(Array.isArray(data?.content) ? data.content : []);
      setPage(Number.isFinite(data?.number) ? data.number : targetPage);
      setTotalPages(Number.isFinite(data?.totalPages) ? data.totalPages : 1);
      setTotalElements(Number.isFinite(data?.totalElements) ? data.totalElements : 0);
    } catch (e) {
      if (e?.status === 401 || e?.status === 403) {
        logout();
        return;
      }
      setErr(e instanceof ApiError ? e.message : "Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(user) {
    if (!user?.id) return;

    if (user.id === me?.id) {
      setErr("Você não pode excluir o seu próprio usuário.");
      return;
    }

    const label = user.email ? `${user.name} <${user.email}>` : (user.name ?? "usuário");
    const ok = window.confirm(`Excluir ${label}? Essa ação não pode ser desfeita.`);
    if (!ok) return;

    setErr("");

    try {
      await apiFetch(`${ENDPOINT_LIST_USERS}/${user.id}`, { method: "DELETE" });

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setTotalElements((prev) => Math.max(0, prev - 1));

      const willBeEmpty = users.length === 1;
      if (willBeEmpty && page > 0) {
        await loadUsers(page - 1);
      } else {
        await loadUsers(page);
      }
    } catch (e) {
      if (e?.status === 401 || e?.status === 403) {
        logout();
        return;
      }
      setErr(e instanceof ApiError ? e.message : "Erro ao excluir usuário.");
    }
  }

  useEffect(() => {
    loadUsers(0);
  }, []);

  if (me?.role !== "ADMIN") {
    return (
      <AppLayout>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-slate-900">Área Admin</h2>
              <div className="mt-4">
                <Alert variant="error">
                  Acesso negado. Apenas ADMIN pode ver esta página.
                </Alert>
              </div>
              <div className="mt-6">
                <Link to="/home">
                  <Button variant="secondary">Voltar para Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600">Sessão</p>
              <p className="mt-1 font-semibold text-slate-900">{me?.name}</p>
              <p className="text-xs text-slate-500">{me?.email}</p>

              <div className="mt-4 flex flex-col gap-2">
                <Button
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                  onClick={logout}
                  type="button"
                >
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const isFirst = page <= 0;
  const isLast = page >= totalPages - 1;

  return (
    <AppLayout>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Usuários</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Lista paginada vinda do backend (Spring Data Page). Exclua usuários com segurança.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => loadUsers(page)}
                  type="button"
                >
                  {loading ? "Atualizando..." : "Atualizar"}
                </Button>
                <Link to="/home">
                  <Button type="button">Home</Button>
                </Link>
              </div>
            </div>

            <div className="mt-4">
              {err ? <Alert variant="error">{err}</Alert> : null}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:max-w-sm">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Filtrar nesta página (nome, e-mail, CPF, role)..."
                />
              </div>

              <div className="text-sm text-slate-600">
                {loading
                  ? "Carregando..."
                  : `Página ${page + 1} de ${totalPages} • Total ${totalElements}`}
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Nome</th>
                      <th className="px-4 py-3 font-medium">E-mail</th>
                      <th className="px-4 py-3 font-medium">CPF</th>
                      <th className="px-4 py-3 font-medium">Perfil</th>
                      <th className="px-4 py-3 font-medium text-right">Ações</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {loading ? (
                      <tr>
                        <td className="px-4 py-5 text-slate-500" colSpan={5}>
                          Carregando usuários...
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td className="px-4 py-5 text-slate-500" colSpan={5}>
                          Nenhum usuário encontrado nesta página.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {u.name ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {u.email ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {u.cpf ?? "-"}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-full bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
                              {u.role ?? "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              type="button"
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={() => handleDelete(u)}
                              disabled={u.id === me?.id}
                            >
                              Excluir
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between gap-2 bg-slate-50 px-4 py-3">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => loadUsers(page - 1)}
                  disabled={loading || isFirst}
                >
                  Anterior
                </Button>

                <div className="text-xs text-slate-600">
                  {loading ? "…" : `Mostrando ${users.length} nesta página`}
                </div>

                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => loadUsers(page + 1)}
                  disabled={loading || isLast}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Sessão</p>
            <p className="mt-1 font-semibold text-slate-900">{me?.name}</p>
            <p className="text-xs text-slate-500">{me?.email}</p>

            <div className="mt-4 flex flex-col gap-2">
              <Link to="/change-password">
                <Button variant="secondary" className="w-full">
                  Trocar senha
                </Button>
              </Link>

              <Button
                className="w-full bg-red-600 text-white hover:bg-red-700"
                onClick={logout}
                type="button"
              >
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}