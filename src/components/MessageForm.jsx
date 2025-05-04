import { useEffect, useState } from "react";
import api from "../services/api";
import { useToast } from "../services/getExportToastManager";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function MessageForm() {
  const [content, setContent] = useState("");
  const [receiver, setReceiver] = useState("");
  const [image, setImage] = useState(null);
  const [users, setUsers] = useState([]);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("users/");
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        showToast("Error al cargar los usuarios", "danger");
      }
    };
    fetchUsers();
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    formData.append("receiver", receiver);
    if (image) {
      formData.append("image", image);
    }

    try {
      await api.post("messages/send/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast("Mensaje enviado", "success");
      setContent("");
      setReceiver("");
      setImage(null);
    } catch (err) {
      console.error(err);
      showToast("Error al enviar el mensaje", "danger");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-900 text-white rounded-xl shadow-md">
      <div className="max-w-xl mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-md mt-8">
        {/* Botón de retroceso */}
        <button
          onClick={() => navigate("/messages")}
          className="text-white hover:text-blue-400 transition mb-2 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">Enviar mensaje</h2> 

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Destinatario</label>
            <select
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              required
            >
              <option value="">Selecciona un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Mensaje</label>
            <textarea
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white resize-none"
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
            >
              Seleccionar archivo
            </label>
            <span className="text-gray-400">
              {image ? image.name : "Ningún archivo seleccionado"}
            </span>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-md text-white font-bold hover:scale-105 transition-transform"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessageForm;
// src/components/MessageForm.jsx
