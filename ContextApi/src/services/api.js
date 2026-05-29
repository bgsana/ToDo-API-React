const API_URL = "http://localhost:5228"

async function api(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();

  console.log("Status:", res.status);
  console.log("Resposta:", text);

  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || "Erro na requisição");
  }

  return data;
}

// Auth
export const authService = {
  // POST  api/auth/register
  register: (nome, email, senha) =>
    api("/api/auth/register", { method: "POST", body: { nome, email, senha } }),

  // POST api/auth/login
  login: (email, senha) =>
    api("/api/auth/login", { method: "POST", body: { email, senha } })
}

// ── Tarefas ───────────────────────────────────
export const tarefaService = {
  // GET /api/tarefa → lista as tarefas do usuário logado
  listar: () => api("/api/tarefa"),

  // POST /api/tarefa → cria uma nova tarefa
  criar: (titulo, descricao) =>
    api("/api/Tarefas", { method: "POST", body: { titulo, descricao } }),

  // PUT /api/tarefa/{id} → atualiza título, descrição ou status
  atualizar: (id, dados) =>
    api(`/api/Tarefas/${id}`, { method: "PUT", body: dados }),

  // DELETE /api/tarefa/{id} → remove a tarefa
  deletar: (id) => api(`/api/Tarefas/${id}`, { method: "DELETE" }),
};

// ── Comentários ───────────────────────────────
export const comentarioService = {
  // GET /api/tarefas/{tarefaId}/comentarios
  listar: (tarefaId) => api(`/api/Tarefas/${tarefaId}/comentarios`),

  // POST /api/tarefas/{tarefaId}/comentarios
  criar: (tarefaId, conteudo) =>
    api(`/api/Tarefas/${tarefaId}/comentarios`, {
      method: "POST",
      body: { conteudo },
    }),

  // DELETE /api/tarefas/{tarefaId}/comentarios/{id}
  deletar: (tarefaId, id) =>
    api(`/api/Tarefas/${tarefaId}/comentarios/${id}`, { method: "DELETE" }),
};