import React, { useState, useEffect } from 'react';

interface Actividad {
  id: string;
  activityType: string;
  days: { dayWeek: string; startHour: string; endHour: string; }[];
}

interface ActividadProcesada {
  id: number;
  nombre: string;
  color: string;
  borderColor: string;
}

const HorarioClasesOptimizado: React.FC = () => {
  const [diaActual, setDiaActual] = useState(0);
  const [actividadSeleccionada, setActividadSeleccionada] = useState<{ nombre: string; inicio: string; fin: string; } | null>(null);
  const [actividades, setActividades] = useState<ActividadProcesada[]>([]);
  const [horarios, setHorarios] = useState<[number, string, string, string][]>([]);
  const [actividadesRaw, setActividadesRaw] = useState<Actividad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tokenJWT = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJOYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGVzY3VlbGFpbmcuZWR1LmNvIiwibmFtZSI6ImVsIGFkbWluIiwicm9sZSI6IkFETUlOIiwic3BlY2lhbHR5IjoibnVsbCIsImV4cCI6MTc0ODIyMjU0MX0.-2xp9JoodiBDy3g8i9c0uYmnBGygxsPorEvXM1N68_M";
  const linkAPI = "https://hadesback-app-c5fwbybjd0gnf0fx.canadacentral-01.azurewebsites.net";

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const mapDiaSemana = { MONDAY: 0, TUESDAY: 1, WEDNESDAY: 2, THURSDAY: 3, FRIDAY: 4, SATURDAY: 5 };
  const colores = [
    { color: 'bg-yellow-200', borderColor: 'border-l-4 border-yellow-500' },
    { color: 'bg-purple-200', borderColor: 'border-l-4 border-purple-500' },
    { color: 'bg-blue-200', borderColor: 'border-l-4 border-blue-500' },
    { color: 'bg-green-200', borderColor: 'border-l-4 border-green-500' },
    { color: 'bg-rose-200', borderColor: 'border-l-4 border-rose-500' },
    { color: 'bg-orange-200', borderColor: 'border-l-4 border-orange-500' },
    { color: 'bg-teal-200', borderColor: 'border-l-4 border-teal-500' },
    { color: 'bg-indigo-200', borderColor: 'border-l-4 border-indigo-500' },
  ];
  const horas = ['07:00', '08:30', '10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00'];

  const formatearHora = (hora: string) => {
    const [h, m] = hora.split(':').map(Number);
    const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const extraerHora = (timeStr: string) => {
    if (!timeStr) return '';
    const hourStr = timeStr.includes('T') ? timeStr.split('T')[1].substring(0, 5) : timeStr.substring(0, 5);
    const [hours, minutes] = hourStr.split(':').map(Number);
    let correctedHours = hours - 5;
    if (correctedHours < 0) correctedHours += 24;
    return `${correctedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const fetchActividades = async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch(`${linkAPI}/api/activity/all`, { headers: { Authorization: tokenJWT } });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setActividadesRaw(data);
      
      const actividadesMap = new Map();
      const horariosArray: [number, string, string, string][] = [];
      
      data.forEach((actividad: Actividad) => {
        if (!actividadesMap.has(actividad.activityType)) {
          actividadesMap.set(actividad.activityType, {
            id: actividadesMap.size + 1,
            nombre: actividad.activityType,
            ...colores[actividadesMap.size % colores.length]
          });
        }
        
        actividad.days?.forEach(day => {
          const diaIdx = mapDiaSemana[day.dayWeek as keyof typeof mapDiaSemana];
          if (diaIdx !== undefined) {
            const inicio = extraerHora(day.startHour);
            const fin = extraerHora(day.endHour);
            if (inicio && fin) horariosArray.push([diaIdx, actividad.activityType, inicio, fin]);
          }
        });
      });
      
      setActividades(Array.from(actividadesMap.values()));
      setHorarios(horariosArray);
    } catch {
      setError("Error al cargar actividades");
    } finally {
      setCargando(false);
    }
  };

  const buscarIndice = (timeStr: string) => {
    const idx = horas.indexOf(timeStr);
    if (idx !== -1) return idx;
    const [h, m] = timeStr.split(':').map(Number);
    const total = h * 60 + m;
    return horas.reduce((closest, hora, i) => {
      const [hh, mm] = hora.split(':').map(Number);
      const diff = Math.abs((hh * 60 + mm) - total);
      return diff < Math.abs((horas[closest].split(':').map(Number).reduce((a, b, i) => i === 0 ? b * 60 : a + b, 0)) - total) ? i : closest;
    }, 0);
  };

  const obtenerHorarios = () => {
    const resultado: Record<string, any[]> = {};
    horarios.filter(([dia]) => dia === diaActual).forEach(([_, nombre, inicio, fin]) => {
      const actividad = actividades.find(a => a.nombre === nombre);
      if (!actividad) return;
      if (!resultado[nombre]) resultado[nombre] = [];
      
      let inicioIdx = buscarIndice(inicio);
      let finIdx = buscarIndice(fin);
      if (finIdx <= inicioIdx) finIdx = inicioIdx + 1;
      
      resultado[nombre].push({ inicio, fin, inicioIdx, finIdx });
    });
    return resultado;
  };

  useEffect(() => { fetchActividades(); }, []);

  const cambiarDia = (dir: number) => {
    setDiaActual((diaActual + dir + diasSemana.length) % diasSemana.length);
    setActividadSeleccionada(null);
  };

  const verAsistencias = (nombre: string) => {
    const actividad = actividadesRaw.find(act => act.activityType === nombre);
    if (actividad) console.log(`/asistencias/${actividad.id}`);
  };

  return (
    <div className="flex flex-col h-full bg-white p-6" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#990000' }}>Clases Extracurriculares</h1>

      <div className="flex justify-between items-center mb-4">
        <button onClick={() => cambiarDia(-1)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Anterior
        </button>
        <div className="text-lg font-medium text-gray-800">{diasSemana[diaActual]}</div>
        <button onClick={() => cambiarDia(1)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center">
          Siguiente
          <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {cargando && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#990000' }}></div>
          <span className="ml-3" style={{ color: '#990000' }}>Cargando...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button onClick={fetchActividades} className="mt-2 text-sm underline">Reintentar</button>
        </div>
      )}

      {!cargando && !error && actividades.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 shadow-sm">
          <div className="grid overflow-x-auto" style={{ gridTemplateColumns: `150px repeat(${horas.length}, 1fr)` }}>
            <div className="p-2 border-b border-r border-gray-200 bg-gray-50 font-medium text-sm text-center">Actividad</div>
            {horas.map(hora => (
              <div key={hora} className="p-2 border-b border-r border-gray-200 bg-gray-50 font-medium text-xs text-center min-w-[60px]">
                {formatearHora(hora)}
              </div>
            ))}

            {actividades.map(actividad => {
              const sesiones = obtenerHorarios()[actividad.nombre] || [];
              return (
                <React.Fragment key={actividad.id}>
                  <div className="p-2 border-b border-r border-gray-200 bg-gray-50 font-medium text-sm">{actividad.nombre}</div>
                  <div className="border-b border-gray-200 relative grid" style={{ gridTemplateColumns: `repeat(${horas.length}, 1fr)`, gridColumn: '2 / -1' }}>
                    {sesiones.map((sesion, idx) => (
                      <div
                        key={idx}
                        className={`${actividad.color} ${actividad.borderColor} cursor-pointer h-12 flex items-center justify-center text-xs font-medium hover:opacity-80`}
                        style={{ gridColumnStart: sesion.inicioIdx + 1, gridColumnEnd: `span ${sesion.finIdx - sesion.inicioIdx}` }}
                        onClick={() => setActividadSeleccionada({ nombre: actividad.nombre, inicio: sesion.inicio, fin: sesion.fin })}
                        title={`${actividad.nombre}: ${formatearHora(sesion.inicio)} - ${formatearHora(sesion.fin)}`}
                      >
                        {formatearHora(sesion.inicio)} - {formatearHora(sesion.fin)}
                      </div>
                    ))}
                    {[...Array(horas.length - 1)].map((_, i) => (
                      <div key={i} className="absolute border-r border-gray-200 h-full" style={{ left: `${(i + 1) * (100 / horas.length)}%` }} />
                    ))}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {!cargando && !error && actividades.length === 0 && (
        <div className="text-center py-10 text-gray-500">No hay actividades programadas para este día.</div>
      )}

      {actividadSeleccionada && (
        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{actividadSeleccionada.nombre}</h3>
              <p className="text-gray-600">{formatearHora(actividadSeleccionada.inicio)} - {formatearHora(actividadSeleccionada.fin)}</p>
              <p className="text-gray-500 text-sm">{diasSemana[diaActual]}</p>
            </div>
            <button onClick={() => setActividadSeleccionada(null)} className="text-gray-400 hover:text-gray-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex space-x-2 mt-4">
            {['Ver asistencias', 'Editar', 'Borrar'].map(texto => (
              <button 
                key={texto}
                onClick={() => texto === 'Ver asistencias' && verAsistencias(actividadSeleccionada.nombre)}
                className="text-white px-3 py-1 rounded-md text-sm hover:opacity-90" 
                style={{ backgroundColor: '#990000' }}
              >
                {texto}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button className="text-white px-4 py-2 rounded hover:opacity-90" style={{ backgroundColor: '#990000' }}>
          Nueva actividad
        </button>
      </div>
    </div>
  );
};

export default HorarioClasesOptimizado;