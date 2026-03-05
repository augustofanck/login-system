import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { parseApiError } from "../utils/apiError";
import { maskCpf, onlyDigits } from "../utils/cpf";
import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    role: "USER",
  });

  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setErrors({});
    setSuccess("");

    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        cpf: onlyDigits(form.cpf),
        password: form.password,
        role: form.role,
      });

      setSuccess("Usuário cadastrado com sucesso. Redirecionando...");
      setTimeout(() => navigate("/login"), 1200);
      setForm((p) => ({ ...p, password: "" }));
    } catch (err) {
      const parsed = parseApiError(err);
      setFormError(parsed.message);
      setErrors(parsed.fieldErrors);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Cadastro</h1>

        {formError && <Alert variant="error">{formError}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">E-mail</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">CPF</label>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={form.cpf}
              onChange={(e) => setField("cpf", maskCpf(e.target.value))}
              maxLength={14}
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00"
            />
            {errors.cpf && (
              <p className="text-sm text-red-600 mt-1">{errors.cpf}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Senha</label>
            <input
              type="password"
              className="mt-1 w-full border rounded px-3 py-2"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Perfil</label>
            <select
              className="mt-1 w-full border rounded px-3 py-2"
              value={form.role}
              onChange={(e) => setField("role", e.target.value)}
            >
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-600 mt-1">{errors.role}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Criar conta
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
        </form>
      </Card>
    </div>
  );
}