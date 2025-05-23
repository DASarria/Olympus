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
  fechaCompleta: Date;
}

const ClasesExtracurriculares: React.FC = () => {
  const [clases, setClases] = useState<ClaseExtracurricular[]>([]);
  const [clasesFiltradas, setClasesFiltradas] = useState<ClaseExtracurricular[]>([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState<ClaseExtracurricular | null>(null);
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);
  const [vistaAsistencia, setVistaAsistencia] = useState(false);
  const [nuevoEstudiante, setNuevoEstudiante] = useState('');
  const [agregandoEstudiante, setAgregandoEstudiante] = useState(false);
  const [filtros, setFiltros] = useState({ diaSemana: '', diaMes: '', mes: '' });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const colores = { rojo: '#990000', azulLavanda: '#A8B8E1', azulGrisaceo: '#6B7996', grisClaro: '#F8F9FA' };
  const tarjetasPorPagina = 5;

  const diasSemana = [{ valor: '', etiqueta: 'Todos los días' }, { valor: '1', etiqueta: 'Lunes' }, { valor: '2', etiqueta: 'Martes' }, { valor: '3', etiqueta: 'Miércoles' }, { valor: '4', etiqueta: 'Jueves' }, { valor: '5', etiqueta: 'Viernes' }, { valor: '6', etiqueta: 'Sábado' }, { valor: '0', etiqueta: 'Domingo' }];
  const diasMes = [{ valor: '', etiqueta: 'Cualquier día' }, ...Array.from({ length: 31 }, (_, i) => ({ valor: (i + 1).toString(), etiqueta: (i + 1).toString() }))];
  const meses = [{ valor: '', etiqueta: 'Todos los meses' }, { valor: '0', etiqueta: 'Enero' }, { valor: '1', etiqueta: 'Febrero' }, { valor: '2', etiqueta: 'Marzo' }, { valor: '3', etiqueta: 'Abril' }, { valor: '4', etiqueta: 'Mayo' }, { valor: '5', etiqueta: 'Junio' }, { valor: '6', etiqueta: 'Julio' }, { valor: '7', etiqueta: 'Agosto' }, { valor: '8', etiqueta: 'Septiembre' }, { valor: '9', etiqueta: 'Octubre' }, { valor: '10', etiqueta: 'Noviembre' }, { valor: '11', etiqueta: 'Diciembre' }];

  useEffect(() => {
    const soloVoleibol = [
      {
        id: 'vol_001_mayo_2025',
        nombre: 'VOLEIBOL',
        color: 'bg-purple-50',
        fecha: 'Miércoles, 28 Mayo',
        horario: '4:00pm - 6:00pm', 
        asistencias: 10,
        fechaCompleta: new Date(2025, 4, 28),
        detalles: [
          { estudiante: 'Ana María González', asistio: true },
          { estudiante: 'Sofía Rodríguez Méndez', asistio: true },
          { estudiante: 'Camila Herrera Torres', asistio: false },
          { estudiante: 'Isabella Torres Silva', asistio: true },
          { estudiante: 'Valentina López García', asistio: true },
          { estudiante: 'Mariana Castro Ruiz', asistio: true },
          { estudiante: 'Andrea Vargas Jiménez', asistio: false },
          { estudiante: 'Natalia Ramírez Cano', asistio: true },
          { estudiante: 'Daniela Moreno Pérez', asistio: true },
          { estudiante: 'Alejandra Silva Rojas', asistio: true }
        ]
      },
      {
        id: 'vol_002_junio_2025',
        nombre: 'VOLEIBOL',
        color: 'bg-purple-50',
        fecha: 'Viernes, 6 Junio',
        horario: '4:00pm - 6:00pm', 
        asistencias: 8,
        fechaCompleta: new Date(2025, 5, 6),
        detalles: [
          { estudiante: 'Ana María González', asistio: true },
          { estudiante: 'Sofía Rodríguez Méndez', asistio: true },
          { estudiante: 'Camila Herrera Torres', asistio: true },
          { estudiante: 'Isabella Torres Silva', asistio: false },
          { estudiante: 'Valentina López García', asistio: true },
          { estudiante: 'Mariana Castro Ruiz', asistio: true },
          { estudiante: 'Andrea Vargas Jiménez', asistio: true },
          { estudiante: 'Natalia Ramírez Cano', asistio: true }
        ]
      }
    ];

    setClases(soloVoleibol);
    setClasesFiltradas(soloVoleibol);
  }, []);

  const aplicarFiltros = () => {
    let resultado = [...clases];
    if (filtros.diaSemana) resultado = resultado.filter(clase => clase.fechaCompleta.getDay().toString() === filtros.diaSemana);
    if (filtros.diaMes) resultado = resultado.filter(clase => clase.fechaCompleta.getDate().toString() === filtros.diaMes);
    if (filtros.mes) resultado = resultado.filter(clase => clase.fechaCompleta.getMonth().toString() === filtros.mes);
    setClasesFiltradas(resultado);
    setIndiceCarrusel(0);
  };

  useEffect(() => { aplicarFiltros(); }, [filtros, clases]);

  const actualizarAsistencia = (indiceEstudiante: number, asistio: boolean) => {
    if (!claseSeleccionada) return;
    const nuevosDetalles = [...claseSeleccionada.detalles];
    nuevosDetalles[indiceEstudiante] = { ...nuevosDetalles[indiceEstudiante], asistio };
    const nuevaClase = { ...claseSeleccionada, detalles: nuevosDetalles };
    setClaseSeleccionada(nuevaClase);
    setClases(clases.map(clase => clase.id === claseSeleccionada.id ? nuevaClase : clase));
  };

  const agregarEstudiante = () => {
    if (!claseSeleccionada || !nuevoEstudiante.trim()) return;
    const nuevaClase = { ...claseSeleccionada, detalles: [...claseSeleccionada.detalles, { estudiante: nuevoEstudiante.trim(), asistio: false }] };
    setClaseSeleccionada(nuevaClase);
    setClases(clases.map(clase => clase.id === claseSeleccionada.id ? nuevaClase : clase));
    setNuevoEstudiante('');
    setAgregandoEstudiante(false);
  };

  const Filtros = () => (
    <div className="border rounded-lg p-4 mb-6" style={{borderColor: colores.azulLavanda, backgroundColor: colores.grisClaro}}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold" style={{color: colores.rojo}}>Filtrar por fecha</h3>
        <button onClick={() => setMostrarFiltros(!mostrarFiltros)} style={{color: colores.rojo}}>
          {mostrarFiltros ? 'Ocultar' : 'Mostrar'} filtros
        </button>
      </div>
      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Día de la semana', value: filtros.diaSemana, key: 'diaSemana', options: diasSemana },
            { label: 'Día del mes', value: filtros.diaMes, key: 'diaMes', options: diasMes },
            { label: 'Mes', value: filtros.mes, key: 'mes', options: meses }
          ].map(({ label, value, key, options }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1" style={{color: colores.azulGrisaceo}}>{label}</label>
              <select value={value} onChange={(e) => setFiltros({...filtros, [key]: e.target.value})} className="w-full p-2 border rounded-md bg-white" style={{borderColor: colores.azulLavanda}}>
                {options.map(opt => <option key={opt.valor} value={opt.valor}>{opt.etiqueta}</option>)}
              </select>
            </div>
          ))}
          <div className="flex items-end">
            <button onClick={() => setFiltros({diaSemana: '', diaMes: '', mes: ''})} className="w-full text-white py-2 px-4 rounded-md hover:opacity-90" style={{backgroundColor: colores.azulGrisaceo}}>
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
      <div className="mt-2 text-sm" style={{color: colores.azulGrisaceo}}>Mostrando {clasesFiltradas.length} de {clases.length} clases de VOLEIBOL</div>
    </div>
  );

  const Calendario = () => (
    <div className="w-full border rounded-md overflow-hidden mb-6 bg-white" style={{borderColor: colores.azulLavanda}}>
      <div className="grid grid-cols-6 border-b" style={{borderColor: colores.azulLavanda}}>
        {['Lunes', 'Mar', 'Miér', 'Juev', 'Vier', 'Sáb'].map((dia, i) => (
          <div key={i} className="text-center py-2 border-r last:border-r-0 font-medium" style={{backgroundColor: colores.grisClaro, color: colores.azulGrisaceo}}>{dia}</div>
        ))}
      </div>
      <div className="grid grid-cols-6 h-24">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="border-r last:border-r-0 p-2 bg-white" style={{borderColor: colores.azulLavanda}}>
            {i === 2 && (
              <div className="p-2 h-full flex items-center justify-center text-center text-xs font-medium rounded border" style={{backgroundColor: '#F3E8FF', color: '#6B21A8', borderColor: colores.azulLavanda}}>
                VOLEIBOL<br />4:00pm - 6:00pm
              </div>
            )}
            {i === 4 && (
              <div className="p-2 h-full flex items-center justify-center text-center text-xs font-medium rounded border" style={{backgroundColor: '#F3E8FF', color: '#6B21A8', borderColor: colores.azulLavanda}}>
                VOLEIBOL<br />4:00pm - 6:00pm
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const TarjetaClase = ({ clase }: { clase: ClaseExtracurricular }) => (
    <div className={`rounded-lg shadow-lg overflow-hidden border cursor-pointer transition-transform hover:scale-105 h-full bg-white ${clase.color}`} style={{borderColor: colores.azulLavanda}} onClick={() => {setClaseSeleccionada(clase); setVistaAsistencia(true);}}>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1" style={{color: colores.rojo}}>{clase.nombre}</h3>
        <p className="text-sm font-medium mb-2" style={{color: colores.azulGrisaceo}}>{clase.fecha}</p>
        <div style={{color: colores.azulGrisaceo}}>
          <p>Horario: {clase.horario}</p>
          <p>Asistencias: {clase.asistencias}/{clase.detalles.length}</p>
        </div>
      </div>
      <div className="bg-white p-4 flex items-center justify-center border-t" style={{borderColor: colores.azulLavanda}}>
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full flex items-center justify-center mb-2 shadow-md" style={{backgroundColor: colores.azulLavanda}}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <span className="text-sm" style={{color: colores.azulGrisaceo}}>Gestionar asistencia</span>
        </div>
      </div>
    </div>
  );

  const VistaLista = () => {
    const clasesVisibles = clasesFiltradas.slice(indiceCarrusel, indiceCarrusel + tarjetasPorPagina);

    return (
      <div className="w-full">
        {clasesFiltradas.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-lg mb-2 font-bold" style={{color: colores.azulGrisaceo}}>No se encontraron clases de VOLEIBOL</div>
            <div className="text-sm font-medium" style={{color: colores.azulLavanda}}>Intenta ajustar los filtros de búsqueda</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {clasesVisibles.map((clase) => <TarjetaClase key={clase.id} clase={clase} />)}
          </div>
        )}
      </div>
    );
  };

  const VistaDetalle = () => !claseSeleccionada ? null : (
    <div className="bg-white border-2 rounded-lg shadow-md overflow-hidden mb-8 w-full" style={{borderColor: colores.azulLavanda}}>
      <div className={`p-6 ${claseSeleccionada.color}`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold" style={{color: colores.rojo}}>{claseSeleccionada.nombre}</h2>
            <p className="font-bold" style={{color: colores.azulGrisaceo}}>{claseSeleccionada.fecha}</p>
            <p className="font-medium" style={{color: colores.azulGrisaceo}}>Horario: {claseSeleccionada.horario}</p>
          </div>
          <button onClick={() => {setVistaAsistencia(false); setClaseSeleccionada(null);}} style={{color: colores.azulGrisaceo}}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold" style={{color: colores.rojo}}>Registro de Asistencias</h3>
          <button onClick={() => setClaseSeleccionada({...claseSeleccionada, detalles: claseSeleccionada.detalles.map(d => ({...d, asistio: true}))})} className="text-white py-2 px-4 rounded-md text-sm" style={{backgroundColor: colores.rojo}}>
            Marcar Todas Positivas
          </button>
        </div>
        <div className="border-2 rounded-md overflow-hidden" style={{borderColor: colores.azulLavanda}}>
          <div className="grid grid-cols-8 py-3 px-4 border-b-2" style={{backgroundColor: colores.azulGrisaceo, borderColor: colores.azulLavanda}}>
            <div className="col-span-4 font-bold text-white">Estudiante</div>
            <div className="col-span-4 font-bold text-center text-white">Asistencia</div>
          </div>
          {claseSeleccionada.detalles.map((detalle, index) => (
            <div key={index} className="grid grid-cols-8 py-3 px-4 border-b last:border-b-0" style={{borderColor: colores.azulLavanda}}>
              <div className="col-span-4 font-medium" style={{color: colores.azulGrisaceo}}>{detalle.estudiante}</div>
              <div className="col-span-4 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button onClick={() => actualizarAsistencia(index, true)} className="px-3 py-1 rounded-md text-sm text-white" style={{backgroundColor: detalle.asistio ? colores.rojo : colores.azulLavanda}}>Asistió</button>
                  <button onClick={() => actualizarAsistencia(index, false)} className="px-3 py-1 rounded-md text-sm text-white" style={{backgroundColor: !detalle.asistio ? colores.azulGrisaceo : colores.azulLavanda}}>No asistió</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          {!agregandoEstudiante ? (
            <button onClick={() => setAgregandoEstudiante(true)} className="text-white py-2 px-4 rounded-md hover:opacity-90 transition-all text-sm font-semibold" style={{backgroundColor: colores.azulLavanda}}>+ Agregar estudiante</button>
          ) : (
            <div className="flex space-x-2">
              <input type="text" value={nuevoEstudiante} onChange={e => setNuevoEstudiante(e.target.value)} placeholder="Nombre del estudiante" className="border-2 rounded-md px-2 py-1 text-sm font-medium" style={{borderColor: colores.azulLavanda}} />
              <button onClick={agregarEstudiante} className="text-white px-3 py-1 rounded-md text-sm font-semibold hover:opacity-90" style={{backgroundColor: colores.rojo}}>Agregar</button>
              <button onClick={() => {setAgregandoEstudiante(false); setNuevoEstudiante('');}} className="text-white px-3 py-1 rounded-md text-sm font-semibold hover:opacity-90" style={{backgroundColor: colores.azulGrisaceo}}>Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-4 py-4 w-full" style={{backgroundColor: '#FFFFFF'}}>
      <h1 className="text-2xl font-bold mb-6" style={{color: colores.rojo}}>Prof. Martínez - Gestión VOLEIBOL</h1>
      <Calendario />
      <Filtros />
      {vistaAsistencia ? <VistaDetalle /> : <VistaLista />}
    </div>
  );
};

export default ClasesExtracurriculares;