import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
    role: "USER",
  });

  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  function setField(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    // validação mínima no front (o back já valida forte)
    if (!/^\d{11}$/.test(form.cpf)) {
      setErr("CPF deve ter 11 dígitos numéricos.");
      return;
    }
    if (form.password.length < 8) {
      setErr("Sua senha necessita ter pelo menos 8 caracteres.");
      return;
    }

    try {
      await register(form);
      setOk("Usuário cadastrado! Agora faça login.");
      setTimeout(() => nav("/login"), 600);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Falha inesperada no cadastro.");
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h2>Cadastro</h2>

      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {ok && <p style={{ color: "green" }}>{ok}</p>}

      <form onSubmit={onSubmit}>
        <div>
          <label>Nome</label>
          <input value={form.name} onChange={(e) => setField("name", e.target.value)} required />
        </div>

        <div>
          <label>E-mail</label>
          <input value={form.email} onChange={(e) => setField("email", e.target.value)} type="email" required />
        </div>

        <div>
          <label>Senha</label>
          <input value={form.password} onChange={(e) => setField("password", e.target.value)} type="password" required />
        </div>

        <div>
          <label>CPF (11 dígitos)</label>
          <input value={form.cpf} onChange={(e) => setField("cpf", e.target.value)} inputMode="numeric" required />
        </div>

        <div>
          <label>Perfil</label>
          <select value={form.role} onChange={(e) => setField("role", e.target.value)}>
            <option value="USER">Usuário</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <button type="submit" style={{ marginTop: 12 }}>Cadastrar</button>
      </form>

      <p style={{ marginTop: 12 }}>
        Já possui conta? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}