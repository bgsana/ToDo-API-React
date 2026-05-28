import { useState } from 'react'
import { useAuth } from "./hooks/useAuth"
import { useToast } from "./hooks/useToast"
import { AuthForm } from "./components/Auth/AuthForm"
import { Sidebar } from "./components/Layout/Sidebar"
import { Toast } from "./components/UI/Toast"
import { TarefasPage } from "./pages/TarefasPage"
import './App.css'

function PerfilPage({ usuario }) {
  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]))
  const exp = new Date(payload.exp * 1000).toLocaleString("pt-BR")

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: "0.25rem" }}>Meu Perfil</h1>
      <p className="page-sub" style={{ marginBottom: "1.5rem" }}>Informações da seção</p>

      <div className="perfil-card">
        <div className="perfil-top">
          <div className="perfil-avatar">
            {usuario?.nome?.[0].toUpperCase()}
          </div>
          <div>
            <div className="perfil-nome">{usuario?.nome}</div>
            <div className="perfil-email">{usuario?.email}</div>
          </div>
        </div>
      </div>

      <hr className='divider' />

      <p className="section-label">Token JWT</p>
      <div className="code-block">
        <div className="code-label">Expira em: </div>
        <code>{exp}</code>
      </div>

      <div className="code-block" style={{ marginTop: "0.5rem" }}>
        <div className="code-label"> Claims decodificadas: </div>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
      </div>
    </div>
  )
}

export default function App() {
  const { usuario, login, logout } = useAuth();
  const [pagina, setPagina] = useState("tarefas");
  const toast = useToast();

  // Se não estiver logado → tela de autenticação
  if (!usuario) {
    return <AuthForm onLogin={login} />;
  }

  return (
    <div className="app-shell">
      <Toast toasts={toast.toasts} />

      <Sidebar
        usuario={usuario}
        pagina={pagina}
        setPagina={setPagina}
        onLogout={logout}
      />

      <main className="main">
        {pagina === "tarefas" && <TarefasPage toast={toast} />}
        {pagina === "perfil" && <PerfilPage usuario={usuario} />}
      </main>
    </div>
  );
}
