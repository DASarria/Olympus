"use client"

import { useRouter } from "next/navigation" // Cambiado para App Router
import { useState, useEffect, useCallback } from "react"
import axios from "axios"

// Definir la URL base del API
const API_BASE_URL = "https://eciturnos-e5egf4dyezdkdgfq.canadaeast-01.azurewebsites.net/api"

// Interface para los archivos
interface MediaFile {
    id: string
    name: string
    contentType: string
}

// Interface para errores de Axios
interface ErrorResponse {
    response?: {
        status?: number
    }
    message?: string
}

const Contenido_Visual = () => {
    const router = useRouter()
    const [files, setFiles] = useState<MediaFile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)

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

    // Función para autenticar (reutilizar credenciales del sistema)
    const autenticarUsuario = () => {
        try {
            // Verificar si ya hay un token válido
            const tokenExistente = sessionStorage.getItem('token')
            if (tokenExistente) {
                return true
            }

            // Si no hay token, intentar obtener uno (esto dependerá de tu sistema de auth)
            console.log("No hay token disponible. Es necesario autenticarse.")
            setError("Es necesario autenticarse para gestionar el contenido visual")
            router.push('/')
            return false
        } catch (error: unknown) {
            console.error("Error de autenticación:", error)
            router.push('/')
            setError("Error de autenticación")
            return false
        }
    }

    // Función para obtener todos los archivos
    const obtenerArchivos = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            // Verificar autenticación
            const authOk = autenticarUsuario()
            if (!authOk) {
                setLoading(false)
                router.push('/')
            }

            console.log("Obteniendo lista de archivos...")
            const apiClient = createApiClient()
            const response = await apiClient.get('/files/')

            if (Array.isArray(response.data)) {
                setFiles(response.data)
                console.log("✓ Archivos obtenidos:", response.data.length)
            } else {
                setFiles([])
                console.log("No se encontraron archivos")
            }
        } catch (error: unknown) {
            console.error("❌ Error al obtener archivos:", error)
            const typedError = error as ErrorResponse

            if (typedError.response?.status === 401) {
                setError("No autorizado. Por favor, inicia sesión.")
                router.push('/')
            } else {
                setError("Error al cargar los archivos. Inténtalo de nuevo.")
            }
            setFiles([])
        } finally {
            setLoading(false)
        }
    }, [])

    // Función para eliminar un archivo
    const handleDelete = async (id: string, fileName: string) => {
        // Confirmar eliminación
        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar "${fileName}"?`)
        if (!confirmar) return

        setDeleting(id)
        setError(null)

        try {
            console.log(`Eliminando archivo: ${fileName} (ID: ${id})`)
            const apiClient = createApiClient()
            await apiClient.delete(`/files/${id}`)

            // Actualizar la lista local
            setFiles(files.filter((file) => file.id !== id))
            console.log("✓ Archivo eliminado exitosamente")
        } catch (error: unknown) {
            console.error("❌ Error al eliminar archivo:", error)
            const typedError = error as ErrorResponse

            if (typedError.response?.status === 401) {
                setError("No autorizado para eliminar archivos")
                router.push('/')
            } else if (typedError.response?.status === 404) {
                setError("El archivo no fue encontrado")
                // Remover de la lista local si no existe en el servidor
                setFiles(files.filter((file) => file.id !== id))
            } else {
                setError(`Error al eliminar "${fileName}". Inténtalo de nuevo.`)
            }
        } finally {
            setDeleting(null)
        }
    }

    // Función para manejar la subida de archivos
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            setError('Solo se permiten archivos de imagen')
            return
        }

        // Validar tamaño (max 10MB como está configurado en el backend)
        if (file.size > 10 * 1024 * 1024) {
            setError('El archivo es demasiado grande. Máximo 10MB.')
            return
        }

        subirArchivo(file)
    }

    // Función para subir archivo
    const subirArchivo = async (file: File) => {
        setError(null)

        try {
            console.log(`Subiendo archivo: ${file.name}`)
            const apiClient = createApiClient()

            const formData = new FormData()
            formData.append('file', file)

            const response = await apiClient.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            console.log("✓ Archivo subido exitosamente:", response.data)

            // Recargar la lista de archivos
            await obtenerArchivos()
        } catch (error: unknown) {
            console.error("❌ Error al subir archivo:", error)
            const typedError = error as ErrorResponse

            if (typedError.response?.status === 401) {
                setError("No autorizado para subir archivos")
                router.push('/')
            } else {
                setError(`Error al subir "${file.name}". Inténtalo de nuevo.`)
            }
        }
    }

    // Cargar archivos al montar el componente
    useEffect(() => {
        obtenerArchivos()
    }, [obtenerArchivos])

    // Función para obtener el tipo de archivo de manera legible
    const obtenerTipoArchivo = (contentType: string) => {
        if (contentType.startsWith('image/')) {
            return `Imagen (${contentType.split('/')[1].toUpperCase()})`
        }
        return contentType
    }

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
                <h1 className="text-2xl font-bold">Contenido Visual</h1>
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

            {/* Input para subir archivos */}
            <div className="mb-6">
                <label className="block">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500
                                 file:mr-4 file:py-2 file:px-4
                                 file:rounded-full file:border-0
                                 file:text-sm file:font-semibold
                                 file:bg-blue-50 file:text-blue-700
                                 hover:file:bg-blue-100
                                 cursor-pointer"
                    />
                </label>
                <p className="mt-1 text-sm text-gray-500">
                    Selecciona una imagen para subirla (máximo 10MB)
                </p>
            </div>

            {/* Tabla de archivos */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                {/* Header de la tabla */}
                <div className="grid grid-cols-4 bg-gray-200 py-3">
                    <div className="text-center font-medium">Archivo</div>
                    <div className="text-center font-medium">Tipo</div>
                    <div className="text-center font-medium">ID</div>
                    <div className="text-center font-medium">Acciones</div>
                </div>

                {/* Contenido de la tabla */}
                {loading ? (
                    <div className="py-8 text-center text-gray-500">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <p className="mt-2">Cargando archivos...</p>
                    </div>
                ) : files.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                        <p>No hay archivos disponibles</p>
                        <p className="text-sm">Sube una imagen usando el botón de arriba</p>
                    </div>
                ) : (
                    files.map((file) => (
                        <div key={file.id} className="grid grid-cols-4 border-b border-gray-200 py-3 hover:bg-gray-50">
                            <div className="pl-4 truncate" title={file.name}>
                                {file.name}
                            </div>
                            <div className="text-center text-sm text-gray-600">
                                {obtenerTipoArchivo(file.contentType)}
                            </div>
                            <div className="text-center text-sm text-gray-500 font-mono">
                                {file.id.substring(0, 8)}...
                            </div>
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => handleDelete(file.id, file.name)}
                                    disabled={deleting === file.id}
                                    className={`px-4 py-1 rounded-full text-sm transition-colors ${
                                        deleting === file.id
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                    }`}
                                >
                                    {deleting === file.id ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Botón de actualizar */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={obtenerArchivos}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                    {loading ? 'Cargando...' : 'Actualizar Lista'}
                </button>
            </div>
        </div>
    )
}

export default Contenido_Visual