import React, { useState } from 'react';
import { useRouter } from 'next/router';

// Versión simplificada del componente de horario de clases
const HorarioClasesExacto = () => {
  const router = useRouter();
  
  const navegarA = (ruta) => {
    router.push(ruta);
  };

  // Estados básicos
  const [diaActual, setDiaActual] = useState(0);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  // Datos estáticos
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const actividades = [
    { id: 1, nombre: 'Taekwondo', color: 'bg-yellow-200', borderColor: 'border-l-4 border-yellow-500' },
    { id: 2, nombre: 'Tenis', color: 'bg-purple-200', borderColor: 'border-l-4 border-purple-500' },
    { id: 3, nombre: 'Basketball', color: 'bg-blue-200', borderColor: 'border-l-4 border-blue-500' },
    { id: 4, nombre: 'Ping Pong', color: 'bg-green-200', borderColor: 'border-l-4 border-green-500' },
    { id: 5, nombre: 'Fútbol', color: 'bg-rose-200', borderColor: 'border-l-4 border-rose-500' },
  ];

  const horas = [
    '7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const horarios = [
    [0, 'Taekwondo', '7:00', '9:00'],
    [0, 'Tenis', '8:00', '10:00'],
    [0, 'Basketball', '9:00', '12:00'],
    [1, 'Taekwondo', '9:00', '12:00'],
    [1, 'Ping Pong', '14:00', '16:00'],
    [2, 'Tenis', '7:00', '10:00'],
    [2, 'Fútbol', '10:00', '11:00'],
    [3, 'Tenis', '10:00', '13:00'],
    [3, 'Fútbol', '16:00', '18:00'],
    [4, 'Tenis', '7:00', '9:00'],
    [4, 'Ping Pong', '12:00', '14:00'],
    [5, 'Tenis', '8:00', '9:00'],
  ];

  // Funciones simplificadas
  const cambiarDia = (direccion) => {
    const nuevoDia = (diaActual + direccion + diasSemana.length) % diasSemana.length;
    setDiaActual(nuevoDia);
    setActividadSeleccionada(null);
  };

  // Obtener horarios del día actual
  const getHorariosDelDia = () => {
    const resultado = {};

    horarios
      .filter(([dia]) => dia === diaActual)
      .forEach(([_, nombre, inicio, fin]) => {
        const actividad = actividades.find(a => a.nombre === nombre);
        if (!actividad) return;

        if (!resultado[nombre]) resultado[nombre] = [];

        resultado[nombre].push({
          inicio,
          fin,
          inicioIdx: horas.indexOf(inicio),
          finIdx: horas.indexOf(fin)
        });
      });

    return resultado;
  };

  // Renderizado principal
  return (
    <div className="flex flex-col h-full bg-white p-6">
      {/* Título */}
      <h1 className="text-3xl font-bold text-red-800 mb-6">Clases Extracurriculares</h1>

      {/* Selector de días */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => cambiarDia(-1)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        <div className="text-lg font-medium">{diasSemana[diaActual]}</div>

        <button
          onClick={() => cambiarDia(1)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center"
        >
          Siguiente
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Tabla de horarios */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 shadow-sm">
        <div className="grid" style={{ gridTemplateColumns: "150px repeat(12, 1fr)" }}>
          {/* Cabecera */}
          <div className="p-2 border-b border-r border-gray-200 bg-gray-50 font-medium text-sm text-center">
            Actividad
          </div>
          {horas.map(hora => (
            <div key={hora} className="p-2 border-b border-r border-gray-200 bg-gray-50 font-medium text-sm text-center">
              {hora}
            </div>
          ))}

          {/* Filas de actividades */}
          {actividades.map(actividad => {
            const sesiones = getHorariosDelDia()[actividad.nombre] || [];

            return (
              <React.Fragment key={actividad.id}>
                {/* Nombre de actividad */}
                <div className="p-2 border-b border-r border-gray-200 bg-gray-50 font-medium text-sm">
                  {actividad.nombre}
                </div>

                {/* Bloques de horario */}
                <div className="col-span-12 border-b border-gray-200 relative grid grid-cols-12">
                  {sesiones.map((sesion, idx) => (
                    <div
                      key={`${actividad.id}-${idx}`}
                      className={`${actividad.color} ${actividad.borderColor} cursor-pointer h-12 flex items-center justify-center`}
                      style={{
                        gridColumnStart: sesion.inicioIdx + 1,
                        gridColumnEnd: `span ${sesion.finIdx - sesion.inicioIdx}`
                      }}
                      onClick={() => setActividadSeleccionada({
                        nombre: actividad.nombre,
                        inicio: sesion.inicio,
                        fin: sesion.fin
                      })}
                    />
                  ))}

                  {/* Líneas divisorias */}
                  {[...Array(11)].map((_, i) => (
                    <div
                      key={`line-${i}`}
                      className="absolute border-r border-gray-200 h-full"
                      style={{ left: `${(i + 1) * (100 / 12)}%` }}
                    />
                  ))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Panel de actividad seleccionada */}
      {actividadSeleccionada && (
        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{actividadSeleccionada.nombre}</h3>
              <p className="text-gray-600">{actividadSeleccionada.inicio} - {actividadSeleccionada.fin}</p>
            </div>
            <button
              onClick={() => setActividadSeleccionada(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-2 mt-4">
            <button className="bg-red-800 hover:bg-red-900 text-white px-3 py-1 rounded-md transition-colors text-sm">
              Ver asistencias
            </button>
            <button className="bg-red-800 hover:bg-red-900 text-white px-3 py-1 rounded-md transition-colors text-sm">
              Editar
            </button>
            <button className="bg-red-800 hover:bg-red-900 text-white px-3 py-1 rounded-md transition-colors text-sm">
              Borrar
            </button>
          </div>
        </div>
      )}

      {/* Botón de nueva actividad */}
      <div className="flex justify-end">
        <button 
        className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded transition-colors"
        onClick={() => navegarA('/clasesExtracurriculares/test')}
        >
          Nueva actividad
        </button>
      </div>
    </div>
  );
};

export default HorarioClasesExacto;