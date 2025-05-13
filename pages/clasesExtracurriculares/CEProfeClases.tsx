import React, { useState, useEffect } from 'react';
import ClaseTarjeta from '../../components/clasesExtracurriculares/ClaseTarjeta';
import RegistroAsistencias from '../../components/clasesExtracurriculares/RegistroAsistencias';

interface Estudiante {
  nombre: string;
  asistio: boolean;
  comentario: string;
}

interface ClaseExtracurricular {
  id: string;
  nombre: string;
  fecha: string;
  horario: string;
  asistencias: number;
  color: string;
  estudiantes: Estudiante[];
}

const ClasesExtracurriculares: React.FC = () => {

  const [clases, setClases] = useState<ClaseExtracurricular[]>([]);
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);
  const [claseSeleccionada, setClaseSeleccionada] = useState<ClaseExtracurricular | null>(null);
  const [vistaAsistencia, setVistaAsistencia] = useState(false);

  useEffect(() => {
    const clasesEjemplo: ClaseExtracurricular[] = [
      {
        id: '1',
        nombre: 'PING PONG',
        fecha: 'Martes, 20 junio',
        horario: '1:00pm - 3:00pm',
        asistencias: 2,
        color: 'blue',
        estudiantes: [
          { nombre: 'María Paula Sánchez Macías', asistio: false, comentario: '' },
          { nombre: 'María Paula Sánchez Macías', asistio: false, comentario: '' },
          { nombre: 'María Paula Sánchez Macías', asistio: false, comentario: '' }
        ]
      },
      {
        id: '2',
        nombre: 'PING PONG',
        fecha: 'Martes, 20 junio',
        horario: '1:00pm - 3:00pm',
        asistencias: 2,
        color: 'red',
        estudiantes: [
          { nombre: 'Carlos Andrés Pérez', asistio: true, comentario: 'Llegó tarde' },
          { nombre: 'Juan Diego Martínez', asistio: false, comentario: '' }
        ]
      },
      {
        id: '3',
        nombre: 'PING PONG',
        fecha: 'Martes, 20 junio',
        horario: '1:00pm - 3:00pm',
        asistencias: 2,
        color: 'primary',
        estudiantes: [
          { nombre: 'Ana María López', asistio: true, comentario: '' },
          { nombre: 'Pedro Sánchez', asistio: false, comentario: 'No asistió' }
        ]
      }
    ];
    setClases(clasesEjemplo);
  }, []);

  const mostrarRegistroAsistencia = (clase: ClaseExtracurricular) => {
    setClaseSeleccionada(clase);
    setVistaAsistencia(true);
  };

  const cerrarRegistroAsistencia = () => {
    setVistaAsistencia(false);
    setClaseSeleccionada(null);
  };

  const marcarTodasAsistencias = () => {
    if (!claseSeleccionada) return;
    const claseActualizada = {
      ...claseSeleccionada,
      estudiantes: claseSeleccionada.estudiantes.map(e => ({...e, asistio: true}))
    };
    setClaseSeleccionada(claseActualizada);
    setClases(clases.map(c => c.id === claseActualizada.id ? claseActualizada : c));
  };

  const actualizarAsistencia = (index: number, asistio: boolean) => {
    if (!claseSeleccionada) return;
    const estudiantesActualizados = [...claseSeleccionada.estudiantes];
    estudiantesActualizados[index] = {...estudiantesActualizados[index], asistio};
    actualizarClase({...claseSeleccionada, estudiantes: estudiantesActualizados});
  };

  const actualizarComentario = (index: number, comentario: string) => {
    if (!claseSeleccionada) return;
    const estudiantesActualizados = [...claseSeleccionada.estudiantes];
    estudiantesActualizados[index] = {...estudiantesActualizados[index], comentario};
    actualizarClase({...claseSeleccionada, estudiantes: estudiantesActualizados});
  };

  // Función auxiliar para actualizar una clase
  const actualizarClase = (claseActualizada: ClaseExtracurricular) => {
    setClaseSeleccionada(claseActualizada);
    setClases(clases.map(c => c.id === claseActualizada.id ? claseActualizada : c));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Título */}
      <h1 className="text-3xl font-bold text-red-800 mb-6">Clases Extracurriculares</h1>

      {/* Calendario simple */}
      <div className="w-full border border-gray-200 rounded-md overflow-hidden mb-6">
        <div className="grid grid-cols-6">
          {['Lunes', 'Mar', 'Miér', 'Juev', 'Vier', 'Sáb'].map(dia => (
            <div key={dia} className="text-center py-2 border-r border-b border-gray-200 font-medium">
              {dia}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-6">
          {['Lunes', 'Mar', 'Miér', 'Juev', 'Vier', 'Sáb'].map((_, index) => (
            <div key={index} className="border-r border-gray-200 p-2 h-16">
              {(index === 0 || index === 1 || index === 3) && (
                <div className="bg-pink-100 p-2 h-full flex items-center justify-center text-center text-sm rounded">
                  <div>
                    <div className="font-semibold">PING PONG</div>
                    <div>1:00 - 3:00</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vista de Registro o Carrusel */}
      {vistaAsistencia && claseSeleccionada ? (
        <RegistroAsistencias
          fecha={claseSeleccionada.fecha}
          horario={claseSeleccionada.horario}
          asistencias={claseSeleccionada.asistencias}
          estudiantes={claseSeleccionada.estudiantes}
          onClose={cerrarRegistroAsistencia}
          onMarcarTodas={marcarTodasAsistencias}
          onActualizarAsistencia={actualizarAsistencia}
          onActualizarComentario={actualizarComentario}
        />
      ) : (
        <>
          {/* Carrusel de clases */}
          <div className="grid grid-cols-3 gap-6">
            {clases.slice(indiceCarrusel, indiceCarrusel + 3).map(clase => (
              <ClaseTarjeta
                key={clase.id}
                fecha={clase.fecha}
                horario={clase.horario}
                asistencias={clase.asistencias}
                color={clase.color}
                onClick={() => mostrarRegistroAsistencia(clase)}
              />
            ))}
          </div>

          {/* Control de paginación simplificado */}
          <div className="flex justify-center items-center space-x-3 my-4">
            <button
              onClick={() => setIndiceCarrusel(Math.max(0, indiceCarrusel - 1))}
              disabled={indiceCarrusel === 0}
              className="w-8 h-8 flex items-center justify-center text-gray-600 disabled:text-gray-300"
            >
              ←
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.ceil(clases.length / 3) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndiceCarrusel(i * 3)}
                  className={`w-2 h-2 rounded-full ${i === Math.floor(indiceCarrusel / 3) ? 'bg-red-800' : 'bg-gray-300'}`}
                />
              ))}
            </div>

            <button
              onClick={() => setIndiceCarrusel(Math.min(clases.length - 3, indiceCarrusel + 1))}
              disabled={indiceCarrusel + 3 >= clases.length}
              className="w-8 h-8 flex items-center justify-center text-gray-600 disabled:text-gray-300"
            >
              →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ClasesExtracurriculares;