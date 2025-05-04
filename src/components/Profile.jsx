import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { useToast } from "../services/getExportToastManager";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          return; // Si no hay token, no intentes cargar el perfil
        }

        const response = await api.get("profile/");
        setUser(response.data);
        setPreviewUrl(
          response.data.avatar_url ? response.data.avatar_url : null
        );
      } catch (err) {
        console.error(err);
        showToast("Error al cargar el perfil", "danger");
      }
    };
    fetchProfile();
  }, [showToast]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const res = await api.put("profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      showToast("Perfil actualizado", "success");

      // Limpiar el archivo después de la actualización
      setAvatarFile(null);
      fileInputRef.current.value = null; // Limpiar el input de archivo
    } catch (err) {
      console.error(err);
      showToast("Error al actualizar el perfil", "danger");
    }
  };

  if (!user) {
    return (
      <div className="text-center text-white mt-10">Cargando perfil...</div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
    setTimeout(() => {
      const event = new CustomEvent("manualLogout");
      window.dispatchEvent(event);
    }, 100); // Pequeño delay para asegurar que se haya montado <App />
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Mi perfil</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Usuario</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
            value={user.username}
            disabled
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
            value={user.email}
            disabled
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Avatar actual</label>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar"
              className="rounded-full w-20 h-20 object-cover"
            />
          ) : (
            <p className="text-gray-400">Sin foto de perfil</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Cambiar avatar</label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="file-upload"
              className="btn-secondary cursor-pointer"
            >
              Seleccionar archivo
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />

            <span className="text-sm text-gray-400">
              {avatarFile ? avatarFile.name : "Ningún archivo seleccionado"}
            </span>
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={
            !avatarFile || (previewUrl && previewUrl === user.avatar_url)
          }
          title={
            !avatarFile
              ? "Sube una imagen para actualizar"
              : previewUrl === user.avatar_url
              ? "Selecciona una imagen diferente para actualizar"
              : "Haz clic para actualizar tu avatar"
          }
        >
          Actualizar
        </button>
      </form>
      <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/messages")}
          className="bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:scale-105 transition"
        >
          Ir a mis mensajes
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-6 rounded-lg hover:scale-105 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Profile;
// src/components/Profile.jsx
