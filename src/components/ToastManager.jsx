import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContext } from "../services/getExportToastManager";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type, duration = 3000) => {
    const id = uuidv4();
    const validTypes = ["success", "danger", "info", "warning"];
    if (!validTypes.includes(type)) {
      console.error(`Invalid toast type: ${type}`);
      return;
    }
    setToasts([{ id, message, type, closing: false }]);
    setTimeout(() => startCloseToast(id), duration);
  };

  const startCloseToast = (id) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, closing: true } : toast
      )
    );
    // espera la animacion antes de q
    setTimeout(() => removeToast(id), 400); // 400ms → debe coincidir con la animación
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    return () => {
      toasts.forEach((toast) => clearTimeout(toast.timeoutId));
    };
  }, [toasts]);

  const toastStyles = {
    success: "bg-green-600",
    danger: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-500 text-black",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`text-white px-4 py-3 rounded shadow-lg flex items-center justify-between min-w-[250px] max-w-sm
              ${
                toast.closing
                  ? "animate-slide-fade-out"
                  : "animate-slide-fade-in"
              } 
              ${toastStyles[toast.type]}`}
          >
            <span className="mr-2">{toast.message}</span>
            <button
              onClick={() => startCloseToast(toast.id)}
              className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
