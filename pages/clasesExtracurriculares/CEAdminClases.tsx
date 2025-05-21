import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HorarioClasesExacto = () => {
  const [diaActual, setDiaActual] = useState(0);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Datos estáticos que no cambian
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const mapDiaSemana = {
    'MONDAY': 0,
    'TUESDAY': 1,
    'WEDNESDAY': 2,
    'THURSDAY': 3,
    'FRIDAY': 4,
    'SATURDAY': 5,
  };
  
  const coloresActividades = [
    { color: 'bg-yellow-200', borderColor: 'border-l-4 border-yellow-500' },
    { color: 'bg-purple-200', borderColor: 'border-l-4 border-purple-500' },
    { color: 'bg-blue-200', borderColor: 'border-l-4 border-blue-500' },
    { color: 'bg-green-200', borderColor: 'border-l-4 border-green-500' },
    { color: 'bg-rose-200', borderColor: 'border-l-4 border-rose-500' },
    { color: 'bg-orange-200', borderColor: 'border-l-4 border-orange-500' },
    { color: 'bg-teal-200', borderColor: 'border-l-4 border-teal-500' },
    { color: 'bg-indigo-200', borderColor: 'border-l-4 border-indigo-500' },
  ];

  const horas = [
    '7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Cargar datos de la API
  useEffect(() => {
    const fetchActividades = async () => {
      setCargando(true);
      try {
        // Usando el endpoint para obtener las actividades y horarios
        const response = await axios.post(
          'https://hadesback-app-c5fwbybjd0gnf0fx.canadacentral-01.azurewebsites.net/api/activity/find/options',
          {
            year: new Date().getFullYear(),
            semester: 1, // Esto podría ser dinámico
            activityType: "", // Obtener todos los tipos
            teacherName: "",
            teacherId: 0,
            days: [],
            newActivity: "",
            resources: []
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        // Procesar actividades y formatear para su uso en el componente
        const actividadesData = processActivityData(response.data);
        setActividades(actividadesData.actividades);
        setHorarios(actividadesData.horarios);
        setCargando(false);
      } catch (err) {
        console.error("Error al obtener datos de actividades:", err);
        setError("No se pudieron cargar las actividades. Por favor, intente nuevamente más tarde.");
        setCargando(false);
      }
    };

    fetchActividades();
  }, []);

  // Función para procesar los datos de la API
  const processActivityData = (data) => {
    const procesadas = {
      actividades: [],
      horarios: []
    };
    
    // Mapa para asignar colores a las actividades
    const actividadesMap = new Map();
    
    // Si data es un array, procesarlo; si no, podría ser un objeto único
    const dataArray = Array.isArray(data) ? data : [data];
    
    dataArray.forEach((item, index) => {
      // Si la actividad no existe en nuestro mapa, agregarla
      if (!actividadesMap.has(item.activityType)) {
        const colorIndex = actividadesMap.size % coloresActividades.length;
        actividadesMap.set(item.activityType, {
          id: actividadesMap.size + 1,
          nombre: item.activityType,
          ...coloresActividades[colorIndex]
        });
      }
      
      // Procesar los horarios para cada día
      if (item.days && Array.isArray(item.days)) {
        item.days.forEach(day => {
          const diaIndice = mapDiaSemana[day.dayWeek] || 0;
          
          // Transformar la hora de formato "HH:MM:SS" a "HH:MM"
          const horaInicio = day.startHour.substring(0, 5);
          const horaFin = day.endHour.substring(0, 5);
          
          // Agregar a la lista de horarios
          procesadas.horarios.push([
            diaIndice,
            item.activityType,
            horaInicio,
            horaFin
          ]);
        });
      }
    });
    
    // Convertir el mapa a un array de actividades
    procesadas.actividades = Array.from(actividadesMap.values());
    
    return procesadas;
  };

  // Funciones para navegar entre días
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

      {/* Estado de carga */}
      {cargando && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-800"></div>
          <span className="ml-3 text-red-800">Cargando horarios...</span>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Tabla de horarios */}
      {!cargando && !error && (
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
      )}

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
        onClick={() => navegarA('/clasesExtracurriculares/CEAdminActividades')}
        >
          Nueva actividad
        </button>
      </div>
    </div>
  );
};

export default HorarioClasesExacto;