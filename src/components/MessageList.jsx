import MessageCard from "./MessageCard";
import { useEffect, useState, useMemo, useRef } from "react";
import api from "../services/api";
import GradientButton from "./GradientButton";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/default-avatar.png";
import Pager from "./Pager"; // Importa el componente Pager para la paginación
import {
  Search,
  Filter,
  XCircle,
  MoreVertical,
  User,
  Send,
} from "lucide-react"; // Importa los iconos de lucide-react
import { parse } from "date-fns"; // Importa la función parse de date-fns
import MessageTabs from "./MessageTabs";

function MessageList() {
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [expandedMessageId, setExpandedMessageId] = useState(null); // State to control the expanded message

  const [currentPageReceived, setCurrentPageReceived] = useState(1);
  const [currentPageSent, setCurrentPageSent] = useState(1);

  const messagesPerPage = 10;

  const handleImageClick = (imgUrl) => {
    console.log("Image clicked:", imgUrl);
    setSelectedImage(imgUrl);
  };

  const [isAtBottom, setIsAtBottom] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterUserId, setFilterUserId] = useState("");
  const [filterDateRange, setFilterDateRange] = useState({
    from: "",
    to: "",
  });
  const [users, setUsers] = useState([]);
  const [currentUsername, setCurrentUsername] = useState("");

  const [tempFilterUserId, setTempFilterUserId] = useState("");
  const [tempDateRange, setTempDateRange] = useState({ from: "", to: "" });

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef(null);

  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  const closeModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const [receivedResponse, sentResponse, usersResponse] =
          await Promise.all([
            api.get("messages/received/"),
            api.get("messages/sent/"),
            api.get("users/"),
          ]);
        setReceivedMessages(receivedResponse.data);
        setSentMessages(sentResponse.data);
        setUsers(usersResponse.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los mensajes");
      }
    };
    fetchMessages();
  }, [setError]);

  useEffect(() => {
    const storedToken = localStorage.getItem("access");
    if (storedToken) {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      setCurrentUsername(payload.username);
    }
  }, []);

  // Scroll to the bottom of the page when the component mounts
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.body.scrollHeight;
      // Si estás casi al final de la página (margen de 100px)
      setIsAtBottom(scrollPosition >= pageHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileMenu]);

  const uniqueUserInteractions = useMemo(() => {
    const usernames = new Set();
    [...receivedMessages, ...sentMessages].forEach((msg) => {
      if (msg.sender_username !== currentUsername)
        usernames.add(msg.sender_username);
      if (msg.receiver_username !== currentUsername)
        usernames.add(msg.receiver_username);
    });
    return [...usernames];
  }, [receivedMessages, sentMessages, currentUsername]);

  const clearFilters = () => {
    setFilterUserId("");
    setFilterDateRange({ from: "", to: "" });
  };

  const filterAndSearch = (messages, isSent = false) => {
    return messages.filter((msg) => {
      const matchesSearch = [
        msg.sender_username,
        msg.receiver_username,
        msg.content,
        msg.sent_at,
      ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesUser = filterUserId
        ? isSent
          ? msg.receiver.toString() === filterUserId
          : msg.sender.toString() === filterUserId
        : true;

      const from = filterDateRange.from ? new Date(filterDateRange.from) : null;
      const to = filterDateRange.to ? new Date(filterDateRange.to) : null;
      let msgDate = null;
      try {
        const cleaned = msg.sent_at.split(" CEST")[0]; // quita zona horaria
        msgDate = parse(cleaned, "dd/MM/yyyy HH:mm:ss", new Date());

        if (isNaN(msgDate)) {
          console.error("Fecha inválida tras parseo:", cleaned, "→", msgDate);
        }
      } catch (err) {
        console.error("Error al parsear fecha:", msg.sent_at, err);
      }

      const matchesDate = (!from || msgDate >= from) && (!to || msgDate <= to);

      return matchesSearch && matchesUser && matchesDate;
    });
  };

  const filteredReceived = filterAndSearch(receivedMessages);
  const filteredSent = filterAndSearch(sentMessages, true);

  const paginatedReceived = filteredReceived.slice(
    (currentPageReceived - 1) * messagesPerPage,
    currentPageReceived * messagesPerPage
  );
  const paginatedSent = filteredSent.slice(
    (currentPageSent - 1) * messagesPerPage,
    currentPageSent * messagesPerPage
  );
  const showActiveFilters =
    filterUserId || filterDateRange.from || filterDateRange.to;

  return (
    <div className="container mx-auto mt-8 px-4">
      {(filteredReceived.length > messagesPerPage ||
        filteredSent.length > messagesPerPage) && (
        <button
          onClick={() =>
            window.scrollTo({
              top: isAtBottom ? 0 : document.body.scrollHeight,
              behavior: "smooth",
            })
          }
          className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold py-3 px-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
        >
          {isAtBottom ? "↑" : "↓"}
        </button>
      )}

      <div className="flex items-center justify-between mb-6">
        {/* Título y menú alineado */}
        <div className="flex justify-between items-center w-full">
          <h2 className="text-3xl font-bold">Mensajes</h2>

          {/* DESKTOP VIEW */}
          <div className="hidden md:flex gap-4 ml-4">
            <GradientButton
              label="Mi Perfil"
              variant="primary"
              onClick={() => navigate("/profile")}
            />
            <GradientButton
              label="Enviar Mensaje"
              variant="secondary"
              onClick={() => navigate("/messages/send")}
            />
          </div>

          {/* MOBILE OVERFLOW MENU */}
          <div className="md:hidden relative ml-4" ref={mobileMenuRef}>
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-gray-300"
            >
              <MoreVertical className="w-6 h-6" />
            </button>
            {showMobileMenu && (
              <div className="absolute right-0 mt-2 bg-gray-900 border border-gray-700 rounded shadow-lg z-50">
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-700"
                  onClick={() => {
                    setShowMobileMenu(false);
                    navigate("/profile");
                  }}
                >
                  <User className="w-4 h-4" /> Mi Perfil
                </button>
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-700"
                  onClick={() => {
                    setShowMobileMenu(false);
                    navigate("/messages/send");
                  }}
                >
                  <Send className="w-4 h-4" /> Enviar Mensaje
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => {
            setTempFilterUserId(filterUserId);
            setTempDateRange(filterDateRange);
            setShowFilterModal(true);
          }}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
        >
          <Filter className="w-5 h-5 text-gray-100" />
          {/* TODO PONER O NO NOMBRE DE FILTRO */}
        </button>

        <div
          className={`flex hover:bg-gray-700 items-center border border-gray-600 bg-gray-800 rounded-full transition-all duration-300 ease-in-out overflow-hidden ${
            isSearchExpanded
              ? "w-[200px] px-3 py-2"
              : "w-14 h-10 justify-center"
          }`}
          onClick={() => setIsSearchExpanded(true)}
        >
          <Search className="h-5 w-5 text-gray-100" />
          {isSearchExpanded && (
            <input
              type="text"
              placeholder="Buscar mensajes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPageReceived(1); // Reset page when searching
                setCurrentPageSent(1);
              }}
              className="ml-2 w-full bg-transparent outline-none text-white"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
        {isSearchExpanded && (
          <button
            onClick={() => {
              setSearchTerm("");
              setIsSearchExpanded(false);
            }}
            className="text-gray-400 hover:text-red-400"
          >
            ✕
          </button>
        )}
      </div>

      {showActiveFilters && (
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <span className="text-sm">
              Filtros activos:
              {filterUserId &&
                ` usuario=${
                  users.find((u) => u.id.toString() === filterUserId)?.username
                }`}
              {filterDateRange.from && ` desde=${filterDateRange.from}`}
              {filterDateRange.to && ` hasta=${filterDateRange.to}`}
            </span>
            <button onClick={clearFilters} className="hover:text-red-400">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="hidden md:grid grid-cols-2 gap-8">
        {/* RECIBIDOS */}
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-gray-500 mb-4">
            Mensajes recibidos
          </h3>
          {paginatedReceived.length === 0 ? (
            <p>No hay mensajes recibidos</p>
          ) : (
            paginatedReceived.map((msg) => (
              <MessageCard
                key={msg.id}
                senderUsername={msg.sender_username}
                receiverUsername={msg.receiver_username}
                content={msg.content}
                image={msg.image}
                sentAt={`${msg.sent_at}`}
                isSent={false}
                avatarUrl={msg.sender_avatar_url || defaultAvatar}
                onImageClick={handleImageClick}
                expanded={expandedMessageId === msg.id}
                onToggleExpand={() =>
                  setExpandedMessageId(
                    expandedMessageId === msg.id ? null : msg.id
                  )
                }
              />
            ))
          )}
          <Pager
            totalMessages={filteredReceived.length}
            messagesPerPage={messagesPerPage}
            currentPage={currentPageReceived}
            onPageChange={setCurrentPageReceived}
          />
        </div>
        {/* ENVIADOS */}
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-gray-500 mb-4">
            Mensajes enviados
          </h3>
          {paginatedSent.length === 0 ? (
            <p>No hay mensajes enviados</p>
          ) : (
            paginatedSent.map((msg) => (
              <MessageCard
                key={msg.id}
                senderUsername={msg.sender_username}
                receiverUsername={msg.receiver_username}
                content={msg.content}
                image={msg.image}
                sentAt={`${msg.sent_at}`}
                isSent={true}
                avatarUrl={msg.receiver_avatar_url || defaultAvatar}
                onImageClick={handleImageClick}
                expanded={expandedMessageId === msg.id}
                onToggleExpand={() =>
                  setExpandedMessageId(
                    expandedMessageId === msg.id ? null : msg.id
                  )
                }
              />
            ))
          )}
          <Pager
            totalMessages={filteredSent.length}
            messagesPerPage={messagesPerPage}
            currentPage={currentPageSent}
            onPageChange={setCurrentPageSent}
          />
        </div>
      </div>
      {/* MOBILE VIEW TODO ARREGLAR TAB DE MENSAJE ENVIADO PARA. NO SE MUESTRA EL LITERAL CORRECTAMENTE */}
      <div className="md:hidden">
        <MessageTabs
          receivedMessages={filteredReceived}
          sentMessages={filteredSent}
          renderMessageCard={(msg, isSent) => (
            <MessageCard
              key={msg.id}
              senderUsername={msg.sender_username}
              receiverUsername={msg.receiver_username}
              content={msg.content}
              image={msg.image}
              sentAt={`${msg.sent_at}`}
              isSent={isSent}
              avatarUrl={
                msg.sender_username === currentUsername
                  ? msg.receiver_avatar_url
                  : msg.sender_avatar_url || defaultAvatar
              }
              onImageClick={handleImageClick}
              expanded={expandedMessageId === msg.id}
              onToggleExpand={() =>
                setExpandedMessageId(
                  expandedMessageId === msg.id ? null : msg.id
                )
              }
            />
          )}
          currentUsername={currentUsername}
          pagerReceivedProps={{
            totalMessages: filteredReceived.length,
            messagesPerPage,
            currentPage: currentPageReceived,
            onPageChange: setCurrentPageReceived,
          }}
          pagerSentProps={{
            totalMessages: filteredSent.length,
            messagesPerPage,
            currentPage: currentPageSent,
            onPageChange: setCurrentPageSent,
          }}
        />
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade"
          onClick={closeModal}
        >
          <img
            src={selectedImage}
            alt="Vista ampliada"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg cursor-zoom-out"
          />
        </div>
      )}

      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center animate-fade">
          <div className="bg-gray-900 text-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Filtrar mensajes</h2>
            <div className="mb-4">
              <label className="block text-sm mb-1">Usuario</label>
              <select
                value={tempFilterUserId}
                onChange={(e) => setTempFilterUserId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded p-2"
              >
                <option value="">-- Todos --</option>
                {users
                  .filter((u) => uniqueUserInteractions.includes(u.username))
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
              </select>
            </div>
            {/* Estados temporales para evitar aplicar el filtro automáticamente */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Desde</label>
              <input
                type="date"
                value={tempDateRange.from}
                onChange={(e) =>
                  setTempDateRange({
                    ...tempDateRange,
                    from: e.target.value,
                  })
                }
                className="w-full bg-gray-800 border border-gray-600 rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Hasta</label>
              <input
                type="date"
                value={tempDateRange.to}
                onChange={(e) =>
                  setTempDateRange({ ...tempDateRange, to: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-600 rounded p-2"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-sm text-gray-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setCurrentPageReceived(1); // Reset page when applying filters
                  setCurrentPageSent(1);
                  setFilterUserId(tempFilterUserId);
                  setFilterDateRange(tempDateRange);
                  setShowFilterModal(false);
                }}
                className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageList;
