import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastProvider } from "./components/ToastManager.jsx";
import './index.css'; // Tailwind CSS v4

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);
// src/main.jsx
// TODO revisar los formatos de los mensajes y la forma de mostrarlos. Estan universalizados