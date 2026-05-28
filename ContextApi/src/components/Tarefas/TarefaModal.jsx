  import { useState } from "react";
  import { tarefaService } from "../../services/api";
  import "./TarefaModal.css";

  export function TarefaModal({ tarefa, onClose, onSave }) {
    const [form, setForm] = useState({
      titulo: tarefa?.titulo || "",
      descricao: tarefa?.descricao || "",
    });
    const [loading, setLoading] = useState(false);

    const handle = (field) => (e) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

    async function submit(e) {
      e.preventDefault();
      setLoading(true);
      try {
        let resultado;
        if (tarefa) {
          // PUT /api/tarefa/{id} — edita a tarefa existente
          resultado = await tarefaService.atualizar(tarefa.id, {
            ...form,
            concluida: tarefa.concluida,
          });
        } else {
          // POST /api/tarefa — cria nova tarefa
          resultado = await tarefaService.criar(form.titulo, form.descricao);
        }
        onSave(resultado, !!tarefa); // avisa o pai: (tarefa, foiEdicao)
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal">
          <div className="modal-header">
            <h2 className="modal-title">
              {tarefa ? "Editar tarefa" : "Nova tarefa"}
            </h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>

          <form onSubmit={submit}>
            <div className="field">
              <label>Título *</label>
              <input
                value={form.titulo}
                onChange={handle("titulo")}
                placeholder="Ex: Estudar React"
                required
              />
            </div>

            <div className="field">
              <label>Descrição</label>
              <textarea
                value={form.descricao}
                onChange={handle("descricao")}
                placeholder="Detalhes opcionais..."
                rows={3}
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Salvando..." : tarefa ? "Salvar" : "Criar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
