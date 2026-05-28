import "./Sidebar.css"

export function Sidebar({ usuario, pagina, setPagina, onLogout }) {
    const initials = usuario?.nome
        ?.split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <aside className="sidebar">
            <div className="logo">
                ToDoList
                <span>Aula de React + API</span>
            </div>

            <p className="nav-section">
                Menu
            </p>

            <button className={`nav-item ${pagina === "tarefas" ? "active" : ""}`}
                onClick={() => setPagina("tarefas")}>
                <i className="fa-solid fa-list-check">
                    Tarefas
                </i>
            </button>

            <button className={`nav-item ${pagina === "perfil" ? "active" : ""}`}
                onClick={() => setPagina("perfil")}>
                <i className="fa-solid fa-user">
                    Meu perfil
                </i>
            </button>

            <div className="user-chip">
                <div className="user-avatar">{initials}</div>
                <div className="user-info">
                    <div className="user-name">{usuario?.nome}</div>
                    <div className="user-email">{usuario?.email}</div>
                </div>
            </div>

            <button className="btn btn-danger btn full" onClick={onLogout}>
                Sair
            </button>
        </aside>
    );
}