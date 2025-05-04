import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";
import Profile from "./components/Profile";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { useToast } from "./services/getExportToastManager";

function App() {
  const { showToast } = useToast();
  useEffect(() => {
    const handleManualLogout = () => {
      showToast("Sesión cerrada", "success");
    };

    window.addEventListener("manualLogout", handleManualLogout);

    return () => {
      window.removeEventListener("manualLogout", handleManualLogout);
    };
  }, [showToast]);

  return (
    //<div className="min-h-screen bg-white text-black dark:bg-[#0f0f1b] dark:text-white">
    <div className="bg-[#0f0f1b] text-white min-h-screen">
      {
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessageList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages/send"
              element={
                <ProtectedRoute>
                  <MessageForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      }
    </div>
  );
}

export default App;
