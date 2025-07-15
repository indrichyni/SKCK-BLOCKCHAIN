import React from "react";

export default function Button({ children, ...props }) {
  return (
    <button
      className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      {...props}
    >
      {children}
    </button>
  );
}
