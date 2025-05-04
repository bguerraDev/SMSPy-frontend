import React from "react";

function Pager({ totalMessages, messagesPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalMessages / messagesPerPage);

  if (totalPages <= 1) return null; // No need to show pager if there's only one page

  return (
    <div className="flex justify-center mt-6 space-x-6">
      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`relative text-lg font-medium transition-all duration-300 ease-in-out ${
            page === currentPage
              ? "text-white"
              : "text-gray-500 hover:text-white hover:scale-110"
          }`}
        >
          {page}
          {page === currentPage && (
            <span className="absolute left-1/2 -bottom-1.5 w-6 h-0.5 bg-white transform -translate-x-1/2" />
          )}
        </button>
      ))}
    </div>
  );
}
export default Pager;
// src/components/Pager.jsx
