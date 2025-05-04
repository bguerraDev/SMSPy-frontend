import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "../services/getExportToastManager";
import { useEffect, useState, useRef } from "react";

function ProtectedRoute({ children }) {
  const accessToken = localStorage.getItem("access");
  const { showToast } = useToast();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const toastShownRef = useRef(false); // Flag para controlar el toast

  useEffect(() => {
    if (!accessToken) {
      if (location.pathname !== "/" && !toastShownRef.current) {
        showToast("Sesión caducada", "warning");
        toastShownRef.current = true; // Marca que ya se mostró
      }
      setShouldRedirect(true);
    }
  }, [accessToken, location, showToast]); // Dependencias para el efecto

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
// src/components/ProtectedRoute.jsx
