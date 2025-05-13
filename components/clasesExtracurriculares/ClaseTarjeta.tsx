import React from 'react';

// Interface para la clase extracurricular
interface ClaseTarjetaProps {
  fecha: string;
  horario: string;
  asistencias: number;
  color: string;
  onClick: () => void;
}

/**
 * Componente para mostrar una tarjeta de clase extracurricular
 * Mejorado según las imágenes proporcionadas
 */
const ClaseTarjeta: React.FC<ClaseTarjetaProps> = ({
  fecha,
  horario,
  asistencias,
  color,
  onClick
}) => {
  // Formatea el número de asistencias para mostrar siempre dos dígitos
  const formatearAsistencias = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  // Obtener la clase de color para la tarjeta
  const getBgColor = () => {
    switch (color) {
      case 'blue': return 'bg-blue-100';
      case 'red': return 'bg-red-100';
      case 'primary': return 'bg-blue-500 text-white';
      default: return 'bg-blue-100';
    }
  };

  return (
    <div className="rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      {/* Contenido principal de la tarjeta */}
      <div className={`p-4 ${getBgColor()}`}>
        <h3 className="font-bold text-lg">{fecha}</h3>
        <p>Horario: {horario}</p>
        <p>Asistencias: {formatearAsistencias(asistencias)}</p>
      </div>

      {/* Botón circular para más detalles */}
      <div className="bg-white p-4 flex justify-center">
        <button
          onClick={onClick}
          className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Texto "Click para más detalles" */}
      <div className="bg-white pb-4 text-center text-sm text-gray-500">
        Click para más detalles
      </div>
    </div>
  );
};

export default ClaseTarjeta;