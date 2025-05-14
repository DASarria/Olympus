import type React from "react"

import { useState } from "react"
import { useRouter } from "next/router"

const Turnos = () => {
  const router = useRouter()

  const initialFormState = {
    nombre: "",
    documento: "",
    rol: "",
    discapacidad: "",
  }

  const [formData, setFormData] = useState(initialFormState)

  const Roles = ["Estudiante", "Profesor", "Administrativo", "Servicios generales"]

  const opcionesDiscapacidad = ["NoTiene", "MayorDeEdad", "DisfuncionMotriz", "Embarazo", "Otra"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Datos enviados:", formData)

    // Guardar los datos en localStorage para accederlos en la página de confirmación
    localStorage.setItem("turnoData", JSON.stringify(formData))

    // Redireccionar a la página de confirmación
    router.push("/Pantalla_Entrada/Confirmacion")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg w-full max-w-md border border-red-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Registro de Turno</h2>

        {/* Campo Nombre */}
        <div className="mb-6 border border-red-500 rounded p-1">
          <label className="block text-gray-700 mb-2" htmlFor="nombre">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 focus:outline-none bg-transparent"
            required
          />
        </div>

        {/* Campo Documento */}
        <div className="mb-6 border border-red-500 rounded p-1">
          <label className="block text-gray-700 mb-2" htmlFor="documento">
            Documento
          </label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            className="w-full px-3 py-2 focus:outline-none bg-transparent"
            required
          />
        </div>

        {/* Campo Rol */}
        <div className="mb-6 border border-red-500 rounded p-1">
          <label className="block text-gray-700 mb-2" htmlFor="rol">
            Rol
          </label>
          <select
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="w-full px-3 py-2 focus:outline-none bg-transparent appearance-none"
            required
          >
            <option value="">Seleccione una opción</option>
            {Roles.map((esp) => (
              <option key={esp} value={esp}>
                {esp.replace(/([A-Z])/g, " $1").trim()}
              </option>
            ))}
          </select>
        </div>

        {/* Campo Discapacidad */}
        <div className="mb-8 border border-red-500 rounded p-1">
          <label className="block text-gray-700 mb-2" htmlFor="discapacidad">
            Discapacidad
          </label>
          <select
            id="discapacidad"
            name="discapacidad"
            value={formData.discapacidad}
            onChange={handleChange}
            className="w-full px-3 py-2 focus:outline-none bg-transparent appearance-none"
            required
          >
            <option value="">Seleccione una opción</option>
            {opcionesDiscapacidad.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion.replace(/([A-Z])/g, " $1").trim()}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => {
              setFormData(initialFormState)
              router.back()
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors border border-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors border border-blue-600"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  )
}

export default Turnos
