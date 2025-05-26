
import { useRouter } from "next/navigation"

export default function Especialidad() {
  const router = useRouter()

  const handleButtonClick = (especialidad: string) => {
    // Guardar la especialidad seleccionada en sessionStorage
    sessionStorage.setItem("especialidadSeleccionada", especialidad)
    // Redirigir a la página de registro de turnos
    router.push("/ModuloSalud/Pantalla_Entrada/Turnos")
  }

  return (
      <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 pt-8 pb-20 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Seleccione una especialidad</h1>

        {/* Contenedor de botones */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-12">
          {/* Fila 1 */}
          <button
              onClick={() => handleButtonClick("MedicinaGeneral")}
              className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow h-32 border border-gray-200"
          >
            <span className="text-gray-700 text-3xl mb-2">🩺</span>
            <span className="text-gray-700 font-medium">Medicina General</span>
          </button>

          <button
              onClick={() => handleButtonClick("Psicologia")}
              className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow h-32 border border-gray-200"
          >
            <span className="text-gray-700 text-3xl mb-2">🧠</span>
            <span className="text-gray-700 font-medium">Psicología</span>
          </button>

          {/* Fila 2 (centrada) */}
          <div className="col-span-2 flex justify-center mt-4">
            <button
                onClick={() => handleButtonClick("Odontologia")}
                className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow h-32 w-full max-w-xs border border-gray-200"
            >
              <span className="text-gray-700 text-3xl mb-2">🦷</span>
              <span className="text-gray-700 font-medium">Odontología</span>
            </button>
          </div>
        </div>
      </div>
  )
}
