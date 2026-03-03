import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import AuthLayout from "../layouts/AuthLayout";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await login(email, password);
      nav("/home");
    } catch (e) {
      if (e instanceof ApiError) {
        setErr(e.status === 401 ? "Credenciais inválidas." : e.message);
      } else {
        setErr("Falha inesperada no login.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Acesse com seu e-mail e senha (JWT via Spring Security)."
    >
      <Card>
        <CardHeader>
          <p className="text-sm text-slate-600 text-center mb-4">
              Utilize um usuário cadastrado ou crie o seu!
          </p>
        </CardHeader>

        <CardContent>
          {err && <Alert variant="error" className="mb-4">{err}</Alert>}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label>E-mail</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="email@exemplo.com"
                required
              />
            </div>

            <div>
              <Label>Senha</Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <Link className="text-indigo-600 hover:underline" to="/register">
              Criar conta
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}