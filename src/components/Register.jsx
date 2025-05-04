import { useState } from "react";
import { useToast } from "../services/getExportToastManager";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Registro de usuario
      const response = await api.post("register/", {
        username,
        email,
        password,
      });
      console.log(response.data);

      // 2, Login automático
      const loginResponse = await api.post("token/", {
        username,
        password,
      });

      // 3. Guardar los tokens en localStorage
      localStorage.setItem("access", loginResponse.data.access);
      localStorage.setItem("refresh", loginResponse.data.refresh);

      showToast("Usuario registrado y autenticado", "success");

      // 4. Redirigir al usuario a la página de MessageList
      setTimeout(() => {
        navigate("/messages");
      }, 1500);
    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        const errors = err.response.data;
        Object.keys(errors).forEach((field) => {
          const messages = errors[field];
          messages.forEach((message) => {
            showToast(`${field}: ${message}`, "danger");  
          });
        });
      } else {
        showToast("Error al registrar el usuario", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1b] px-4 py-12">
      <div className="bg-gray-900 text-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Registro</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Usuario</label>
            <input
              type="text"
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Contraseña</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : null}
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        {/* Link para login */}
        <p className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/"
            className="text-blue-400 hover:text-blue-500 underline font-medium"
          >
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
// src/components/Register.jsx
