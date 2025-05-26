'use client';

// src/components/clasesExtracurriculares/RegistroAsistencias.tsx
import React from 'react';

// Definir la interfaz Estudiante para tipado
interface Estudiante {
  id: string;
  nombre: string;
  asistio: boolean;
  comentario: string;
}

// Propiedades que recibe el componente
interface Props {
  fecha: string;
  horario: string;
  asistencias: number;
  estudiantes: Estudiante[];
  onClose: () => void;
  onMarcarTodas: () => void;
  onActualizarAsistencia: (index: number, asistio: boolean) => void;
  onActualizarComentario: (index: number, comentario: string) => void;
  soloLectura?: boolean; // Para modo estudiante
}

export default function RegistroAsistencias({
  fecha,
  horario,
  asistencias,
  estudiantes,
  onClose,
  onMarcarTodas,
  onActualizarAsistencia,
  onActualizarComentario,
  soloLectura = false // Por defecto, no es solo lectura
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Cabecera */}
      <div className="bg-red-800 text-white px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">{soloLectura ? 'Detalles de Asistencia' : 'Registro de Asistencia'}</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-red-200 focus:outline-none"
          aria-label="Cerrar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Información de la clase */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <div className="font-medium">{fecha}</div>
        <div className="text-gray-600">{horario}</div>
        <div className="text-sm text-gray-500 mt-1">
          Asistencias registradas: {asistencias}
        </div>
      </div>

      {/* Botón para marcar todas las asistencias - Solo visible para profesores */}
      {!soloLectura && (
        <div className="px-6 py-3 bg-gray-50 border-b flex justify-end">
          <button
            onClick={onMarcarTodas}
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Marcar Todas asistencias positivas
          </button>
        </div>
      )}

      {/* Lista de estudiantes */}
      <div className="px-6 py-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asistencia
                </th>
                {!soloLectura && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comentario
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {estudiantes.map((estudiante, index) => (
                <tr key={estudiante.id || index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{estudiante.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {soloLectura ? (
                      <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                        estudiante.asistio 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {estudiante.asistio ? 'Asistió' : 'No asistió'}
                      </span>
                    ) : (
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={estudiante.asistio}
                          onChange={(e) => onActualizarAsistencia(index, e.target.checked)}
                          className="form-checkbox h-5 w-5 text-red-800 focus:ring-red-500 border-gray-300 rounded"
                        />
                      </label>
                    )}
                  </td>
                  {!soloLectura && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={estudiante.comentario}
                        onChange={(e) => onActualizarComentario(index, e.target.value)}
                        placeholder="Agregar comentario"
                        className="border border-gray-300 px-3 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pie con botones */}
      <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {soloLectura ? 'Cerrar' : 'Cancelar'}
        </button>
        
        {!soloLectura && (
          <button
            onClick={onClose} // Normalmente aquí iría una función para guardar cambios
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Guardar Cambios
          </button>
        )}
      </div>
    </div>
  );
}    