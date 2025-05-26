"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback, useMemo } from "react"
import axios from "axios"

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

interface ErrorResponse {
  response?: {
    status?: number
    data?: {
      message?: string
    }
  }
  message?: string
}

type EspecialidadKey = keyof TurnosData

// Función para decodificar el token JWT y obtener la especialidad y rol
const obtenerDatosDelToken = (): { especialidad: EspecialidadKey | null; rol: string | null } => {
  try {
    const token = sessionStorage.getItem("token")
    if (!token) return { especialidad: null, rol: null }

    // Decodificar el token JWT (asumiendo que es un JWT estándar)
    const payload = JSON.parse(atob(token.split(".")[1]))

    // Mapear las especialidades del token a las claves del componente
    const mapeoEspecialidades: Record<string, EspecialidadKey> = {
      GENERAL_MEDICINE: "MedicinaGeneral",
      DENTIST: "Odontologia",
      PSYCHOLOGY: "Psicologia",
    }

    return {
      especialidad: mapeoEspecialidades[payload.specialty] || null,
      rol: payload.role || null,
    }
  } catch (error) {
    console.error("Error al decodificar el token:", error)
    return { especialidad: null, rol: null }
  }
}

const TurnosGestion = () => {
  const router = useRouter()

  const [turnos, setTurnos] = useState<TurnosData>({
    MedicinaGeneral: { actual: null, siguiente: null, proximos: [] },
    Odontologia: { actual: null, siguiente: null, proximos: [] },
    Psicologia: { actual: null, siguiente: null, proximos: [] },
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [procesando, setProcesando] = useState<string | null>(null)

  // Mover especialidades fuera del componente para evitar recreación
  const especialidades = useMemo(() => {
    const todasLasEspecialidades = [
      { key: "MedicinaGeneral" as EspecialidadKey, nombre: "Medicina General" },
      { key: "Odontologia" as EspecialidadKey, nombre: "Odontología" },
      { key: "Psicologia" as EspecialidadKey, nombre: "Psicología" },
    ]

    const { especialidad: especialidadDelDoctor, rol } = obtenerDatosDelToken()

    // Si el rol es ADMIN o MEDICAL_SECRETARY, mostrar todas las especialidades
    if (rol === "ADMIN" || rol === "MEDICAL_SECRETARY") {
      console.log(`Usuario con rol ${rol} - mostrando todas las especialidades`)
      return todasLasEspecialidades
    }

    // Si es DOCTOR, mostrar solo su especialidad
    if (rol === "DOCTOR") {
      if (!especialidadDelDoctor) {
        console.warn("Doctor sin especialidad asignada en el token")
        return []
      }
      console.log(`Doctor con especialidad ${especialidadDelDoctor} - mostrando solo su especialidad`)
      return todasLasEspecialidades.filter((esp) => esp.key === especialidadDelDoctor)
    }

    // Si no se puede obtener el rol o es un rol no reconocido, no mostrar nada
    console.warn("Rol no reconocido o no encontrado en el token:", rol)
    return []
  }, [])

  // Crear cliente API con interceptor
  const createApiClient = useCallback(() => {
    const client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Interceptor para agregar token automáticamente
    client.interceptors.request.use(
        (config) => {
          const token = sessionStorage.getItem("token")
          if (token) {
            config.headers.Authorization = token
          }
          return config
        },
        (error) => {
          return Promise.reject(error)
        },
    )

    return client
  }, [])

  const verificarAutenticacion = useCallback(() => {
    const token = sessionStorage.getItem("token")
    if (!token) {
      setError("Es necesario autenticarse para gestionar turnos")
      router.push("/")
      return false
    }

    const { especialidad: especialidadDelDoctor, rol } = obtenerDatosDelToken()

    if (!rol) {
      setError("Token inválido o sin rol asignado")
      router.push("/")
      return false
    }

    // Validar según el rol
    if (rol === "DOCTOR" && !especialidadDelDoctor) {
      setError("Doctor sin especialidad asignada")
      router.push("/")
      return false
    }

    if (!["ADMIN", "MEDICAL_SECRETARY", "DOCTOR"].includes(rol)) {
      setError("No tienes permisos para acceder a la gestión de turnos")
      router.push("/")
      return false
    }

    return true
  }, [router])

  // Función para obtener turno actual por especialización
  const obtenerTurnoActual = useCallback(
      async (especialidad: string): Promise<TurnoInfo | null> => {
        try {
          const apiClient = createApiClient()
          const response = await apiClient.get(`/turns/actualTurn`, {
            params: { specialization: especialidad },
          })
          return response.data || null
        } catch (error: unknown) {
          console.error(`Error al obtener turno actual de ${especialidad}:`, error)
          const typedError = error as ErrorResponse

          if (typedError.response?.status === 401) {
            router.push("/")
          }
          return null
        }
      },
      [createApiClient, router],
  )

  // Función para obtener lista de turnos por especialización
  const obtenerTurnos = useCallback(
      async (especialidad: string): Promise<TurnoInfo[]> => {
        try {
          const apiClient = createApiClient()
          const response = await apiClient.get(`/turns/list`, {
            params: { specialization: especialidad },
          })
          return Array.isArray(response.data) ? response.data : []
        } catch (error: unknown) {
          console.error(`Error al obtener turnos de ${especialidad}:`, error)
          const typedError = error as ErrorResponse

          if (typedError.response?.status === 401) {
            router.push("/")
          }
          return []
        }
      },
      [createApiClient, router],
  )

  // Función para cargar datos de una especialidad
  const cargarDatosEspecialidad = useCallback(
      async (especialidad: string): Promise<TurnosEspecialidad> => {
        try {
          console.log(`Cargando datos para ${especialidad}...`)

          // Obtener turno actual (en atención)
          const turnoActual = await obtenerTurnoActual(especialidad)
          console.log(`Turno actual de ${especialidad}:`, turnoActual)

          // Obtener lista de turnos activos
          const listaTurnos = await obtenerTurnos(especialidad)
          console.log(`Turnos activos de ${especialidad}:`, listaTurnos.length)

          // Filtrar turnos próximos (excluyendo el actual si existe)
          const turnosProximos = listaTurnos.filter(
              (turno) => turno.state !== "En Atencion" && turno.state !== "Atendido",
          )

          // El siguiente turno es el primero de la lista de próximos
          const siguienteTurno = turnosProximos.length > 0 ? turnosProximos[0] : null

          console.log(`Datos procesados para ${especialidad}:`, {
            actual: turnoActual?.code || "Sin turno",
            siguiente: siguienteTurno?.code || "Sin siguiente",
            proximos: turnosProximos.length,
          })

          return {
            actual: turnoActual,
            siguiente: siguienteTurno,
            proximos: turnosProximos,
          }
        } catch (error) {
          console.error(`Error al cargar datos de ${especialidad}:`, error)
          return { actual: null, siguiente: null, proximos: [] }
        }
      },
      [obtenerTurnoActual, obtenerTurnos],
  )

  // Función para cargar todos los datos usando useCallback
  const cargarDatos = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Verificar autenticación
      const authOk = verificarAutenticacion()
      if (!authOk) {
        setLoading(false)
        return
      }

      console.log("Cargando datos de turnos...")

      // Cargar datos para cada especialidad
      const nuevosDatos: TurnosData = {
        MedicinaGeneral: { actual: null, siguiente: null, proximos: [] },
        Odontologia: { actual: null, siguiente: null, proximos: [] },
        Psicologia: { actual: null, siguiente: null, proximos: [] },
      }

      for (const esp of especialidades) {
        const datos = await cargarDatosEspecialidad(esp.key)
        nuevosDatos[esp.key] = datos
      }

      setTurnos(nuevosDatos)
      console.log("✅ Datos cargados exitosamente")
    } catch (error: unknown) {
      console.error("❌ Error al cargar datos:", error)
      setError("Error al cargar los datos de turnos")
    } finally {
      setLoading(false)
    }
  }, [especialidades, cargarDatosEspecialidad, verificarAutenticacion])

  // Función para pasar al siguiente turno
  const handleSiguiente = async (especialidadKey: EspecialidadKey) => {
    const especialidad = especialidades.find((e) => e.key === especialidadKey)
    if (!especialidad) return

    const datosEsp = turnos[especialidadKey]
    const tieneActual = !!datosEsp.actual
    const accion = tieneActual ? "pasar al siguiente turno" : "iniciar el primer turno"

    // Confirmar acción
    const confirmar = window.confirm(`¿Estás seguro de que deseas ${accion} en ${especialidad.nombre}?`)
    if (!confirmar) return

    setProcesando(especialidadKey)
    setError(null)

    try {
      console.log(`${tieneActual ? "Pasando" : "Iniciando"} turno en ${especialidad.nombre}...`)
      const apiClient = createApiClient()

      await apiClient.put("/turns/pass", null, {
        params: { specialization: especialidadKey },
      })

      console.log(`✅ Turno de ${especialidad.nombre} ${tieneActual ? "avanzado" : "iniciado"} exitosamente`)

      // Recargar datos después de la operación
      await cargarDatos()
    } catch (error: unknown) {
      console.error(`❌ Error al ${tieneActual ? "pasar" : "iniciar"} turno de ${especialidad.nombre}:`, error)
      const typedError = error as ErrorResponse

      if (typedError.response?.status === 401) {
        router.push("/")
      } else if (typedError.response?.status === 404 || typedError.message?.includes("NoSuchElementException")) {
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
    const especialidad = especialidades.find((e) => e.key === especialidadKey)
    if (!especialidad) return

    // Confirmar acción
    const confirmar = window.confirm(
        `¿Estás seguro de que deseas deshabilitar todos los turnos de ${especialidad.nombre}? Esta acción no se puede deshacer.`,
    )
    if (!confirmar) return

    setProcesando(especialidadKey)
    setError(null)

    try {
      console.log(`Deshabilitando turnos de ${especialidad.nombre}...`)
      const apiClient = createApiClient()

      await apiClient.put("/turns/disable", null, {
        params: { specialization: especialidadKey },
      })

      console.log(`✅ Turnos de ${especialidad.nombre} deshabilitados exitosamente`)

      // Recargar datos después de la operación
      await cargarDatos()
    } catch (error: unknown) {
      console.error(`❌ Error al deshabilitar turnos de ${especialidad.nombre}:`, error)
      const typedError = error as ErrorResponse

      if (typedError.response?.status === 401) {
        router.push("/")
      } else {
        setError(`Error al deshabilitar turnos de ${especialidad.nombre}. Inténtalo de nuevo.`)
      }
    } finally {
      setProcesando(null)
    }
  }

  // Función para renderizar información del turno
  const renderizarTurno = (turno: TurnoInfo | null, tipo: "actual" | "siguiente") => {
    if (!turno) {
      return (
          <div className="w-full text-center bg-gray-200 rounded-md py-3 text-gray-500">
            {tipo === "actual" ? "Sin turno actual" : "Sin próximo turno"}
          </div>
      )
    }

    return (
        <div
            className={`w-full text-center rounded-md py-3 font-semibold ${
                tipo === "actual" ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"
            }`}
        >
          <div className="text-sm text-gray-600 mb-1">{tipo === "actual" ? "Turno actual" : "Próximo turno"}</div>
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
  }, [cargarDatos])

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
            {loading ? "Cargando..." : "Actualizar"}
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
              <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
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
            <div className="flex justify-center">
              <div
                  className={`${
                      especialidades.length === 1
                          ? "w-full max-w-md" // Para doctores: contenedor centrado y más ancho
                          : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full" // Para admin/secretary: grid normal
                  }`}
              >
                {especialidades.map((esp) => {
                  const datosEsp = turnos[esp.key]
                  const estaProcesando = procesando === esp.key

                  return (
                      <div
                          key={esp.key}
                          className={`bg-gray-50 p-6 rounded-lg shadow-md flex flex-col items-center justify-between gap-4 ${
                              especialidades.length === 1 ? "min-h-[500px]" : ""
                          }`}
                      >
                        <h2 className="text-xl font-bold text-center">{esp.nombre}</h2>

                        {/* Turno actual */}
                        {renderizarTurno(datosEsp.actual, "actual")}

                        {/* Próximo turno */}
                        {renderizarTurno(datosEsp.siguiente, "siguiente")}

                        {/* Información adicional */}
                        <div className="w-full text-center text-sm text-gray-600">
                          <div className="text-base font-medium">{datosEsp.proximos.length} turnos en espera</div>
                          <div className="text-sm mt-2">
                            {datosEsp.actual
                                ? `Atendiendo: ${datosEsp.actual.code}`
                                : datosEsp.proximos.length > 0
                                    ? "Listo para iniciar"
                                    : "Sin turnos"}
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex w-full justify-between mt-4 gap-3">
                          <button
                              onClick={() => handleAbortar(esp.key)}
                              disabled={estaProcesando || (datosEsp.proximos.length === 0 && !datosEsp.actual)}
                              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                              title={
                                datosEsp.proximos.length === 0 && !datosEsp.actual
                                    ? "No hay turnos para abortar"
                                    : "Deshabilitar todos los turnos activos"
                              }
                          >
                            {estaProcesando ? "Procesando..." : "Abortar Turnos"}
                          </button>
                          <button
                              onClick={() => handleSiguiente(esp.key)}
                              disabled={estaProcesando || (datosEsp.proximos.length === 0 && !datosEsp.actual)}
                              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                              title={
                                datosEsp.proximos.length === 0 && !datosEsp.actual
                                    ? "No hay turnos disponibles"
                                    : datosEsp.actual
                                        ? "Pasar al siguiente turno"
                                        : "Iniciar primer turno"
                              }
                          >
                            {estaProcesando ? "Procesando..." : datosEsp.actual ? "Siguiente" : "Iniciar"}
                          </button>
                        </div>
                      </div>
                  )
                })}
              </div>
            </div>
        )}
      </div>
  )
}

export default TurnosGestion

