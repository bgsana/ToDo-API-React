// ═══════════════════════════════════════════
// pages/TarefasPage.jsx
// Página principal: lista tarefas, gerencia
// estado e coordena os componentes filhos.
// ═══════════════════════════════════════════
import { useState, useEffect } from "react";
import { tarefaService } from "../services/api";
import { TarefaCard } from "../components/Tarefas/TarefaCard";
import { TarefaModal } from "../components/Tarefas/TarefaModal";
import { ComentariosPanel } from "../components/Comentarios/ComentariosPanel";
import { Spinner } from "../components/UI/Spinner";
import "./TarefasPage.css";

export function TarefasPage({ toast }) {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);       // null | "nova" | { tarefa }
  const [comentariosDe, setComentariosDe] = useState(null); // tarefa selecionada

  // Carrega as tarefas ao montar a página
  useEffect(() => {
    // GET /api/tarefa
    tarefaService
      .listar()
      .then(setTarefas)
      .catch(() => toast.error("Erro ao carregar tarefas."))
      .finally(() => setLoading(false));
  }, []);

  // Alterna concluída ↔ pendente
  async function toggleConcluida(tarefa) {
    try {
      const atualizada = await tarefaService.atualizar(tarefa.id, {
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        concluida: !tarefa.concluida, // inverte o status
      });
      setTarefas((prev) =>
        prev.map((t) => (t.id === atualizada.id ? atualizada : t))
      );
    } catch {
      toast.error("Não foi possível atualizar.");
    }
  }

  // Deleta uma tarefa
  async function deletar(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    try {
      await tarefaService.deletar(id);
      setTarefas((prev) => prev.filter((t) => t.id !== id));
      toast.success("Tarefa excluída!");
    } catch {
      toast.error("Não foi possível excluir.");
    }
  }

  // Callback após criar ou editar
  function onSave(tarefa, foiEdicao) {
    if (foiEdicao) {
      setTarefas((prev) => prev.map((t) => (t.id === tarefa.id ? tarefa : t)));
      toast.success("Tarefa atualizada!");
    } else {
      setTarefas((prev) => [...prev, tarefa]);
      toast.success("Tarefa criada!");
    }
    setModal(null);
  }

  // Stats
  const concluidas = tarefas.filter((t) => t.concluida).length;
  const pct = tarefas.length ? Math.round((concluidas / tarefas.length) * 100) : 0;

  return (
    <>
      {/* Estatísticas */}
      <div className="stats">
        <div className="stat-card">
          <div className="stat-value">{tarefas.length}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card success">
          <div className="stat-value">{concluidas}</div>
          <div className="stat-label">Concluídas</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-value">{tarefas.length - concluidas}</div>
          <div className="stat-label">Pendentes</div>
        </div>
      </div>

      {/* Barra de progresso */}
      {tarefas.length > 0 && (
        <div className="progress-wrap">
          <div className="progress-label">
            <span>Progresso geral</span>
            <strong>{pct}%</strong>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

     <div className="page-header">
        <div>
          <h1 className="page-title">Minhas tarefas</h1>
          <p className="page-sub">Organize e acompanhe suas atividades</p>
       {/* Cabeçalho da lista */}
        </div>
        <button className="btn btn-primary" onClick={() => setModal("nova")}>
          + Nova tarefa
        </button>
      </div>

      {/* Loading */}
      {loading && <Spinner />}

      {/* Lista vazia */}
      {!loading && tarefas.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <h2 className="empty-title">Nenhuma tarefa ainda</h2>
          <p>Clique em &quot;+ Nova tarefa&quot; para começar!</p>
        </div>
      )}

      {/* Lista de tarefas */}
      <div className="tarefas-list">
        {tarefas.map((t) => (
          <TarefaCard
            key={t.id}
            tarefa={t}
            onToggle={toggleConcluida}
            onEditar={(tarefa) => setModal({ tarefa })}
            onDeletar={deletar}
            onComentarios={setComentariosDe}
          />
        ))}
      </div>

      {/* Modal criar / editar */}
      {modal && (
        <TarefaModal
          tarefa={modal === "nova" ? null : modal.tarefa}
          onClose={() => setModal(null)}
          onSave={onSave}
        />
      )}

      {/* Painel de comentários */}
      {comentariosDe && (
        <ComentariosPanel
          tarefa={comentariosDe}
          onClose={() => setComentariosDe(null)}
          toast={toast}
        />
      )}
    </>
  );
}
