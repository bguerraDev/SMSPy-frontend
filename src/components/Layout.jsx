// src/components/Layout.jsx
import React from "react";

function Layout({ children, center = false }) {
  return (
    <div
      className={`min-h-screen bg-[#0f0f1b] text-white ${
        center
          ? "flex items-center justify-center"
          : "px-4 py-8 md:px-12 lg:px-32"
      }`}
    >
      {children}
    </div>
  );
}

export default Layout;
