// ═══════════════════════════════════════════
// hooks/useToast.js
// Hook customizado para exibir notificações.
// Retorna { toasts, success, error }
// ═══════════════════════════════════════════
import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  function add(msg, type = "success") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    // Remove automaticamente após 3 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }

  return {
    toasts,
    success: (msg) => add(msg, "success"),
    error: (msg) => add(msg, "error"),
  };
}
