"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import loanService, { CreateLoanRequest, LoanArticle, getCurrentUser, detectUserRole } from '@/services/loanService';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: 'disponible' | 'mantenimiento' | 'dañado';
}

export default function GenerarReservasPage() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Datos del formulario
  const [descripcion, setDescripcion] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [fechaReserva, setFechaReserva] = useState(new Date().toISOString().split('T')[0]);
  
  // Usuario y modo
  const currentUser = getCurrentUser();
  const userRole = detectUserRole();
  const [modoEdicion, setModoEdicion] = useState(false);
  const [reservaEditar, setReservaEditar] = useState<LoanArticle | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Verificar si estamos en modo edición
    const modo = searchParams?.get('modo');
    if (modo === 'editar') {
      const reservaData = localStorage.getItem('reservaEditar');
      if (reservaData) {
        const reserva: LoanArticle = JSON.parse(reservaData);
        setReservaEditar(reserva);
        setModoEdicion(true);
        cargarDatosEdicion(reserva);
      } else {
        // Si no hay datos de edición, redirigir a mis reservas
        router.push('/MisReservas');
      }
    } else {
      // Cargar productos seleccionados del catálogo (para nuevas reservas)
      const productosSeleccionados = localStorage.getItem('productosSeleccionados');
      if (productosSeleccionados) {
        const productos: Product[] = JSON.parse(productosSeleccionados);
        setSelectedProducts(productos);
      }
    }
  }, [searchParams, router]);

  const cargarDatosEdicion = (reserva: LoanArticle) => {
    // Extraer descripción sin el prefijo de horas
    let descripcionLimpia = reserva.loanDescriptionType || '';
    if (descripcionLimpia.includes('] ')) {
      descripcionLimpia = descripcionLimpia.split('] ')[1] || descripcionLimpia;
    }
    
    setDescripcion(descripcionLimpia);
    setStartTime(reserva.startTime || '');
    setEndTime(reserva.endTime || '');
    setFechaReserva(reserva.loanDate || '');
  };

  const validarFormulario = (): string | null => {
    if (!descripcion.trim()) {
      return 'La descripción es obligatoria';
    }

    if (!startTime || !endTime) {
      return 'Las horas de inicio y fin son obligatorias';
    }

    if (startTime >= endTime) {
      return 'La hora de inicio debe ser anterior a la hora de fin';
    }

    if (!modoEdicion && selectedProducts.length === 0) {
      return 'Debe seleccionar al menos un equipo deportivo';
    }

    // Validar que la fecha no sea anterior a hoy
    const hoy = new Date().toISOString().split('T')[0];
    if (fechaReserva < hoy) {
      return 'La fecha de la reserva no puede ser anterior a hoy';
    }

    // Validar horarios razonables
    const [horaInicio] = startTime.split(':').map(Number);
    const [horaFin] = endTime.split(':').map(Number);
    
    if (horaInicio < 6 || horaFin > 22) {
      return 'Los horarios deben estar entre las 06:00 y las 22:00';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (modoEdicion && reservaEditar) {
        // Actualizar reserva existente
        await loanService.updateLoan(
          reservaEditar.id,
          {
            loanDescriptionType: descripcion,
            loanDate: fechaReserva
          },
          startTime,
          endTime
        );
        
        alert('Reserva actualizada exitosamente');
        localStorage.removeItem('reservaEditar');
        router.push('/MisReservas');
      } else {
        // Crear nueva reserva
        const loanData: CreateLoanRequest = {
          articleIds: selectedProducts.map(p => parseInt(p.id)),
          nameUser: currentUser.displayName,
          userId: currentUser.userId,
          userRole: currentUser.role === 'student' ? 'Estudiante' : 'Profesor',
          loanDescriptionType: descripcion,
          loanDate: fechaReserva,
          startTime,
          endTime
        };

        await loanService.createLoan(loanData);
        
        alert('Reserva creada exitosamente');
        localStorage.removeItem('productosSeleccionados');
        router.push('/MisReservas');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    if (modoEdicion) {
      localStorage.removeItem('reservaEditar');
      router.push('/MisReservas');
    } else {
      router.push('/prestamosDeportivos/Prestamos');
    }
  };

  const getRoleDisplayName = () => {
    return userRole === 'student' ? 'Estudiante' : 'Profesor';
  };

  const getRoleIcon = () => {
    return userRole === 'student' ? '🎓' : '👨‍🏫';
  };

  const calcularDuracion = () => {
    if (startTime && endTime) {
      const [horaInicio, minutoInicio] = startTime.split(':').map(Number);
      const [horaFin, minutoFin] = endTime.split(':').map(Number);
      
      const minutosInicio = horaInicio * 60 + minutoInicio;
      const minutosFin = horaFin * 60 + minutoFin;
      const duracionMinutos = minutosFin - minutosInicio;
      
      if (duracionMinutos > 0) {
        const horas = Math.floor(duracionMinutos / 60);
        const minutos = duracionMinutos % 60;
        
        if (horas > 0 && minutos > 0) {
          return `${horas}h ${minutos}min`;
        } else if (horas > 0) {
          return `${horas}h`;
        } else {
          return `${minutos}min`;
        }
      }
    }
    return null;
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              {modoEdicion ? '✏️ Modificar Reserva' : '📋 Generar Nueva Reserva'}
            </h1>
            <p className="text-gray-600">
              {modoEdicion 
                ? 'Modifica los detalles de tu reserva vencida'
                : 'Completa los datos para tu nueva reserva deportiva'
              } - {getRoleIcon()} {getRoleDisplayName()}: {currentUser.displayName}
            </p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
              <strong>Error:</strong> {error}
              <button 
                onClick={() => setError(null)}
                className="absolute top-1 right-1 text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </div>
          )}

          {/* Información de la reserva en edición */}
          {modoEdicion && reservaEditar && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">🔄 Modificando Reserva Vencida:</h3>
              <div className="text-sm text-yellow-700 grid grid-cols-2 gap-4">
                <div>
                  <p><strong>ID:</strong> {reservaEditar.id.substring(0, 12)}...</p>
                  <p><strong>Estado:</strong> {reservaEditar.loanStatus}</p>
                </div>
                <div>
                  <p><strong>Equipos:</strong> {reservaEditar.articleIds?.length || 0} artículo(s)</p>
                  <p><strong>Fecha Original:</strong> {new Date(reservaEditar.loanDate).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
              {reservaEditar.articleIds && reservaEditar.articleIds.length > 0 && (
                <div className="mt-2 text-xs text-yellow-600">
                  <strong>IDs de Equipos:</strong> {reservaEditar.articleIds.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Equipos seleccionados para nueva reserva */}
          {!modoEdicion && selectedProducts.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">🏃‍♂️ Equipos Deportivos Seleccionados:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between bg-white p-2 rounded border">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{product.name}</span>
                      <span className="text-xs text-gray-500">(ID: {product.id})</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Disponible
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-blue-600">
                Total de equipos: {selectedProducts.length}/3
              </div>
            </div>
          )}

          {/* Formulario principal */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border">
            <div className="space-y-6">
              {/* Información del usuario */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">👤 Información del Usuario</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Usuario:</label>
                    <input
                      type="text"
                      value={currentUser.userId}
                      disabled
                      className="w-full p-2 border rounded bg-gray-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre:</label>
                    <input
                      type="text"
                      value={currentUser.displayName}
                      disabled
                      className="w-full p-2 border rounded bg-gray-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rol:</label>
                    <input
                      type="text"
                      value={getRoleDisplayName()}
                      disabled
                      className="w-full p-2 border rounded bg-gray-100 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Fecha y horarios */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-3">📅 Fecha y Horarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de la Reserva: *</label>
                    <input
                      type="date"
                      value={fechaReserva}
                      onChange={(e) => setFechaReserva(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hora de Inicio: *</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      min="06:00"
                      max="22:00"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hora de Fin: *</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      min="06:00"
                      max="22:00"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                {/* Mostrar duración calculada */}
                {calcularDuracion() && (
                  <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
                    <strong>⏱️ Duración estimada:</strong> {calcularDuracion()}
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium mb-1">Descripción de la Actividad: *</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder={`Ejemplo para ${getRoleDisplayName()}s: ${
                    userRole === 'student' 
                      ? 'Práctica deportiva, Educación física, Entrenamiento personal...'
                      : 'Clase de educación física, Entrenamiento grupal, Actividad deportiva...'
                  }`}
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  maxLength={200}
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  {descripcion.length}/200 caracteres
                </div>
              </div>

              {/* Información según el rol */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">
                  ⚠️ Información Importante para {getRoleDisplayName()}s
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• <strong>Horario:</strong> Reservas disponibles de 06:00 a 22:00</li>
                  <li>• <strong>Duración:</strong> Todas las reservas son por horas el mismo día</li>
                  <li>• <strong>Equipos:</strong> {!modoEdicion ? 'Máximo 3 equipos por reserva' : 'Los equipos no se pueden cambiar en edición'}</li>
                  <li>• <strong>Modificaciones:</strong> Solo puedes modificar reservas vencidas</li>
                  <li>• <strong>Devolución:</strong> Los equipos deben devolverse en buenas condiciones</li>
                  {userRole === 'teacher' && (
                    <li>• <strong>Responsabilidad:</strong> Como profesor, eres responsable del uso de los equipos</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={handleVolver}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded hover:bg-gray-700 font-medium"
              >
                ← Volver
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {loading 
                  ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Procesando...
                    </div>
                  ) 
                  : modoEdicion 
                    ? '✏️ Actualizar Reserva' 
                    : '📋 Crear Reserva'
                }
              </button>
            </div>
          </form>

          {/* Recordatorios adicionales */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              💡 <strong>Recordatorio:</strong> Las reservas creadas aparecerán en tu sección 
              <button 
                onClick={() => router.push('/MisReservas')}
                className="text-blue-600 hover:text-blue-800 underline mx-1"
              >
                "Mis Reservas"
              </button>
              donde podrás gestionarlas según su estado.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}