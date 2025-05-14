import { useEffect, useState } from "react"
import { useRouter } from "next/router"

interface TurnoData {
  nombre: string
  documento: string
  rol: string
  discapacidad: string
}

const Confirmacion = () => {
  const router = useRouter()
  const [turnoData, setTurnoData] = useState<TurnoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [turnoNumero, setTurnoNumero] = useState("M - 001")
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Recuperar los datos del localStorage
    const storedData = localStorage.getItem("turnoData")

    if (storedData) {
      setTurnoData(JSON.parse(storedData))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Iniciar el contador regresivo
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer)
          // Redirigir a la página de entrada/especialidad
          router.push("/Pantalla_Entrada/Especialidad")
          return 0
        }
        return prevCount - 1
      })
    }, 1000)

    // Limpiar el temporizador cuando el componente se desmonte
    return () => clearInterval(timer)
  }, [router])

  const handleConfirm = () => {
    // Aquí podrías enviar los datos a tu backend
    alert("¡Turno confirmado exitosamente!")
    // Limpiar los datos después de confirmar
    localStorage.removeItem("turnoData")
    // Redirigir inmediatamente a la página de entrada/especialidad
    router.push("/Pantalla_Entrada/Especialidad")
  }

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  if (!turnoData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg w-full max-w-md border border-red-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Error</h2>
          <p className="text-center mb-6">No se encontraron datos del turno.</p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/turnos")}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors border border-blue-600"
            >
              Volver al registro
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg w-full max-w-md border border-red-100">
        <div className="absolute top-4 right-4">
          <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
            {countdown}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Confirmación de Turno</h2>

        <div className="mb-8 text-center">
          <div className="p-4 bg-gray-50 border border-red-500 rounded-lg mb-4">
            <p className="text-lg mb-4">
              Su turno es el siguiente, por favor esperar el llamado en la pantalla de la sala de espera:
            </p>
            <div className="text-4xl font-bold text-red-600 p-3 border-2 border-red-600 rounded-lg inline-block">
              {turnoNumero}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Redirigiendo en {countdown} segundos...</p>
        </div>
      </div>
    </div>
  )
}

export default Confirmacion
