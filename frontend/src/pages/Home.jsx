import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "../api/client";
import AppLayout from "../layouts/AppLayout";
import { Card, CardContent } from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { me } = useAuth();
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const data = await apiFetch("/home");
        setMsg(data);
      } catch (e) {
        setErr(e instanceof ApiError ? e.message : "Erro ao carregar /home.");
      }
    })();
  }, []);

  return (
    <AppLayout>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-slate-900">HOME</h2>
            <p className="mt-1 text-slate-600 text-sm">
              Mensagem vinda do backend protegido por JWT.
            </p>

            <div className="mt-4">
              {err ? (
                <Alert variant="error">{err}</Alert>
              ) : (
                <div className="rounded-2xl bg-slate-900 text-white p-6">
                  <p className="text-sm text-slate-300">Resposta do endpoint /home:</p>
                  <p className="mt-2 text-2xl font-bold">{msg || "Carregando..."}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Sessão</p>
            <p className="mt-1 font-semibold text-slate-900">{me?.name}</p>
            <p className="text-xs text-slate-500">{me?.email}</p>

            <div className="mt-4 flex flex-col gap-2">
              <Link to="/me/change-password">
                <Button variant="secondary" className="w-full">Trocar senha</Button>
              </Link>
              {me?.role === "ADMIN" && (
                <Link to="/admin/users">
                  <Button className="w-full">Área Admin</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}