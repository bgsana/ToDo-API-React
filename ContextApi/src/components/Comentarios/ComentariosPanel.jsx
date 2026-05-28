import { useState, useEffect } from "react";
import { comentarioService } from "../../services/api";
import { Spinner } from "../UI/Spinner";
import "./ComentariosPanel.css";

export function ComentariosPanel({ tarefa, onClose, toast }) {
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [loading, setLoading] = useState(true);

  // Busca os comentários ao abrir o painel
  useEffect(() => {
    // GET /api/tarefas/{id}/comentarios
    comentarioService
      .listar(tarefa.id)
      .then(setComentarios)
      .catch(() => toast.error("Erro ao carregar comentários."))
      .finally(() => setLoading(false));
  }, [tarefa.id]);

  async function enviar(e) {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    try {
      // POST /api/tarefas/{id}/comentarios
      const criado = await comentarioService.criar(tarefa.id, novoComentario);
      setComentarios((prev) => [...prev, criado]);
      setNovoComentario("");
      toast.success("Comentário adicionado!");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function deletar(comentarioId) {
    try {
      // DELETE /api/tarefas/{tarefaId}/comentarios/{id}
      await comentarioService.deletar(tarefa.id, comentarioId);
      setComentarios((prev) => prev.filter((c) => c.id !== comentarioId));
      toast.success("Comentário removido.");
    } catch {
      toast.error("Não foi possível remover.");
    }
  }

  const fmt = (d) =>
    new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

  return (
    <div className="panel-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="panel">
        {/* Cabeçalho */}
        <div className="panel-header">
          <div>
            <h2 className="panel-title">💬 Comentários</h2>
            <p className="panel-sub">{tarefa.titulo}</p>
          </div>
          <button className="panel-close" onClick={onClose}>✕</button>
        </div>

        {/* Lista */}
        <div className="panel-body">
          {loading && <Spinner />}

          {!loading && comentarios.length === 0 && (
            <p className="panel-empty">Nenhum comentário ainda. Seja o primeiro! 👇</p>
          )}

          {comentarios.map((c) => (
            <div key={c.id} className="comentario">
              <p className="comentario-conteudo">{c.conteudo}</p>
              <div className="comentario-footer">
                <span className="comentario-data">{fmt(c.criadoEm)}</span>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deletar(c.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Formulário */}
        <form className="panel-form" onSubmit={enviar}>
          <div className="field">
            <textarea
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              placeholder="Escreva um comentário..."
              rows={3}
            />
          </div>
          <button
            className="btn btn-primary btn-full"
            disabled={!novoComentario.trim()}
          >
            Enviar comentário
          </button>
        </form>
      </div>
    </div>
  );
}