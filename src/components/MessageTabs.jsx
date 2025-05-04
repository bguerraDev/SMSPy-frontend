import { useState, useEffect } from "react";
import Pager from "./Pager";

function MessageTabs({
  receivedMessages,
  sentMessages,
  renderMessageCard,
  pagerReceivedProps,
  pagerSentProps,
}) {
  const [activeTab, setActiveTab] = useState("received");
  const [isMobile, setIsMobile] = useState(false);

  // Paginación interna
  const {
    totalMessages: totalReceived,
    messagesPerPage,
    currentPage: currentPageReceived,
    onPageChange: setCurrentPageReceived,
  } = pagerReceivedProps;

  const {
    totalMessages: totalSent,
    currentPage: currentPageSent,
    onPageChange: setCurrentPageSent,
  } = pagerSentProps;

  const paginatedReceived = receivedMessages.slice(
    (currentPageReceived - 1) * messagesPerPage,
    currentPageReceived * messagesPerPage
  );

  const paginatedSent = sentMessages.slice(
    (currentPageSent - 1) * messagesPerPage,
    currentPageSent * messagesPerPage
  );

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!isMobile) return null; // Don't render anything if not on mobile
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 rounded-l-full font-semibold transition-all duration-300 ${
            activeTab === "received"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setActiveTab("received")}
        >
          Recibidos
        </button>
        <button
          className={`px-4 py-2 rounded-r-full font-semibold transition-all duration-300 ${
            activeTab === "sent"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Enviados
        </button>
      </div>

      {activeTab === "received" && (
        <div className="space-y-4">
          {paginatedReceived.length === 0 ? (
            <p className="text-center">No hay mensajes recibidos</p>
          ) : (
            paginatedReceived.map((msg) => renderMessageCard(msg, false)) // Pass false to indicate it's a received message
          )}
          <Pager
            totalMessages={totalReceived}
            messagesPerPage={messagesPerPage}
            currentPage={currentPageReceived}
            onPageChange={setCurrentPageReceived}
          />
        </div>
      )}

      {activeTab === "sent" && (
        <div className="space-y-4">
          {paginatedSent.length === 0 ? (
            <p className="text-center">No hay mensajes enviados</p>
          ) : (
            paginatedSent.map((msg) => renderMessageCard(msg, true)) // Pass true to indicate it's a sent message
          )}
          <Pager
            totalMessages={totalSent}
            messagesPerPage={messagesPerPage}
            currentPage={currentPageSent}
            onPageChange={setCurrentPageSent}
          />
        </div>
      )}
    </div>
  );
}
export default MessageTabs;
// MessageTabs.jsx
// This component is responsible for rendering the tabs for received and sent messages in mobile view
