import { useState } from "react";
import { authService } from "../../services/api";
import "./AuthForm.css";

export function AuthForm({ onLogin }) {
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Atualiza um campo do formulário dinamicamente
  const handle = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function trocarTab(novaTab) {
    setTab(novaTab);
    setErro(""); // limpa erro ao trocar de aba
  }

  async function submit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      if (tab === "login") {
        // POST /api/auth/login → { token, usuario }
        const data = await authService.login(form.email, form.senha);
        onLogin(data); // sobe os dados para o App
      } else {
        // POST /api/auth/register → cria o usuário
        await authService.register(form.nome, form.email, form.senha);
        alert("Conta criada com sucesso! Faça login.");
        trocarTab("login");
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">📝 ToDoList</h1>
        <p className="auth-sub">Gerencie suas tarefas com facilidade</p>

        {/* Abas */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => trocarTab("login")}
          >
            Entrar
          </button>
          <button
            className={`auth-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => trocarTab("register")}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={submit}>
          {tab === "register" && (
            <div className="field">
              <label>Nome</label>
              <input
                value={form.nome}
                onChange={handle("nome")}
                placeholder="Seu nome completo"
                required
              />
            </div>
          )}

          <div className="field">
            <label>E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={handle("email")}
              placeholder="voce@email.com"
              required
            />
          </div>

          <div className="field">
            <label>Senha</label>
            <input
              type="password"
              value={form.senha}
              onChange={handle("senha")}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Erro vindo da API */}
          {erro && <div className="auth-erro">{erro}</div>}

          <button className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Aguarde..." : tab === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}