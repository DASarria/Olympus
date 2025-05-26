import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import axios, { AxiosInstance, AxiosError } from "axios"
import { useRouter } from "next/router"

// Definimos la URL base de la API
const TURNS_API_BASE_URL = "https://eciturnos-e5egf4dyezdkdgfq.canadaeast-01.azurewebsites.net/api"

// Interfaces para tipado
interface Turno {
    code: string
    userName: string
    specialization: string
    state?: string
    identityDocument?: string
    role?: string
    disabilitie?: string
}

interface TurnosData {
    medicinaGeneral: { actual: Turno | null; proximos: Turno[] }
    odontologia: { actual: Turno | null; proximos: Turno[] }
    psicologia: { actual: Turno | null; proximos: Turno[] }
}

interface MediaFile {
    id: string
    name: string
    contentType: string
}

interface Slide {
    id: string
    name: string
    url: string
    isLoading?: boolean
}

export default function SalaDeEspera() {
    const router = useRouter()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [slides, setSlides] = useState<Slide[]>([])
    const [slidesLoading, setSlidesLoading] = useState(true)
    const [turnosData, setTurnosData] = useState<TurnosData>({
        medicinaGeneral: { actual: null, proximos: [] },
        odontologia: { actual: null, proximos: [] },
        psicologia: { actual: null, proximos: [] },
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [autenticado, setAutenticado] = useState(false)

    // Crear instancia de axios que se actualiza dinámicamente
    const createApiClient = useCallback((): AxiosInstance => {
        return axios.create({
            baseURL: TURNS_API_BASE_URL,
            headers: {
                "Content-Type": "application/json",
            },
        })
    }, [])

    // Interceptor para agregar el token automáticamente
    const setupAxiosInterceptor = useCallback((apiClient: AxiosInstance): AxiosInstance => {
        apiClient.interceptors.request.use(
            (config) => {
                const currentToken = sessionStorage.getItem('token')
                if (currentToken) {
                    // El token ya viene con 'Bearer ' desde sessionStorage
                    config.headers.Authorization = currentToken
                }
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )
        return apiClient
    }, [])

    const nextSlide = useCallback(() => {
        if (slides.length > 0) {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
        }
    }, [slides.length])

    const prevSlide = useCallback(() => {
        if (slides.length > 0) {
            setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        }
    }, [slides.length])


    // Función para obtener la lista de archivos de media
    const obtenerArchivosMedia = useCallback(async (): Promise<MediaFile[]> => {
        try {
            console.log("Obteniendo lista de archivos de media...")

            const apiClient = setupAxiosInterceptor(createApiClient())
            const response = await apiClient.get<MediaFile[]>('/files/')

            console.log("✓ Archivos de media obtenidos:", response.data)
            return Array.isArray(response.data) ? response.data : []
        } catch (error) {
            console.error("❌ Error al obtener archivos de media:", error)
            const axiosError = error as AxiosError
            if (axiosError.response?.status === 401) {
                console.log("Token expirado")
                router.push('/')
            }
            return []
        }
    }, [setupAxiosInterceptor, createApiClient, router])

    // Función para cargar las imágenes del carrusel
    const cargarImagenesCarrusel = useCallback(async () => {
        setSlidesLoading(true)
        try {
            console.log("🔄 Cargando imágenes del carrusel...")

            // Verificar autenticación
            if (!autenticado && !sessionStorage.getItem("token")) {
                console.log("No hay token, autenticando...")
                router.push('/')
                return
            }

            const archivos = await obtenerArchivosMedia()

            // Filtrar solo archivos de imagen
            const imagenesCarrusel = archivos.filter(archivo =>
                archivo.contentType && archivo.contentType.startsWith('image/')
            )

            if (imagenesCarrusel.length === 0) {
                console.log("No se encontraron imágenes, usando slides por defecto...")
                // Usar slides por defecto si no hay imágenes en el servidor
                setSlides([])
            } else {
                // Convertir archivos de media a slides
                const slidesFromAPI = imagenesCarrusel.map(archivo => ({
                    id: archivo.id,
                    name: archivo.name || "Imagen de información",
                    url: `${TURNS_API_BASE_URL}/files/${archivo.id}`,
                    isLoading: false
                }))

                setSlides(slidesFromAPI)
                console.log("✅ Imágenes del carrusel cargadas:", slidesFromAPI.length)
            }
        } catch (error) {
            console.error("❌ Error al cargar imágenes del carrusel:", error)
            // Usar slides por defecto en caso de error
            setSlides([])
        } finally {
            setSlidesLoading(false)
        }
    }, [autenticado, obtenerArchivosMedia, router])

    // Verificar token existente al cargar el componente
    useEffect(() => {
        const tokenExistente = sessionStorage.getItem('token')
        if (tokenExistente) {
            setAutenticado(true)
            console.log("✓ Token existente encontrado")
        }
    }, [])

    // Función para obtener turnos por especialización
    const obtenerTurnos = useCallback(async (especialidad: string): Promise<Turno[]> => {
        try {
            console.log(`Obteniendo turnos para especialidad: ${especialidad}`)

            const apiClient = setupAxiosInterceptor(createApiClient())
            const response = await apiClient.get<Turno[]>(`/turns/list`, {
                params: { specialization: especialidad },
            })

            console.log(`✓ Respuesta para turnos de ${especialidad}:`, response.data)
            return Array.isArray(response.data) ? response.data : []
        } catch (error) {
            console.error(`❌ Error al obtener turnos de ${especialidad}:`, error)
            const axiosError = error as AxiosError
            if (axiosError.response) {
                console.error("Status:", axiosError.response.status)
                console.error("Data:", axiosError.response.data)

                // Si es error 401, intentar reautenticar
                if (axiosError.response.status === 401) {
                    console.log("Token expirado")
                    router.push('/')
                }
            }
            return []
        }
    }, [setupAxiosInterceptor, createApiClient, router])

    // Función para obtener turno actual por especialización
    const obtenerTurnoActual = useCallback(async (especialidad: string): Promise<Turno | null> => {
        try {
            console.log(`Obteniendo turno actual para especialidad: ${especialidad}`)

            const apiClient = setupAxiosInterceptor(createApiClient())
            const response = await apiClient.get<Turno>(`/turns/actualTurn`, {
                params: { specialization: especialidad },
            })

            console.log(`✓ Respuesta para turno actual de ${especialidad}:`, response.data)
            return response.data || null
        } catch (error) {
            console.error(`❌ Error al obtener turno actual de ${especialidad}:`, error)
            const axiosError = error as AxiosError
            if (axiosError.response) {
                console.error("Status:", axiosError.response.status)
                console.error("Data:", axiosError.response.data)

                // Si es error 401, intentar reautenticar
                if (axiosError.response.status === 401) {
                    console.log("Token expirado, intentando reautenticar...")
                    router.push('/')
                }
            }
            return null
        }
    }, [setupAxiosInterceptor, createApiClient, router])

    // Cargar datos de turnos
    const cargarDatos = useCallback(async () => {
        setLoading(true)
        try {
            console.log("🔄 Iniciando carga de datos...")

            // Verificar autenticación
            if (!autenticado && !sessionStorage.getItem("token")) {
                console.log("No hay token, autenticando...")
                router.push('/')
                return
            }

            // Obtener datos para cada especialidad
            const especialidades = [
                { nombre: "MedicinaGeneral", key: "medicinaGeneral" },
                { nombre: "Odontologia", key: "odontologia" },
                { nombre: "Psicologia", key: "psicologia" },
            ]

            const nuevosDatos: TurnosData = {
                medicinaGeneral: { actual: null, proximos: [] },
                odontologia: { actual: null, proximos: [] },
                psicologia: { actual: null, proximos: [] },
            }

            for (const esp of especialidades) {
                try {
                    console.log(`📋 Procesando especialidad: ${esp.nombre}`)

                    // Obtener turno actual
                    const turnoActual = await obtenerTurnoActual(esp.nombre)

                    // Obtener lista de próximos turnos
                    const listaTurnos = await obtenerTurnos(esp.nombre)

                    // Filtrar para obtener solo los próximos (excluyendo el actual)
                    const turnosProximos = Array.isArray(listaTurnos)
                        ? listaTurnos.filter((turno) => !turnoActual || turno.code !== turnoActual.code).slice(0, 5)
                        : [] // Limitar a 5 próximos turnos

                    nuevosDatos[esp.key as keyof TurnosData] = {
                        actual: turnoActual,
                        proximos: turnosProximos,
                    }

                    console.log(`✓ Datos cargados para ${esp.nombre}:`, {
                        actual: turnoActual?.code || 'Sin turno',
                        proximos: turnosProximos.length,
                    })
                } catch (err) {
                    console.error(`❌ Error al cargar datos para ${esp.nombre}:`, err)
                    // Continuamos con la siguiente especialidad en caso de error
                }
            }

            setTurnosData(nuevosDatos)
            setError(null) // Limpiar errores previos si la carga fue exitosa
            console.log("✅ Carga de datos completada")
        } catch (err) {
            console.error("❌ Error general al cargar datos:", err)
            setError("Error al cargar datos de turnos")
        } finally {
            setLoading(false)
        }
    }, [autenticado, obtenerTurnoActual, obtenerTurnos, router])

    // Efecto para el carrusel
    useEffect(() => {
        if (slides.length === 0) return

        const interval = setInterval(() => {
            nextSlide()
        }, 5000)
        return () => clearInterval(interval)
    }, [slides.length, nextSlide])

    // Efecto para cargar datos iniciales
    useEffect(() => {
        // Esperar un poco antes de cargar datos para asegurar que el token esté disponible
        const timer = setTimeout(() => {
            cargarImagenesCarrusel()
            cargarDatos()
        }, 1000)

        // Configurar actualización periódica de datos
        const intervalDatos = setInterval(() => {
            cargarDatos()
        }, 10000) // Actualizar cada 30 segundos

        // Recargar imágenes cada 5 minutos por si se agregan nuevas
        const intervalImagenes = setInterval(() => {
            cargarImagenesCarrusel()
        }, 300000) // 5 minutos

        return () => {
            clearTimeout(timer)
            clearInterval(intervalDatos)
            clearInterval(intervalImagenes)
        }
    }, [cargarDatos, cargarImagenesCarrusel])

    const renderizarTurno = (turno: Turno | null, esTurnoActual = false) => {
        if (!turno)
            return (
                <div
                    className={`${
                        esTurnoActual ? "bg-gray-300" : "bg-white border border-gray-200"
                    } rounded-md p-3 shadow-sm h-[120px] flex flex-col justify-center items-center`}
                >
                    <div className="text-gray-500">Sin turno</div>
                </div>
            )

        return (
            <div
                className={`${
                    esTurnoActual ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-800"
                } rounded-md p-3 shadow-sm h-[120px] flex flex-col justify-center items-center`}
            >
                <div
                    className={`${esTurnoActual ? "text-lg font-bold" : "text-gray-500 text-sm"} ${
                        !esTurnoActual && "order-2"
                    }`}
                >
                    {turno.code}
                </div>
                <div className={`text-center ${!esTurnoActual && "order-1"}`}>{turno.userName}</div>
            </div>
        )
    }

    // Componente para manejar la carga de imágenes con token
    const ImagenConToken = ({ slide, className }: { slide: Slide; className: string }) => {
        const [imageSrc, setImageSrc] = useState<string>('')
        const [imageLoading, setImageLoading] = useState(true)
        const [imageError, setImageError] = useState(false)

        useEffect(() => {
            const cargarImagen = async () => {
                if (!slide.url.includes('/files/')) {
                    // Es una imagen placeholder, usar directamente
                    setImageSrc(slide.url)
                    setImageLoading(false)
                    return
                }

                try {
                    const apiClient = setupAxiosInterceptor(createApiClient())
                    const response = await apiClient.get(slide.url, {
                        responseType: 'blob'
                    })

                    const blob = response.data
                    const imageUrl = URL.createObjectURL(blob)
                    setImageSrc(imageUrl)
                    setImageLoading(false)
                } catch (error) {
                    console.error('Error cargando imagen:', error)
                    setImageError(true)
                    setImageSrc('/api/placeholder/800/400')
                    setImageLoading(false)
                }
            }

            cargarImagen()

            // Cleanup function para liberar la URL del blob
            return () => {
                if (imageSrc && imageSrc.startsWith('blob:')) {
                    URL.revokeObjectURL(imageSrc)
                }
            }
        }, [slide.url, imageSrc, setupAxiosInterceptor, createApiClient])

        if (imageLoading) {
            return (
                <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
                    <div className="text-gray-500">Cargando imagen...</div>
                </div>
            )
        }

        return (
            <Image
                src={imageSrc}
                alt={slide.name}
                width={800}
                height={400}
                className={className}
                priority
                onError={() => {
                    if (!imageError) {
                        setImageError(true)
                        setImageSrc('/api/placeholder/800/400')
                    }
                }}
            />
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header fijo */}
            <header className="bg-red-600 text-white p-4 sticky top-0 z-10 shadow-md">
                <h1 className="text-2xl font-bold text-center">SALA DE ESPERA</h1>
            </header>

            {/* Contenido principal */}
            <main className="flex-1 p-4 max-w-7xl mx-auto w-full space-y-6">
                {/* Carrusel de imágenes */}
                <div className="relative rounded-lg shadow-lg overflow-hidden mt-2">
                    <div className="relative h-64 md:h-96">
                        {slidesLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                                <div className="text-gray-500">Cargando imágenes...</div>
                            </div>
                        ) : slides.length > 0 ? (
                            <>
                                <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                                    <ImagenConToken
                                        slide={slides[currentSlide]}
                                        className="object-contain w-full h-full"
                                    />
                                </div>

                                {/* Controles del carrusel */}
                                {slides.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevSlide}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-all z-20"
                                            aria-label="Anterior"
                                        >
                                            <span className="text-xl">&lt;</span>
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-all z-20"
                                            aria-label="Siguiente"
                                        >
                                            <span className="text-xl">&gt;</span>
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                <div className="text-gray-500">No hay imágenes disponibles</div>
                            </div>
                        )}
                    </div>
                    {!slidesLoading && slides.length > 0 && (
                        <div className="text-center py-3 text-sm text-gray-600 bg-transparent">
                            {slides[currentSlide]?.name || "Información"}
                        </div>
                    )}
                </div>

                {/* Mensaje de error si existe */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span className="block sm:inline">{error}</span>
                        <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                            <span className="sr-only">Cerrar</span>
                            <span className="text-xl">&times;</span>
                        </button>
                    </div>
                )}

                {/* Sección de turnos con scroll */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto pb-4">
                    {/* Columna de títulos */}
                    <div className="space-y-4">
                        <div className="h-12"></div>
                        <div className="bg-slate-700 text-white p-4 rounded-md h-[120px] flex items-center justify-center sticky top-0">
                            <span className="font-medium text-center">Turno actual</span>
                        </div>
                        <div className="bg-slate-700 text-white p-4 rounded-md h-[120px] flex items-center justify-center sticky top-[136px]">
                            <span className="font-medium text-center">Próximos turnos</span>
                        </div>
                    </div>

                    {/* Columna Medicina General */}
                    <div className="space-y-4">
                        <div className="bg-slate-700 text-white p-3 rounded-md flex items-center justify-center h-12">
                            <span className="font-medium">Medicina General</span>
                        </div>
                        {/* Turno actual */}
                        {loading ? (
                            <div className="bg-gray-200 animate-pulse rounded-md h-[120px]"></div>
                        ) : (
                            renderizarTurno(turnosData.medicinaGeneral.actual, true)
                        )}
                        {/* Próximo turno */}
                        {loading ? (
                            <div className="bg-gray-200 animate-pulse rounded-md h-[120px]"></div>
                        ) : (
                            renderizarTurno(turnosData.medicinaGeneral.proximos[0], false)
                        )}
                    </div>

                    {/* Columna Odontología */}
                    <div className="space-y-4">
                        <div className="bg-slate-700 text-white p-3 rounded-md flex items-center justify-center h-12">
                            <span className="font-medium">Odontología</span>
                        </div>
                        {/* Turno actual */}
                        {loading ? (
                            <div className="bg-gray-200 animate-pulse rounded-md h-[120px]"></div>
                        ) : (
                            renderizarTurno(turnosData.odontologia.actual, true)
                        )}
                        {/* Próximo turno */}
                        {loading ? (
                            <div className="bg-gray-200 animate-pulse rounded-md h-[120px]"></div>
                        ) : (
                            renderizarTurno(turnosData.odontologia.proximos[0], false)
                        )}
                    </div>

                    {/* Columna Psicología */}
                    <div className="space-y-4">
                        <div className="bg-slate-700 text-white p-3 rounded-md flex items-center justify-center h-12">
                            <span className="font-medium">Psicología</span>
                        </div>
                        {/* Turno actual */}
                        {loading ? (
                            <div className="bg-gray-200 animate-pulse rounded-md h-[120px]"></div>
                        ) : (
                            renderizarTurno(turnosData.psicologia.actual, true)
                        )}
                        {/* Próximo turno */}
                        {loading ? (
                            <div className="bg-gray-200 animate-pulse rounded-md h-[120px]"></div>
                        ) : (
                            renderizarTurno(turnosData.psicologia.proximos[0], false)
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
