"use client"

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'

// URL base del API
const API_BASE_URL = "https://eciturnos-e5egf4dyezdkdgfq.canadaeast-01.azurewebsites.net/api"

// Interfaces
interface TurnoInfo {
  code: string
  userName: string
  specialization?: string
  state?: string
  identityDocument?: string
  role?: string
  disabilitie?: string
}

interface TurnosEspecialidad {
  actual: TurnoInfo | null
  siguiente: TurnoInfo | null
  proximos: TurnoInfo[]
}

interface TurnosData {
  MedicinaGeneral: TurnosEspecialidad
  Odontologia: TurnosEspecialidad
  Psicologia: TurnosEspecialidad
}

type EspecialidadKey = keyof TurnosData

const TurnosGestion = () => {
  const router = useRouter()

  const [turnos, setTurnos] = useState<TurnosData>({
    MedicinaGeneral: { actual: null, siguiente: null, proximos: [] },
    Odontologia: { actual: null, siguiente: null, proximos: [] },
    Psicologia: { actual: null, siguiente: null, proximos: [] }
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [procesando, setProcesando] = useState<string | null>(null)
  const [autenticado, setAutenticado] = useState(false)

  const especialidades = [
    { key: 'MedicinaGeneral' as EspecialidadKey, nombre: 'Medicina General' },
    { key: 'Odontologia' as EspecialidadKey, nombre: 'Odontología' },
    { key: 'Psicologia' as EspecialidadKey, nombre: 'Psicología' }
  ]

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
      setError("Es necesario autenticarse para gestionar turnos")
      return false
    }
    setAutenticado(true)
    return true
  }

  // Función para obtener turno actual por especialización
  const obtenerTurnoActual = async (especialidad: string): Promise<TurnoInfo | null> => {
    try {
      const apiClient = createApiClient()
      const response = await apiClient.get(`/turns/actualTurn`, {
        params: { specialization: especialidad }
      })
      return response.data || null
    } catch (error: any) {
      console.error(`Error al obtener turno actual de ${especialidad}:`, error)
      if (error.response?.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.")
      }
      return null
    }
  }

  // Función para obtener lista de turnos por especialización
  const obtenerTurnos = async (especialidad: string): Promise<TurnoInfo[]> => {
    try {
      const apiClient = createApiClient()
      const response = await apiClient.get(`/turns/list`, {
        params: { specialization: especialidad }
      })
      return Array.isArray(response.data) ? response.data : []
    } catch (error: any) {
      console.error(`Error al obtener turnos de ${especialidad}:`, error)
      if (error.response?.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.")
      }
      return []
    }
  }

  // Función para cargar datos de una especialidad
  const cargarDatosEspecialidad = async (especialidad: string): Promise<TurnosEspecialidad> => {
    try {
      console.log(`Cargando datos para ${especialidad}...`)

      // Obtener turno actual (en atención)
      const turnoActual = await obtenerTurnoActual(especialidad)
      console.log(`Turno actual de ${especialidad}:`, turnoActual)

      // Obtener lista de turnos activos
      const listaTurnos = await obtenerTurnos(especialidad)
      console.log(`Turnos activos de ${especialidad}:`, listaTurnos.length)

      // Filtrar turnos próximos (excluyendo el actual si existe)
      const turnosProximos = listaTurnos.filter(turno =>
          turno.state !== 'En Atencion' && turno.state !== 'Atendido'
      )

      // El siguiente turno es el primero de la lista de próximos
      const siguienteTurno = turnosProximos.length > 0 ? turnosProximos[0] : null

      console.log(`Datos procesados para ${especialidad}:`, {
        actual: turnoActual?.code || 'Sin turno',
        siguiente: siguienteTurno?.code || 'Sin siguiente',
        proximos: turnosProximos.length
      })

      return {
        actual: turnoActual,
        siguiente: siguienteTurno,
        proximos: turnosProximos
      }
    } catch (error) {
      console.error(`Error al cargar datos de ${especialidad}:`, error)
      return { actual: null, siguiente: null, proximos: [] }
    }
  }

  // Función para cargar todos los datos
  const cargarDatos = async () => {
    setLoading(true)
    setError(null)

    try {
      // Verificar autenticación
      const authOk = await verificarAutenticacion()
      if (!authOk) {
        setLoading(false)
        return
      }

      console.log("Cargando datos de turnos...")

      // Cargar datos para cada especialidad
      const nuevosDatos: TurnosData = {
        MedicinaGeneral: { actual: null, siguiente: null, proximos: [] },
        Odontologia: { actual: null, siguiente: null, proximos: [] },
        Psicologia: { actual: null, siguiente: null, proximos: [] }
      }

      for (const esp of especialidades) {
        const datos = await cargarDatosEspecialidad(esp.key)
        nuevosDatos[esp.key] = datos
      }

      setTurnos(nuevosDatos)
      console.log("✅ Datos cargados exitosamente")
    } catch (error: any) {
      console.error("❌ Error al cargar datos:", error)
      setError("Error al cargar los datos de turnos")
    } finally {
      setLoading(false)
    }
  }

  // Función para pasar al siguiente turno
  const handleSiguiente = async (especialidadKey: EspecialidadKey) => {
    const especialidad = especialidades.find(e => e.key === especialidadKey)
    if (!especialidad) return

    const datosEsp = turnos[especialidadKey]
    const tieneActual = !!datosEsp.actual
    const accion = tieneActual ? 'pasar al siguiente turno' : 'iniciar el primer turno'

    // Confirmar acción
    const confirmar = window.confirm(
        `¿Estás seguro de que deseas ${accion} en ${especialidad.nombre}?`
    )
    if (!confirmar) return

    setProcesando(especialidadKey)
    setError(null)

    try {
      console.log(`${tieneActual ? 'Pasando' : 'Iniciando'} turno en ${especialidad.nombre}...`)
      const apiClient = createApiClient()

      await apiClient.put('/turns/pass', null, {
        params: { specialization: especialidadKey }
      })

      console.log(`✅ Turno de ${especialidad.nombre} ${tieneActual ? 'avanzado' : 'iniciado'} exitosamente`)

      // Recargar datos después de la operación
      await cargarDatos()

    } catch (error: any) {
      console.error(`❌ Error al ${tieneActual ? 'pasar' : 'iniciar'} turno de ${especialidad.nombre}:`, error)
      if (error.response?.status === 401) {
        setError("No autorizado. Verifica tus permisos.")
      } else if (error.response?.status === 404 || error.message?.includes('NoSuchElementException')) {
        setError(`No hay turnos disponibles para ${accion} en ${especialidad.nombre}`)
      } else {
        setError(`Error al ${accion} en ${especialidad.nombre}. Inténtalo de nuevo.`)
      }
    } finally {
      setProcesando(null)
    }
  }

  // Función para deshabilitar turnos (abortar)
  const handleAbortar = async (especialidadKey: EspecialidadKey) => {
    const especialidad = especialidades.find(e => e.key === especialidadKey)
    if (!especialidad) return

    // Confirmar acción
    const confirmar = window.confirm(
        `¿Estás seguro de que deseas deshabilitar todos los turnos de ${especialidad.nombre}? Esta acción no se puede deshacer.`
    )
    if (!confirmar) return

    setProcesando(especialidadKey)
    setError(null)

    try {
      console.log(`Deshabilitando turnos de ${especialidad.nombre}...`)
      const apiClient = createApiClient()

      await apiClient.put('/turns/disable', null, {
        params: { specialization: especialidadKey }
      })

      console.log(`✅ Turnos de ${especialidad.nombre} deshabilitados exitosamente`)

      // Recargar datos después de la operación
      await cargarDatos()

    } catch (error: any) {
      console.error(`❌ Error al deshabilitar turnos de ${especialidad.nombre}:`, error)
      if (error.response?.status === 401) {
        setError("No autorizado. Verifica tus permisos.")
      } else {
        setError(`Error al deshabilitar turnos de ${especialidad.nombre}. Inténtalo de nuevo.`)
      }
    } finally {
      setProcesando(null)
    }
  }

  // Función para renderizar información del turno
  const renderizarTurno = (turno: TurnoInfo | null, tipo: 'actual' | 'siguiente') => {
    if (!turno) {
      return (
          <div className="w-full text-center bg-gray-200 rounded-md py-3 text-gray-500">
            {tipo === 'actual' ? 'Sin turno actual' : 'Sin próximo turno'}
          </div>
      )
    }

    return (
        <div className={`w-full text-center rounded-md py-3 font-semibold ${
            tipo === 'actual' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'
        }`}>
          <div className="text-sm text-gray-600 mb-1">
            {tipo === 'actual' ? 'Turno actual' : 'Próximo turno'}
          </div>
          <div className="text-lg font-bold">{turno.code}</div>
          <div className="text-sm">{turno.userName}</div>
        </div>
    )
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()

    // Configurar actualización automática cada 30 segundos
    const interval = setInterval(cargarDatos, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
      <div className="min-h-screen bg-white p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-2">
          <button
              onClick={() => router.back()}
              className="text-xl hover:bg-gray-100 p-2 rounded-full transition-colors"
              aria-label="Volver"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold">Gestión de Turnos</h1>
          <button
              onClick={cargarDatos}
              disabled={loading}
              className="ml-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
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

        {/* Grid de especialidades */}
        {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Cargando datos de turnos...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {especialidades.map((esp) => {
                const datosEsp = turnos[esp.key]
                const estaProcesando = procesando === esp.key

                return (
                    <div
                        key={esp.key}
                        className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col items-center justify-between gap-4"
                    >
                      <h2 className="text-lg font-bold text-center">{esp.nombre}</h2>

                      {/* Turno actual */}
                      {renderizarTurno(datosEsp.actual, 'actual')}

                      {/* Próximo turno */}
                      {renderizarTurno(datosEsp.siguiente, 'siguiente')}

                      {/* Información adicional */}
                      <div className="w-full text-center text-sm text-gray-600">
                        <div>{datosEsp.proximos.length} turnos en espera</div>
                        <div className="text-xs mt-1">
                          {datosEsp.actual
                              ? `Atendiendo: ${datosEsp.actual.code}`
                              : datosEsp.proximos.length > 0
                                  ? 'Listo para iniciar'
                                  : 'Sin turnos'
                          }
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex w-full justify-between mt-2 gap-2">
                        <button
                            onClick={() => handleAbortar(esp.key)}
                            disabled={estaProcesando || (datosEsp.proximos.length === 0 && !datosEsp.actual)}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                            title={datosEsp.proximos.length === 0 && !datosEsp.actual ? 'No hay turnos para abortar' : 'Deshabilitar todos los turnos activos'}
                        >
                          {estaProcesando ? 'Procesando...' : 'Abortar Turnos'}
                        </button>
                        <button
                            onClick={() => handleSiguiente(esp.key)}
                            disabled={estaProcesando || (datosEsp.proximos.length === 0 && !datosEsp.actual)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
                            title={datosEsp.proximos.length === 0 && !datosEsp.actual ? 'No hay turnos disponibles' : datosEsp.actual ? 'Pasar al siguiente turno' : 'Iniciar primer turno'}
                        >
                          {estaProcesando ? 'Procesando...' : datosEsp.actual ? 'Siguiente' : 'Iniciar'}
                        </button>
                      </div>
                    </div>
                )
              })}
            </div>
        )}
      </div>
  )
}

export default TurnosGestion;