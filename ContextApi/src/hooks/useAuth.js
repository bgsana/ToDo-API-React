// ═══════════════════════════════════════════
// hooks/useAuth.js
// Gerencia o estado de autenticação global.
// Lê/salva o usuário e token no localStorage.
// ═══════════════════════════════════════════
import { useState } from "react";

export function useAuth() {
  // Inicializa já lendo o usuário salvo (persiste após F5)
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  });

  function login(data) {
    // Salva token e dados do usuário no localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  return { usuario, login, logout };
}
