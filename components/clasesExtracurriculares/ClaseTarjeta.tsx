'use client';

// src/components/clasesExtracurriculares/ClaseTarjeta.tsx
import React from 'react';

// Definir colores disponibles
const colorMapping: Record<string, string> = {
  blue: 'border-blue-500 bg-blue-50 hover:bg-blue-100',
  red: 'border-red-500 bg-red-50 hover:bg-red-100',
  green: 'border-green-500 bg-green-50 hover:bg-green-100',
  yellow: 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100',
  purple: 'border-purple-500 bg-purple-50 hover:bg-purple-100',
  pink: 'border-pink-500 bg-pink-50 hover:bg-pink-100',
  primary: 'border-red-800 bg-red-50 hover:bg-red-100',
  default: 'border-gray-500 bg-gray-50 hover:bg-gray-100',
};

interface Props {
  nombre?: string;
  fecha: string;
  horario: string;
  asistencias: number;
  color?: string;
  onClick: () => void;
  lugar?: string;
  tipo?: string;
}

export default function ClaseTarjeta({
  nombre = 'Clase Extracurricular',
  fecha,
  horario,
  asistencias,
  color = 'default',
  onClick,
  lugar,
  tipo
}: Props) {
  // Obtener las clases de color según la propiedad color
  const borderColorClass = colorMapping[color] || colorMapping.default;

  return (
    <div
      className={`border-l-4 rounded-lg shadow-md overflow-hidden ${borderColorClass} transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer`}
      onClick={onClick}
    >
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{nombre}</h3>
        <div className="text-sm text-gray-700 mb-2">{fecha}</div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">{horario}</span>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {asistencias} {asistencias === 1 ? 'asistencia' : 'asistencias'}
          </span>
        </div>
        
        {/* Mostrar lugar si está disponible */}
        {lugar && (
          <div className="text-xs text-gray-600 flex items-center mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {lugar}
          </div>
        )}
        
        {/* Mostrar tipo si está disponible */}
        {tipo && (
          <div className="mt-2">
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {tipo}
            </span>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 py-2 px-4 border-t border-gray-200">
        <span className="text-sm font-medium text-gray-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Ver detalles
        </span>
      </div>
    </div>
  );
}