import { useMemo, useState } from "react";
import { apiFetch, ApiError } from "../api/client";
import AppLayout from "../layouts/AppLayout";
import { Card, CardContent } from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function ChangePassword() {
  const { me, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const canSubmit = useMemo(() => {
    return (
      currentPassword.trim().length > 0 &&
      newPassword.trim().length >= 6 &&
      confirmNewPassword.trim().length > 0 &&
      !saving
    );
  }, [currentPassword, newPassword, confirmNewPassword, saving]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    if (newPassword !== confirmNewPassword) {
      setErr("A confirmação da nova senha não confere.");
      return;
    }
    if (newPassword.trim().length < 6) {
      setErr("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword === currentPassword) {
      setErr("A nova senha precisa ser diferente da senha atual.");
      return;
    }

    setSaving(true);
    try {
      await apiFetch('/change-password', {
        method: "PUT",
        body: {
          currentPassword,
          newPassword,
        },
      });

      setOk("Senha atualizada com sucesso.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (e2) {
      // Se teu backend devolver 401 quando o usuário sumiu do in-memory,
      // isso aqui deixa o UX coerente: derruba sessão e manda logar de novo.
      if (e2?.status === 401 || e2?.status === 403) {
        logout();
        return;
      }
      setErr(e2 instanceof ApiError ? e2.message : "Erro ao alterar a senha.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-slate-900">Trocar senha</h2>
            <p className="mt-1 text-sm text-slate-600">
              Confirme os dados para atualizar sua senha com segurança.
            </p>

            <div className="mt-4">
              {err ? <Alert variant="error">{err}</Alert> : null}
              {ok ? (
                <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
                  {ok}
                </div>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Senha atual
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Digite sua senha atual"
                  autoComplete="current-password"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Nova senha
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Confirmar nova senha
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                />
              </div>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <Button type="submit" disabled={!canSubmit} className="sm:w-auto">
                  {saving ? "Salvando..." : "Atualizar senha"}
                </Button>

                <Link to="/home" className="sm:w-auto">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    Voltar para Home
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Sessão</p>
            <p className="mt-1 font-semibold text-slate-900">{me?.name}</p>
            <p className="text-xs text-slate-500">{me?.email}</p>

            <div className="mt-4 flex flex-col gap-2">
              <Link to="/home">
                <Button variant="secondary" className="w-full">
                  Home
                </Button>
              </Link>
              {me?.role === "ADMIN" ? (
                <Link to="/admin/users">
                  <Button className="w-full">Área Admin</Button>
                </Link>
              ) : null}

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