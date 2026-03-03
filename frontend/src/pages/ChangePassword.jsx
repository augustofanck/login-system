import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, ApiError } from "../api/client";

export default function ChangePassword() {
  const nav = useNavigate();
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirmNewPassword, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    if (newPassword.length < 8) {
      setErr("Nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErr("Confirmação não confere com a nova senha.");
      return;
    }

    try {
      await apiFetch("/me/change-password", {
        method: "POST",
        body: { currentPassword, newPassword, confirmNewPassword },
      });
      setOk("Senha alterada com sucesso.");
      setTimeout(() => nav("/home"), 600);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Erro ao trocar senha.");
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h2>Trocar minha senha</h2>

      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {ok && <p style={{ color: "green" }}>{ok}</p>}

      <form onSubmit={onSubmit}>
        <div>
          <label>Senha atual</label>
          <input value={currentPassword} onChange={(e) => setCurrent(e.target.value)} type="password" required />
        </div>

        <div>
          <label>Nova senha</label>
          <input value={newPassword} onChange={(e) => setNew(e.target.value)} type="password" required />
        </div>

        <div>
          <label>Confirmar nova senha</label>
          <input value={confirmNewPassword} onChange={(e) => setConfirm(e.target.value)} type="password" required />
        </div>

        <button type="submit" style={{ marginTop: 12 }}>Salvar</button>
      </form>
    </div>
  );
}