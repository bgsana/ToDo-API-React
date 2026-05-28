import "./TarefaCard.css";

export function TarefaCard({ tarefa, onToggle, onEditar, onDeletar, onComentarios }) {
  const fmt = (d) =>
    new Date(d).toLocaleDateString("pt-BR");

  return (
    <div className={`tarefa-card ${tarefa.concluida ? "concluida" : ""}`}>
      <div className="tarefa-top">
        {/* Botão de marcar como concluída */}
        <button
          className={`tarefa-check ${tarefa.concluida ? "checked" : ""}`}
          onClick={() => onToggle(tarefa)}
          title={tarefa.concluida ? "Marcar como pendente" : "Marcar como concluída"}
        />

        <div className="tarefa-info">
          <span className="tarefa-titulo">{tarefa.titulo}</span>
          <span className={`badge ${tarefa.concluida ? "badge-success" : "badge-muted"}`}>
            {tarefa.concluida ? "Concluída" : "Pendente"}
          </span>
        </div>
      </div>

      {/* Descrição opcional */}
      {tarefa.descricao && (
        <p className="tarefa-desc">{tarefa.descricao}</p>
      )}

      <div className="tarefa-footer">
        <span className="tarefa-date"> <i className="fa-solid fa-calendar"></i> {fmt(tarefa.dataCriacao)}</span>

        <div className="tarefa-actions">
          <button className="btn btn-sm btn-ghost" onClick={() => onComentarios(tarefa)}>
            <i className="fa-solid fa-comment"></i> Comentários
          </button>
          <button className="btn btn-sm btn-ghost" onClick={() => onEditar(tarefa)}>
            <i className="fa-solid fa-pen-to-square"></i> Editar
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => onDeletar(tarefa.id)}>
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
