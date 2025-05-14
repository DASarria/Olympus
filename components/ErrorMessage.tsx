import { on } from "events";
import React from "react";

interface props {
  message: string;
  onClose: () => void;
}

const ErrorMessage = ({ message, onClose}:props) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-96 p-4 bg-red-800 border border-red-900 text-white rounded-2xl shadow-xl">
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium">{message}</p>
        <button
          className="bg-white text-red-800 font-semibold py-1 px-3 rounded-lg hover:border-2 hover:border-red-900 transition"
          onClick={onClose}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;