"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import loanService, { LoanArticle, LoanResponse, getCurrentUser, detectUserRole } from '@/services/loanService';

export default function MisReservasPage() {
  const [reservas, setReservas] = useState<LoanArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'prestados' | 'devueltos' | 'vencidos'>('todos');
  
  const router = useRouter();
  const currentUser = getCurrentUser();
  const userRole = detectUserRole();

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: LoanResponse = await loanService.getMyLoans();
      setReservas(response.prestamos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: string, status: string) => {
    if (status !== 'Devuelto') {
      alert('Solo puedes eliminar reservas que están devueltas');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      try {
        await loanService.deleteLoan(id);
        await cargarReservas();
        alert('Reserva eliminada exitosamente');
      } catch (err: any) {
        alert(err.message || 'Error al eliminar la reserva');
      }
    }
  };

  const handleModificar = (reserva: LoanArticle) => {
    if (reserva.loanStatus !== 'Vencido') {
      alert('Solo puedes modificar reservas que están vencidas');
      return;
    }
    
    // Guardar datos para edición
    localStorage.setItem('reservaEditar', JSON.stringify(reserva));
    router.push('/generarReservas?modo=editar');
  };

  const handleDevolver = async (id: string, status: string) => {
    if (status !== 'Prestado') {
      alert('Solo puedes devolver reservas que están activas');
      return;
    }

    if (window.confirm('¿Confirmas la devolución de esta reserva?')) {
      try {
        await loanService.devolverLoan(id);
        await cargarReservas();
        alert('Reserva devuelta exitosamente');
      } catch (err: any) {
        alert(err.message || 'Error al devolver la reserva');
      }
    }
  };

  const reservasFiltradas = reservas.filter(reserva => {
    if (filtro === 'todos') return true;
    if (filtro === 'prestados') return reserva.loanStatus === 'Prestado';
    if (filtro === 'devueltos') return reserva.loanStatus === 'Devuelto';
    if (filtro === 'vencidos') return reserva.loanStatus === 'Vencido';
    return true;
  });

  const contarPorEstado = (estado: string) => {
    return reservas.filter(r => r.loanStatus === estado).length;
  };

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'Prestado': return 'bg-blue-100 text-blue-800';
      case 'Devuelto': return 'bg-green-100 text-green-800';
      case 'Vencido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const getRoleDisplayName = () => {
    return userRole === 'student' ? 'Estudiante' : 'Profesor';
  };

  const getRoleIcon = () => {
    return userRole === 'student' ? '🎓' : '👨‍🏫';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            📋 Mis Reservas Deportivas
          </h1>
          <p className="text-gray-600">
            Gestión de tus reservas deportivas - {getRoleIcon()} {getRoleDisplayName()}: <span className="font-semibold">{currentUser.displayName}</span>
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Usuario: {currentUser.userId} | Última actualización: {new Date().toLocaleString('es-ES')}
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <span className="text-2xl mr-2">📊</span>
              <div>
                <p className="text-2xl font-bold">{reservas.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🔵</span>
              <div>
                <p className="text-2xl font-bold text-blue-800">{contarPorEstado('Prestado')}</p>
                <p className="text-sm text-blue-600">Activas</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <span className="text-2xl mr-2">✅</span>
              <div>
                <p className="text-2xl font-bold text-green-800">{contarPorEstado('Devuelto')}</p>
                <p className="text-sm text-green-600">Devueltas</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <span className="text-2xl mr-2">⚠️</span>
              <div>
                <p className="text-2xl font-bold text-red-800">{contarPorEstado('Vencido')}</p>
                <p className="text-sm text-red-600">Vencidas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white p-4 rounded-lg shadow border mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-sm font-medium mb-1">Filtrar por estado:</label>
                <select
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value as any)}
                  className="border p-2 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todas las reservas</option>
                  <option value="prestados">Activas (Prestado)</option>
                  <option value="devueltos">Devueltas</option>
                  <option value="vencidos">Vencidas</option>
                </select>
              </div>
              <button
                onClick={cargarReservas}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                🔄 Actualizar
              </button>
            </div>
            
            <button
              onClick={() => router.push('/prestamosDeportivos/Prestamos')}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium flex items-center gap-2"
            >
              ➕ Nueva Reserva
            </button>
          </div>
        </div>

        {/* Lista de reservas */}
        <div className="bg-white rounded-lg shadow border">
          {reservasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filtro === 'todos' ? 'No tienes reservas' : `No tienes reservas ${filtro}`}
              </h3>
              <p className="text-gray-500 mb-4">
                {filtro === 'todos' 
                  ? 'Crea tu primera reserva para comenzar'
                  : `No hay reservas con estado "${filtro}" en este momento`
                }
              </p>
              <button
                onClick={() => router.push('/prestamosDeportivos/Prestamos')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Crear Primera Reserva
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">ID de Reserva</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Horario</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Equipos</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Descripción</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservasFiltradas.map((reserva) => (
                    <tr key={reserva.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {reserva.id.startsWith('LN-') ? reserva.id.substring(3, 11) : reserva.id.substring(0, 8)}...
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <div className="font-medium">{formatearFecha(reserva.loanDate)}</div>
                          {reserva.devolutionDate && reserva.devolutionDate !== reserva.loanDate && (
                            <div className="text-xs text-gray-500">
                              Devolución: {formatearFecha(reserva.devolutionDate)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {reserva.startTime && reserva.endTime 
                          ? (
                            <div className="bg-blue-50 px-2 py-1 rounded text-xs">
                              🕐 {reserva.startTime} - {reserva.endTime}
                            </div>
                          )
                          : <span className="text-gray-400 text-xs">Sin horario</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(reserva.loanStatus)}`}>
                          {reserva.loanStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                            {reserva.articleIds?.length || 0} equipo(s)
                          </span>
                        </div>
                        {reserva.articleIds && reserva.articleIds.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            IDs: {reserva.articleIds.slice(0, 3).join(', ')}
                            {reserva.articleIds.length > 3 && '...'}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm max-w-xs">
                        <div className="truncate" title={reserva.loanDescriptionType}>
                          {reserva.loanDescriptionType}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {reserva.loanStatus === 'Prestado' && (
                            <button
                              onClick={() => handleDevolver(reserva.id, reserva.loanStatus)}
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 flex items-center gap-1"
                              title="Devolver reserva"
                            >
                              ✅ Devolver
                            </button>
                          )}
                          {reserva.loanStatus === 'Vencido' && (
                            <button
                              onClick={() => handleModificar(reserva)}
                              className="bg-yellow-600 text-white px-2 py-1 rounded text-xs hover:bg-yellow-700 flex items-center gap-1"
                              title="Modificar reserva vencida"
                            >
                              ✏️ Modificar
                            </button>
                          )}
                          {reserva.loanStatus === 'Devuelto' && (
                            <button
                              onClick={() => handleEliminar(reserva.id, reserva.loanStatus)}
                              className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 flex items-center gap-1"
                              title="Eliminar reserva devuelta"
                            >
                              🗑️ Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Información sobre permisos según el rol */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">
              {getRoleIcon()} Permisos para {getRoleDisplayName()}s
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• <strong>Ver:</strong> Solo tus propias reservas</p>
              <p>• <strong>Devolver:</strong> Reservas activas (Prestado)</p>
              <p>• <strong>Modificar:</strong> Reservas vencidas (Vencido)</p>
              <p>• <strong>Eliminar:</strong> Reservas devueltas (Devuelto)</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">ℹ️ Información General</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Todas las reservas son por horas</p>
              <p>• Se devuelven el mismo día del préstamo</p>
              <p>• Máximo 3 equipos por reserva</p>
              <p>• Cuida los equipos como si fueran tuyos</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}