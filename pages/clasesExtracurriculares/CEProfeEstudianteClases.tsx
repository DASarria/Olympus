import React, { useState, useEffect } from 'react';

interface Asistencia {
  estudiante: string;
  asistio: boolean;
}

interface ClaseExtracurricular {
  id: string;
  nombre: string;
  color: string;
  fecha: string;
  horario: string;
  asistencias: number;
  detalles: Asistencia[];
}

const ClasesExtracurriculares: React.FC = () => {
  const userRole = "estudiante";
  const [clases, setClases] = useState<ClaseExtracurricular[]>([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState<ClaseExtracurricular | null>(null);
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);
  const [vistaAsistencia, setVistaAsistencia] = useState(false);
  
  const puedeEditar = userRole === "profesor";
  const tarjetasPorPagina = 5;

  useEffect(() => {
    const clasesEjemplo: ClaseExtracurricular[] = [
      {
        id: '1',
        nombre: 'PING PONG',
        color: 'bg-pink-100 border-pink-500',
        fecha: 'Martes, 20 junio',
        horario: '1:00pm - 3:00pm',
        asistencias: 2,
        detalles: [
          { estudiante: 'María Paula Sánchez Macías', asistio: false },
          { estudiante: 'Diego Alejandro Ruiz', asistio: false },
          { estudiante: 'Carlos Andrés Vargas', asistio: false }
        ]
      },
      {
        id: '2',
        nombre: 'PING PONG',
        color: 'bg-red-100 border-red-500',
        fecha: 'Jueves, 22 junio',
        horario: '1:00pm - 3:00pm',
        asistencias: 2,
        detalles: [
          { estudiante: 'Carlos Andrés Pérez', asistio: true },
          { estudiante: 'Juan Diego Martínez', asistio: true }
        ]
      },
      {
        id: '3',
        nombre: 'PING PONG',
        color: 'bg-blue-100 border-blue-500',
        fecha: 'Lunes, 26 junio',
        horario: '1:00pm - 3:00pm',
        asistencias: 2,
        detalles: [
          { estudiante: 'Ana María López', asistio: true },
          { estudiante: 'Pedro Sánchez', asistio: false }
        ]
      },
      {
        id: '4',
        nombre: 'FÚTBOL',
        color: 'bg-green-100 border-green-500',
        fecha: 'Miércoles, 21 junio',
        horario: '3:00pm - 5:00pm',
        asistencias: 5,
        detalles: [
          { estudiante: 'Luisa Fernanda Gómez', asistio: true },
          { estudiante: 'Santiago Ramírez', asistio: true }
        ]
      }
    ];
    setClases(clasesEjemplo);
  }, []);

  const siguienteSlide = () => {
    if (indiceCarrusel + tarjetasPorPagina < clases.length) {
      setIndiceCarrusel(indiceCarrusel + 1);
    }
  };

  const anteriorSlide = () => {
    if (indiceCarrusel > 0) {
      setIndiceCarrusel(indiceCarrusel - 1);
    }
  };

  const seleccionarClase = (clase: ClaseExtracurricular) => {
    setClaseSeleccionada(clase);
    setVistaAsistencia(true);
  };

  const volverALista = () => {
    setVistaAsistencia(false);
    setClaseSeleccionada(null);
  };

  const marcarTodasAsistencias = () => {
    if (!claseSeleccionada || !puedeEditar) return;
    
    const nuevosDetalles = claseSeleccionada.detalles.map(detalle => ({
      ...detalle,
      asistio: true
    }));

    const nuevaClaseSeleccionada = {
      ...claseSeleccionada,
      detalles: nuevosDetalles
    };

    setClaseSeleccionada(nuevaClaseSeleccionada);
    
    const nuevasClases = clases.map(clase => 
      clase.id === claseSeleccionada.id ? nuevaClaseSeleccionada : clase
    );
    
    setClases(nuevasClases);
  };

  const actualizarAsistencia = (indiceEstudiante: number, asistio: boolean) => {
    if (!claseSeleccionada || !puedeEditar) return;
    
    const nuevosDetalles = [...claseSeleccionada.detalles];
    nuevosDetalles[indiceEstudiante] = {
      ...nuevosDetalles[indiceEstudiante],
      asistio
    };

    const nuevaClaseSeleccionada = {
      ...claseSeleccionada,
      detalles: nuevosDetalles
    };

    setClaseSeleccionada(nuevaClaseSeleccionada);
    
    const nuevasClases = clases.map(clase => 
      clase.id === claseSeleccionada.id ? nuevaClaseSeleccionada : clase
    );
    
    setClases(nuevasClases);
  };

  const CalendarioSemanal = () => {
    const dias = ['Lunes', 'Mar', 'Miér', 'Juev', 'Vier', 'Sáb'];
    
    return (
      <div className="w-full border border-blue-200 rounded-md overflow-hidden mb-6">
        <div className="grid grid-cols-6 border-b">
          {dias.map((dia, index) => (
            <div key={index} className="text-center py-2 border-r last:border-r-0 font-medium text-gray-700">
              {dia}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-6 h-24">
          {dias.map((_, index) => (
            <div key={index} className="border-r last:border-r-0 p-2">
              {index === 0 || index === 1 || index === 3 ? (
                <div className="bg-pink-100 p-2 h-full flex items-center justify-center text-center text-sm">
                  PING PONG<br />
                  1:00 - 3:00
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TarjetaClase = ({ clase }: { clase: ClaseExtracurricular }) => {
    return (
      <div 
        className={`rounded-lg shadow-md overflow-hidden border ${clase.color.split(' ')[1]} cursor-pointer transition-transform hover:scale-105 h-full`}
        onClick={() => seleccionarClase(clase)}
      >
        <div className={`p-4 ${clase.color.split(' ')[0]}`}>
          <h3 className="font-bold text-lg mb-1">{clase.fecha}</h3>
          <div className="text-gray-700">
            <p>Horario: {clase.horario}</p>
            <p>Asistencias: {clase.asistencias < 10 ? `0${clase.asistencias}` : clase.asistencias}</p>
          </div>
        </div>
        <div className="bg-white p-4 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <span className="text-sm text-gray-500">Click para más detalles</span>
          </div>
        </div>
      </div>
    );
  };

  const VistaLista = () => {
    const clasesVisibles = clases.slice(indiceCarrusel, indiceCarrusel + tarjetasPorPagina);
    const totalPaginas = Math.ceil(clases.length / tarjetasPorPagina);
    const paginaActual = Math.floor(indiceCarrusel / tarjetasPorPagina);

    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {clasesVisibles.map((clase) => (
            <TarjetaClase key={clase.id} clase={clase} />
          ))}
        </div>
        
        <div className="flex justify-center items-center space-x-4 mb-8">
          <button 
            onClick={anteriorSlide}
            disabled={indiceCarrusel === 0}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md disabled:opacity-50"
          >
            ←
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: totalPaginas }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setIndiceCarrusel(i * tarjetasPorPagina)}
                className={`w-3 h-3 rounded-full transition-all ${i === paginaActual ? 'bg-red-800 scale-125' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          
          <button 
            onClick={siguienteSlide}
            disabled={indiceCarrusel + tarjetasPorPagina >= clases.length}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>
    );
  };

  const VistaClaseSeleccionada = () => {
    if (!claseSeleccionada) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden mb-8 w-full">
        <div className={`p-6 ${claseSeleccionada.color.split(' ')[0]}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{claseSeleccionada.nombre}</h2>
              <p className="text-gray-700 font-medium">{claseSeleccionada.fecha}</p>
              <p className="text-gray-600">Horario: {claseSeleccionada.horario}</p>
            </div>
            <button 
              onClick={volverALista}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-red-800">Registro de Asistencias</h3>
            
            {puedeEditar && (
              <div className="flex space-x-3">
                <button 
                  onClick={marcarTodasAsistencias}
                  className="bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-900 transition-colors text-sm"
                >
                  Marcar Todas Positivas
                </button>
              </div>
            )}
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-8 bg-gray-100 py-3 px-4 border-b">
              <div className="col-span-4 font-semibold">Estudiante</div>
              <div className="col-span-4 font-semibold text-center">Asistencia</div>
            </div>

            {claseSeleccionada.detalles.map((detalle, index) => (
              <div key={index} className="grid grid-cols-8 py-3 px-4 border-b last:border-b-0">
                <div className="col-span-4">{detalle.estudiante}</div>
                <div className="col-span-4 flex justify-center">
                  {puedeEditar ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => actualizarAsistencia(index, true)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          detalle.asistio 
                            ? 'bg-green-500 text-white font-bold' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Asistió
                      </button>
                      <button
                        onClick={() => actualizarAsistencia(index, false)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          !detalle.asistio 
                            ? 'bg-red-500 text-white font-bold' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        No asistió
                      </button>
                    </div>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-sm ${detalle.asistio ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {detalle.asistio ? 'Asistió' : 'No asistió'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid px-4 py-4 w-full">
      <h1 className="text-2xl font-bold text-red-800 mb-6">Clases y asistencias</h1>
      <CalendarioSemanal />
      {vistaAsistencia ? <VistaClaseSeleccionada /> : <VistaLista />}
    </div>
  );
};

export default ClasesExtracurriculares;