// app/componets/hooks/useToast.ts
import { useState, useCallback } from "react";
import { ToastType } from "../Toast";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    success: (msg: string) => showToast(msg, "success"),
    error: (msg: string) => showToast(msg, "error"),
    warning: (msg: string) => showToast(msg, "warning"),
    info: (msg: string) => showToast(msg, "info"),
  };
}