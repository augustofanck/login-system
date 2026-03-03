import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "../api/client";

export default function AdminUsers() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const resp = await apiFetch(`/admin/users?page=${page}&size=${size}&sort=id,desc`);
      setData(resp);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Erro ao carregar usuários.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function onDelete(id) {
    if (!confirm("Excluir este usuário?")) return;

    try {
      await apiFetch(`/admin/users/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Erro ao excluir usuário.");
    }
  }

  const users = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2>Admin - Usuários</h2>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: 12 }}>
        <thead>
          <tr>
            <th>ID</th><th>Nome</th><th>Email</th><th>CPF</th><th>Role</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.cpf}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => onDelete(u.id)}>Excluir</button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan="6">Sem dados</td></tr>
          )}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button disabled={page <= 0} onClick={() => setPage((p) => p - 1)}>Anterior</button>
        <span>Página {page + 1} de {Math.max(totalPages, 1)}</span>
        <button disabled={totalPages === 0 || page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Próxima</button>
      </div>
    </div>
  );
}