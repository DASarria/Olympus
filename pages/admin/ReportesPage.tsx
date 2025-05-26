"use client";
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import api from '@/services/api';

interface ReporteData {
  reportType: string;
  reportValue?: string;
  startDate?: string;
  endDate?: string;
  totalItems: number;
  data: any[];
}

interface EstadisticaArticulo {
  id: number;
  name: string;
  description: string;
  articleStatus: string;
  imageUrl: string;
  vecesPrestado: number;
}

interface EstadisticasResponse {
  totalArticulos: number;
  estadisticas: EstadisticaArticulo[];
  reportId?: string;
  downloadLinks?: {
    pdf: string;
    excel: string;
  };
}

export default function ReportesPage() {
  const [reportes, setReportes] = useState<ReporteData[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'reportes' | 'estadisticas'>('reportes');
 
  // Estados para formularios de reportes
  const [tipoReporte, setTipoReporte] = useState<'student' | 'equipment' | 'status' | 'hourly' | 'daterange'>('student');
  const [valorReporte, setValorReporte] = useState('');
 
  // Funciones para obtener fechas por defecto
  const obtenerPrimerDiaDelMes = () => {
    const fecha = new Date();
    return new Date(fecha.getFullYear(), fecha.getMonth(), 1).toISOString().split('T')[0];
  };

  const obtenerUltimoDiaDelMes = () => {
    const fecha = new Date();
    return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).toISOString().split('T')[0];
  };

  const [fechaInicio, setFechaInicio] = useState(obtenerPrimerDiaDelMes());
  const [fechaFin, setFechaFin] = useState(obtenerUltimoDiaDelMes());

  useEffect(() => {
    // Cargar reportes predefinidos al iniciar
    cargarReportesPredefinidos();
    cargarEstadisticas();
  }, []);

  const cargarReportesPredefinidos = async () => {
    setLoading(true);
    try {
      // Cargar algunos reportes útiles por defecto
      const reportesPredefinidos = await Promise.allSettled([
        // Reporte de préstamos activos
        api.get('/LoanArticle/reports?type=status&value=Prestado'),
        // Reporte de préstamos del usuario actual
        api.get(`/LoanArticle/reports?type=student&value=Juan-cely-l`),
        // Reporte de préstamos por horas
        api.get('/LoanArticle/reports?type=hourly&value=true'),
      ]);

      const reportesExitosos = reportesPredefinidos
        .filter((resultado): resultado is PromiseFulfilledResult<any> => resultado.status === 'fulfilled')
        .map(resultado => resultado.value.data);

      setReportes(reportesExitosos);
    } catch (err) {
      console.error('Error al cargar reportes predefinidos:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await api.get('/Article/stats?username=Juan-cely-l');
      setEstadisticas(response.data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
      setError('Error al cargar estadísticas de artículos');
    }
  };

  const generarReporte = async () => {
    if (!tipoReporte) return;

    setLoading(true);
    setError(null);
   
    try {
      let url = `/LoanArticle/reports?type=${tipoReporte}`;
     
      // Agregar parámetros según el tipo de reporte
      switch (tipoReporte) {
        case 'student':
        case 'equipment':
        case 'status':
          if (!valorReporte.trim()) {
            setError(`Debe especificar un valor para el reporte de tipo ${tipoReporte}`);
            setLoading(false);
            return;
          }
          url += `&value=${encodeURIComponent(valorReporte.trim())}`;
          break;
        case 'hourly':
          url += `&value=true`;
          break;
        case 'daterange':
          if (!fechaInicio || !fechaFin) {
            setError('Debe especificar fechas de inicio y fin para el reporte por rango de fechas');
            setLoading(false);
            return;
          }
          url += `&startDate=${fechaInicio}&endDate=${fechaFin}`;
          break;
      }

      console.log('Generando reporte:', url);
      const response = await api.get(url);
     
      // Agregar el nuevo reporte al inicio de la lista
      setReportes(prev => [response.data, ...prev]);
     
      // Limpiar formulario
      setValorReporte('');
     
    } catch (err: any) {
      console.error('Error al generar reporte:', err);
      if (err.response?.data?.Message) {
        setError(err.response.data.Message);
      } else {
        setError('Error al generar el reporte');
      }
    } finally {
      setLoading(false);
    }
  };

  const descargarArchivo = async (url: string, nombreArchivo: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${api.defaults.baseURL}${url}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error al descargar archivo:', err);
      setError('Error al descargar el archivo');
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear fechas usando JavaScript nativo
  const formatearFecha = (fecha: string) => {
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  // Función para obtener fecha actual formateada para nombres de archivo
  const obtenerFechaActual = () => {
    const fecha = new Date();
    return fecha.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const obtenerTituloReporte = (reporte: ReporteData) => {
    switch (reporte.reportType) {
      case 'student':
        return `Préstamos del estudiante: ${reporte.reportValue}`;
      case 'equipment':
        return `Préstamos de equipo: ${reporte.reportValue}`;
      case 'status':
        return `Préstamos con estado: ${reporte.reportValue}`;
      case 'hourly':
        return 'Préstamos por horas';
      case 'daterange':
        return `Préstamos del ${formatearFecha(reporte.startDate!)} al ${formatearFecha(reporte.endDate!)}`;
      default:
        return 'Reporte de préstamos';
    }
  };

  const obtenerPlaceholder = () => {
    switch (tipoReporte) {
      case 'student':
        return 'Ej: U-12345 o Juan-cely-l';
      case 'equipment':
        return 'Ej: Balon, Raqueta, Lazo';
      case 'status':
        return 'Prestado, Devuelto, o Vencido';
      default:
        return '';
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen">
        <div className="flex flex-col flex-grow">
          <main className="flex-grow p-8">
            <h1 className="text-3xl font-bold mb-6">Sistema de Reportes</h1>

            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
                <button
                  className="absolute top-1 right-1 text-red-500"
                  onClick={() => setError(null)}
                >
                  &times;
                </button>
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Indicador de carga */}
            {loading && (
              <div className="mb-4 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                <span>Procesando...</span>
              </div>
            )}

            {/* Tabs de navegación */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('reportes')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reportes'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Reportes de Préstamos
                </button>
                <button
                  onClick={() => setActiveTab('estadisticas')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'estadisticas'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Estadísticas de Artículos
                </button>
              </nav>
            </div>

            {/* Tab de Reportes */}
            {activeTab === 'reportes' && (
              <div>
                {/* Formulario para generar reportes */}
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                  <h2 className="text-xl font-semibold mb-4">Generar Nuevo Reporte</h2>
                 
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de Reporte</label>
                      <select
                        value={tipoReporte}
                        onChange={(e) => setTipoReporte(e.target.value as any)}
                        className="border p-2 rounded w-full"
                      >
                        <option value="student">Por Estudiante</option>
                        <option value="equipment">Por Equipo</option>
                        <option value="status">Por Estado</option>
                        <option value="hourly">Por Horas</option>
                        <option value="daterange">Por Rango de Fechas</option>
                      </select>
                    </div>

                    {/* Campo de valor para tipos específicos */}
                    {['student', 'equipment', 'status'].includes(tipoReporte) && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Valor</label>
                        <input
                          type="text"
                          value={valorReporte}
                          onChange={(e) => setValorReporte(e.target.value)}
                          placeholder={obtenerPlaceholder()}
                          className="border p-2 rounded w-full"
                        />
                      </div>
                    )}

                    {/* Campos de fecha para reporte por rango */}
                    {tipoReporte === 'daterange' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
                          <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="border p-2 rounded w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Fecha Fin</label>
                          <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="border p-2 rounded w-full"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={generarReporte}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Generando...' : 'Generar Reporte'}
                  </button>
                </div>

                {/* Lista de reportes generados */}
                <div className="space-y-4">
                  {reportes.map((reporte, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{obtenerTituloReporte(reporte)}</h3>
                        <span className="text-sm text-gray-500">
                          Total de items: {reporte.totalItems}
                        </span>
                      </div>

                      {/* Mostrar datos del reporte */}
                      {reporte.data && reporte.data.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left">ID</th>
                                <th className="px-4 py-2 text-left">Usuario</th>
                                <th className="px-4 py-2 text-left">Fecha</th>
                                <th className="px-4 py-2 text-left">Estado</th>
                                <th className="px-4 py-2 text-left">Horario</th>
                                <th className="px-4 py-2 text-left">Artículos</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reporte.data.slice(0, 10).map((item: any, itemIndex: number) => (
                                <tr key={itemIndex} className="border-t">
                                  <td className="px-4 py-2 text-xs">{item.id}</td>
                                  <td className="px-4 py-2">{item.nameUser || item.userId}</td>
                                  <td className="px-4 py-2">{formatearFecha(item.loanDate)}</td>
                                  <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      item.loanStatus === 'Prestado' ? 'bg-blue-100 text-blue-800' :
                                      item.loanStatus === 'Devuelto' ? 'bg-green-100 text-green-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {item.loanStatus}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2">
                                    {item.startTime && item.endTime ? `${item.startTime} - ${item.endTime}` : '-'}
                                  </td>
                                  <td className="px-4 py-2">
                                    {item.articleIds ? item.articleIds.join(', ') : '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {reporte.data.length > 10 && (
                            <p className="text-sm text-gray-500 mt-2">
                              Mostrando 10 de {reporte.data.length} registros
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500">No se encontraron datos para este reporte</p>
                      )}
                    </div>
                  ))}

                  {reportes.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay reportes generados. Crea tu primer reporte usando el formulario de arriba.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab de Estadísticas */}
            {activeTab === 'estadisticas' && (
              <div>
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Estadísticas de Préstamos por Artículo</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={cargarEstadisticas}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Actualizar
                      </button>
                      {estadisticas?.downloadLinks && (
                        <>
                          <button
                            onClick={() => descargarArchivo(
                              estadisticas.downloadLinks!.pdf,
                              `estadisticas_articulos_${obtenerFechaActual()}.pdf`
                            )}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                          >
                            📄 PDF
                          </button>
                          <button
                            onClick={() => descargarArchivo(
                              estadisticas.downloadLinks!.excel,
                              `estadisticas_articulos_${obtenerFechaActual()}.xlsx`
                            )}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            📊 Excel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {estadisticas && (
                    <>
                      <div className="mb-4">
                        <p className="text-gray-600">
                          Total de artículos: <span className="font-semibold">{estadisticas.totalArticulos}</span>
                        </p>
                        {estadisticas.reportId && (
                          <p className="text-xs text-gray-500">
                            ID del reporte: {estadisticas.reportId}
                          </p>
                        )}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left">Artículo</th>
                              <th className="px-4 py-3 text-left">Descripción</th>
                              <th className="px-4 py-3 text-left">Estado</th>
                              <th className="px-4 py-3 text-left">Veces Prestado</th>
                              <th className="px-4 py-3 text-left">Imagen</th>
                            </tr>
                          </thead>
                          <tbody>
                            {estadisticas.estadisticas.map((articulo) => (
                              <tr key={articulo.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{articulo.name}</td>
                                <td className="px-4 py-3 text-gray-600">{articulo.description}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    articulo.articleStatus === 'Disponible' ? 'bg-green-100 text-green-800' :
                                    articulo.articleStatus === 'No disponible' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {articulo.articleStatus}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                                    {articulo.vecesPrestado}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  {articulo.imageUrl ? (
                                    <img
                                      src={articulo.imageUrl}
                                      alt={articulo.name}
                                      className="w-12 h-12 object-cover rounded"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/placeholder.png';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                      <span className="text-gray-400 text-xs">Sin imagen</span>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {!estadisticas && !loading && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No se pudieron cargar las estadísticas. Haz clic en "Actualizar" para intentar de nuevo.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}
