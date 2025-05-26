import React from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const FloatingConfigurationView: React.FC<Props> = ({ visible, onClose, children }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Fondo que cubre toda la pantalla y aplica el blur */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(8px)", // desenfoque global
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Ventana centrada */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative bg-white rounded-xl shadow-lg p-6 w-[320px] max-w-full">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-xl"
          >
            ×
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FloatingConfigurationView;