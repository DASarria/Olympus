import React from 'react';

// Interfaz para un estudiante
interface Estudiante {
  nombre: string;
  asistio: boolean;
  comentario: string;
}

// Interfaz para las props del componente
interface RegistroAsistenciasProps {
  fecha: string;
  horario: string;
  asistencias: number;
  estudiantes: Estudiante[];
  onClose: () => void;
  onMarcarTodas: () => void;
  onActualizarAsistencia: (index: number, asistio: boolean) => void;
  onActualizarComentario: (index: number, comentario: string) => void;
}

/**
 * Componente que muestra el panel de registro de asistencias
 * Mejorado según la imagen 3 y los estilos proporcionados
 */
const RegistroAsistencias: React.FC<RegistroAsistenciasProps> = ({
  fecha,
  horario,
  asistencias,
  estudiantes,
  onClose,
  onMarcarTodas,
  onActualizarAsistencia,
  onActualizarComentario
}) => {
  // Formatea el número de asistencias para mostrar siempre dos dígitos
  const formatearAsistencias = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md">
      {/* Encabezado con título y botón de cerrar */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-red-800">Registro de Asistencias</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tarjetas informativas */}
      <div className="p-4 grid grid-cols-3 gap-4">
        <div className="bg-blue-100 rounded-lg p-4">
          <h3 className="font-bold">{fecha}</h3>
          <p>Horario: {horario}</p>
          <p>Asistencias: {formatearAsistencias(asistencias)}</p>
        </div>

        <div className="bg-red-100 rounded-lg p-4">
          <h3 className="font-bold">{fecha}</h3>
          <p>Horario: {horario}</p>
          <p>Asistencias: {formatearAsistencias(asistencias)}</p>
        </div>

        <div className="bg-blue-500 text-white rounded-lg p-4">
          <h3 className="font-bold">{fecha}</h3>
          <p>Horario: {horario}</p>
          <p>Asistencias: {formatearAsistencias(asistencias)}</p>
        </div>
      </div>

      {/* Botón para marcar todas las asistencias */}
      <div className="px-4 pb-4">
        <button
          className="bg-red-800 text-white py-2 px-4 rounded w-full hover:bg-red-900 transition-colors"
          onClick={onMarcarTodas}
        >
          Marcar Todas asistencias positivas
        </button>
      </div>

      {/* Tabla de estudiantes */}
      <div className="px-4 pb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2 pr-4 w-1/3">Estudiante</th>
              <th className="text-center py-2 w-1/3">Asistencia</th>
              <th className="text-left py-2 pl-4 w-1/3">Comentario</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((estudiante, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 pr-4">
                  <span className={estudiante.asistio ? "text-blue-700 font-medium" : ""}>
                    {estudiante.nombre}
                  </span>
                </td>
                <td className="py-2 text-center">
                  {estudiante.asistio ? (
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded bg-red-800 text-white">
                      ✓
                    </span>
                  ) : (
                    <input
                      type="checkbox"
                      checked={estudiante.asistio}
                      onChange={() => onActualizarAsistencia(index, !estudiante.asistio)}
                      className="h-5 w-5 text-red-800 rounded focus:ring-red-800"
                    />
                  )}
                </td>
                <td className="py-2 pl-4">
                  <input
                    type="text"
                    value={estudiante.comentario || ''}
                    onChange={(e) => onActualizarComentario(index, e.target.value)}
                    placeholder="Agregar comentario"
                    className="border border-gray-300 rounded p-1 w-full text-gray-600"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistroAsistencias;