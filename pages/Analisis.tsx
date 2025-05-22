"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// URL base del API
const API_BASE_URL = "https://eciturnos-e5egf4dyezdkdgfq.canadaeast-01.azurewebsites.net/api"

// Definir interfaces para los tipos de datos
interface ReporteAnalisis {
  id: string
  actualDate: string
  actualTime: string
  initialDate: string
  finalDate: string
  userRole: string | null
  totalTurns: number
  turnsCompleted: number
  avarageWaitingTime: string
  averageTimeAttention: string
  turnPercentageByRole: Record<string, number>
  completedPercentageByRole: Record<string, number>
  disabilityPercentagesByRole: Record<string, Record<string, number>>
}

interface ReportRequest {
  initialDate: string
  finalDate: string
  userRole?: string
}

const Analisis = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [reporte, setReporte] = useState<ReporteAnalisis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autenticado, setAutenticado] = useState(false)
  const [generandoReporte, setGenerandoReporte] = useState(false)

  // Configuración de fechas para el reporte
  const [fechaInicial, setFechaInicial] = useState(() => {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() - 30) // Últimos 30 días por defecto
    return fecha.toISOString().split('T')[0]
  })

  const [fechaFinal, setFechaFinal] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })

  const [filtroRol, setFiltroRol] = useState<string>("")

  const especialidades = ["Estudiante", "Docente", "Administrativo", "ServiciosGenerales"]
  const discapacidades = ["NoTiene", "MayorDeEdad", "DisfuncionMotriz", "Embarazo", "Otra"]

  // Crear cliente API con interceptor
  const createApiClient = () => {
    const client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Interceptor para agregar token automáticamente
    client.interceptors.request.use(
        (config) => {
          const token = sessionStorage.getItem('token')
          if (token) {
            config.headers.Authorization = token
          }
          return config
        },
        (error) => {
          return Promise.reject(error)
        }
    )

    return client
  }

  // Función para verificar autenticación
  const verificarAutenticacion = async () => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      setError("Es necesario autenticarse para generar reportes")
      return false
    }
    setAutenticado(true)
    return true
  }

  // Función para generar reporte
  const generarReporte = async () => {
    setGenerandoReporte(true)
    setError(null)
    setLoading(true)

    try {
      // Verificar autenticación
      const authOk = await verificarAutenticacion()
      if (!authOk) {
        return
      }

      console.log("Generando reporte...")
      const apiClient = createApiClient()

      const requestData: ReportRequest = {
        initialDate: fechaInicial,
        finalDate: fechaFinal,
      }

      if (filtroRol && filtroRol !== "") {
        requestData.userRole = filtroRol
      }

      const response = await apiClient.post('/turns/generate', requestData)

      if (response.data) {
        setReporte(response.data)
        console.log("✅ Reporte generado exitosamente:", response.data)
      } else {
        setError("No se recibieron datos del reporte")
      }

    } catch (error: any) {
      console.error("❌ Error al generar reporte:", error)
      if (error.response?.status === 401) {
        setError("No autorizado. Verifica tus permisos para generar reportes.")
      } else if (error.response?.status === 400) {
        setError("Datos de solicitud inválidos. Verifica las fechas.")
      } else {
        setError("Error al generar el reporte. Inténtalo de nuevo.")
      }
    } finally {
      setGenerandoReporte(false)
      setLoading(false)
    }
  }

  // Cargar reporte inicial
  useEffect(() => {
    generarReporte()
  }, [])

  // Filtrar por rol en la visualización
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role === selectedRole ? null : role)
  }

  // Preparar datos para gráficos
  const prepareRoleData = () => {
    if (!reporte?.turnPercentageByRole) return []
    return Object.entries(reporte.turnPercentageByRole).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(1)),
    }))
  }

  const prepareCompletionData = () => {
    if (!reporte?.completedPercentageByRole) return []
    return Object.entries(reporte.completedPercentageByRole).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(1)),
    }))
  }

  const prepareDisabilityData = () => {
    if (!selectedRole || !reporte?.disabilityPercentagesByRole[selectedRole]) return []

    return Object.entries(reporte.disabilityPercentagesByRole[selectedRole]).map(([name, value]) => ({
      name: name.replace(/([A-Z])/g, " $1").trim(),
      value: Number(value.toFixed(1)),
    }))
  }

  // Función para formatear fechas
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Función para formatear tiempo
  const formatearTiempo = (tiempo: string) => {
    if (!tiempo || tiempo === "00:00:00") return "N/A"
    return tiempo
  }

  // Colores para los gráficos
  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]

  return (
      <div className="min-h-screen bg-white p-6">
        <div className="mb-6 flex items-center gap-2">
          <button
              onClick={() => router.back()}
              className="text-xl hover:bg-gray-100 p-2 rounded-full transition-colors"
              aria-label="Volver"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold">Análisis de Reportes</h1>
        </div>

        {/* Formulario para generar reporte */}
        <div className="bg-gray-50 p-4 rounded-lg border border-red-100 mb-6">
          <h2 className="text-xl font-semibold mb-4">Generar Nuevo Reporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha Inicial</label>
              <input
                  type="date"
                  value={fechaInicial}
                  onChange={(e) => setFechaInicial(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha Final</label>
              <input
                  type="date"
                  value={fechaFinal}
                  onChange={(e) => setFechaFinal(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Filtrar por Rol (Opcional)</label>
              <select
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Todos los roles</option>
                {especialidades.map((rol) => (
                    <option key={rol} value={rol}>{rol}</option>
                ))}
              </select>
            </div>
            <div>
              <button
                  onClick={generarReporte}
                  disabled={generandoReporte || !fechaInicial || !fechaFinal}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {generandoReporte ? 'Generando...' : 'Generar Reporte'}
              </button>
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
              <button
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setError(null)}
              >
                <span className="sr-only">Cerrar</span>
                <span className="text-xl">&times;</span>
              </button>
            </div>
        )}

        {/* Estado de carga */}
        {loading && !reporte && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600">Generando reporte...</p>
            </div>
        )}

        {/* Contenido del reporte */}
        {reporte && (
            <>
              {/* Información del reporte */}
              <div className="bg-gray-50 p-4 rounded-lg border border-red-100 mb-6">
                <h2 className="text-xl font-semibold mb-4">Información del Reporte</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded border border-red-100">
                    <p className="text-sm text-gray-500">ID del Reporte</p>
                    <p className="font-medium font-mono text-sm">{reporte.id}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-red-100">
                    <p className="text-sm text-gray-500">Fecha de Generación</p>
                    <p className="font-medium">{formatearFecha(reporte.actualDate)}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-red-100">
                    <p className="text-sm text-gray-500">Hora de Generación</p>
                    <p className="font-medium">{reporte.actualTime}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-red-100">
                    <p className="text-sm text-gray-500">Período Inicial</p>
                    <p className="font-medium">{formatearFecha(reporte.initialDate)}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-red-100">
                    <p className="text-sm text-gray-500">Período Final</p>
                    <p className="font-medium">{formatearFecha(reporte.finalDate)}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-red-100">
                    <p className="text-sm text-gray-500">Rol Filtrado</p>
                    <p className="font-medium">{reporte.userRole || "Todos los roles"}</p>
                  </div>
                </div>
              </div>

              {/* Filtros para visualización */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Filtrar Visualización por Rol</h2>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(reporte.turnPercentageByRole).map((rol) => (
                      <button
                          key={rol}
                          onClick={() => handleRoleFilter(rol)}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                              selectedRole === rol
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                      >
                        {rol}
                      </button>
                  ))}
                  {selectedRole && (
                      <button
                          onClick={() => setSelectedRole(null)}
                          className="px-4 py-2 rounded-full text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                      >
                        Limpiar filtro
                      </button>
                  )}
                </div>
              </div>

              {/* Pestañas */}
              <div className="mb-6 border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  <button
                      onClick={() => setActiveTab("general")}
                      className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                          activeTab === "general"
                              ? "border-b-2 border-red-500 text-red-500"
                              : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Resumen General
                  </button>
                  <button
                      onClick={() => setActiveTab("roles")}
                      className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                          activeTab === "roles"
                              ? "border-b-2 border-red-500 text-red-500"
                              : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Análisis por Roles
                  </button>
                  <button
                      onClick={() => setActiveTab("discapacidades")}
                      className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                          activeTab === "discapacidades"
                              ? "border-b-2 border-red-500 text-red-500"
                              : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Discapacidades
                  </button>
                </div>
              </div>

              {/* Contenido de las pestañas */}
              <div className="mb-6">
                {activeTab === "general" && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow border border-red-100">
                          <p className="text-sm text-gray-500">Total de Turnos</p>
                          <p className="text-2xl font-bold text-blue-600">{reporte.totalTurns}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border border-red-100">
                          <p className="text-sm text-gray-500">Turnos Completados</p>
                          <p className="text-2xl font-bold text-green-600">{reporte.turnsCompleted}</p>
                          <p className="text-xs text-gray-500">
                            {reporte.totalTurns > 0 ? Math.round((reporte.turnsCompleted / reporte.totalTurns) * 100) : 0}% del total
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border border-red-100">
                          <p className="text-sm text-gray-500">Tiempo Promedio de Espera</p>
                          <p className="text-2xl font-bold text-orange-600">{formatearTiempo(reporte.avarageWaitingTime)}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border border-red-100">
                          <p className="text-sm text-gray-500">Tiempo Promedio de Atención</p>
                          <p className="text-2xl font-bold text-purple-600">{formatearTiempo(reporte.averageTimeAttention)}</p>
                        </div>
                      </div>

                      {prepareRoleData().length > 0 && (
                          <div className="bg-white p-4 rounded-lg shadow border border-red-100 mb-6">
                            <h3 className="text-lg font-semibold mb-4">Distribución de Turnos por Rol</h3>
                            <div className="h-80">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                      data={prepareRoleData()}
                                      cx="50%"
                                      cy="50%"
                                      labelLine={true}
                                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                      outerRadius={80}
                                      fill="#8884d8"
                                      dataKey="value"
                                  >
                                    {prepareRoleData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip formatter={(value) => `${value}%`} />
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                      )}

                      {prepareCompletionData().length > 0 && (
                          <div className="bg-white p-4 rounded-lg shadow border border-red-100">
                            <h3 className="text-lg font-semibold mb-4">Porcentaje de Turnos Completados por Rol</h3>
                            <div className="h-80">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={prepareCompletionData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis domain={[0, 100]} />
                                  <Tooltip formatter={(value) => `${value}%`} />
                                  <Legend />
                                  <Bar dataKey="value" name="Porcentaje Completado" fill="#FF6384" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                      )}
                    </div>
                )}

                {activeTab === "roles" && (
                    <div>
                      <div className="bg-white p-4 rounded-lg shadow border border-red-100 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Distribución de Turnos por Rol</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rol
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Porcentaje de Turnos
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Porcentaje Completados
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cantidad Estimada
                              </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(reporte.turnPercentageByRole).map(([role, percentage]) => {
                              const estimatedTurns = Math.round((percentage / 100) * reporte.totalTurns)
                              return (
                                  <tr key={role} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{percentage.toFixed(1)}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      {reporte.completedPercentageByRole[role]?.toFixed(1) || '0.0'}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{estimatedTurns} turnos</td>
                                  </tr>
                              )
                            })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                )}

                {activeTab === "discapacidades" && (
                    <div>
                      {selectedRole ? (
                          prepareDisabilityData().length > 0 ? (
                              <div className="bg-white p-4 rounded-lg shadow border border-red-100">
                                <h3 className="text-lg font-semibold mb-4">Distribución de Discapacidades en {selectedRole}</h3>
                                <div className="h-80">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                      <Pie
                                          data={prepareDisabilityData()}
                                          cx="50%"
                                          cy="50%"
                                          labelLine={true}
                                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                          outerRadius={80}
                                          fill="#8884d8"
                                          dataKey="value"
                                      >
                                        {prepareDisabilityData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                      </Pie>
                                      <Tooltip formatter={(value) => `${value}%`} />
                                      <Legend />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                          ) : (
                              <div className="bg-white p-8 rounded-lg shadow text-center border border-red-100">
                                <p className="text-lg text-gray-500">
                                  No hay datos de discapacidades disponibles para {selectedRole}
                                </p>
                              </div>
                          )
                      ) : (
                          <div className="bg-white p-8 rounded-lg shadow text-center border border-red-100">
                            <p className="text-lg text-gray-500">
                              Selecciona un rol para ver la distribución de discapacidades
                            </p>
                          </div>
                      )}
                    </div>
                )}
              </div>
            </>
        )}

        {/* Mensaje cuando no hay reporte */}
        {!loading && !reporte && !error && (
            <div className="bg-white p-8 rounded-lg shadow text-center border border-red-100">
              <p className="text-lg text-gray-500 mb-4">
                No hay datos de reporte disponibles
              </p>
              <p className="text-sm text-gray-400">
                Configura las fechas y genera un nuevo reporte para ver los análisis
              </p>
            </div>
        )}
      </div>
  )
}

export default Analisis