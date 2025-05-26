"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Turnos() {
  const router = useRouter()

  // Estado inicial del formulario adaptado a lo que espera el backend
  const initialFormState = {
    userName: "", // Nombre del usuario
    identityDocument: "", // Documento de identidad
    role: "Estudiante", // Rol por defecto (estudiante)
    specialization: "", // Especialización médica
    disabilitie: "NoTiene", // Tipo de discapacidad/prioridad por defecto
  }

  const [formData, setFormData] = useState(initialFormState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Opciones para los selectores
  const especialidades = ["MedicinaGeneral", "Odontologia", "Psicologia"]
  const opcionesDiscapacidad = ["NoTiene", "MayorDeEdad", "DisfuncionMotriz", "Embarazo", "Otra"]

  // Roles correctos que espera el backend
  const opcionesRol = ["Estudiante", "Docente", "Administrativo", "ServiciosGenerales"]

  // Cargar la especialidad seleccionada al iniciar
  useEffect(() => {
    const especialidadSeleccionada = sessionStorage.getItem("especialidadSeleccionada")
    if (especialidadSeleccionada) {
      setFormData((prev) => ({
        ...prev,
        specialization: especialidadSeleccionada,
      }))
    }
  }, [])

  // Obtener el token del sessionStorage al cargar el componente
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token")
    if (!storedToken) {
      setError("No se encontró un token de autenticación. Por favor inicie sesión.")
    }
  }, [])

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const token = sessionStorage.getItem("token")
    if (!token) {
      setError("Token no encontrado. Por favor inicie sesión.")
      setLoading(false)
      return
    }

    try {
      // Realizar la petición al backend
      const res = await fetch("https://eciturnos-e5egf4dyezdkdgfq.canadaeast-01.azurewebsites.net/api/turns/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(formData),
      })

      // Obtener la respuesta como JSON
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar el turno")
      }

      // Guardar los datos del turno y el código para la página de confirmación
      localStorage.setItem(
          "turnoData",
          JSON.stringify({
            nombre: formData.userName,
            documento: formData.identityDocument,
            rol: formData.role,
            discapacidad: formData.disabilitie,
          }),
      )

      localStorage.setItem("turnoCode", data.code || "N/A")

      // Redirigir a la página de confirmación
      router.push("/ModuloSalud/Pantalla_Entrada/Confirmacion")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error al registrar el turno"
      setError(errorMessage)
      console.error("Error al registrar turno:", error)
    } finally {
      setLoading(false)
    }
  }

  // Función para formatear nombres de opciones
  const formatOptionName = (name: string) => {
    return name
        .replace(/([A-Z])/g, " $1")
        .trim()
        .replace(/^./, (str) => str.toUpperCase())
  }

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registro de Turno</h2>

          {/* Mensaje de error */}
          {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <p>{error}</p>
              </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="mb-4">
              <label className="block text-gray-800 font-semibold mb-2" htmlFor="userName">
                Nombre completo
              </label>
              <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                  disabled={loading}
              />
            </div>

            {/* Documento de identidad */}
            <div className="mb-4">
              <label className="block text-gray-800 font-semibold mb-2" htmlFor="identityDocument">
                Documento de identidad
              </label>
              <input
                  type="text"
                  id="identityDocument"
                  name="identityDocument"
                  value={formData.identityDocument}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
                  required
                  disabled={loading}
              />
            </div>

            {/* Rol */}
            <div className="mb-4">
              <label className="block text-gray-800 font-semibold mb-2" htmlFor="role">
                Rol
              </label>
              <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none"
                  required
                  disabled={loading}
              >
                {opcionesRol.map((rol) => (
                    <option key={rol} value={rol}>
                      {rol}
                    </option>
                ))}
              </select>
            </div>

            {/* Especialización (deshabilitada, ya seleccionada) */}
            <div className="mb-4">
              <label className="block text-gray-800 font-semibold mb-2" htmlFor="specialization">
                Especialización
              </label>
              <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none bg-gray-100"
                  required
                  disabled={true}
              >
                <option value="">Seleccione una especialidad</option>
                {especialidades.map((esp) => (
                    <option key={esp} value={esp}>
                      {formatOptionName(esp)}
                    </option>
                ))}
              </select>
            </div>

            {/* Discapacidad/Prioridad */}
            <div className="mb-6">
              <label className="block text-gray-800 font-semibold mb-2" htmlFor="disabilitie">
                Prioridad
              </label>
              <select
                  id="disabilitie"
                  name="disabilitie"
                  value={formData.disabilitie}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none"
                  required
                  disabled={loading}
              >
                {opcionesDiscapacidad.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {formatOptionName(opcion)}
                    </option>
                ))}
              </select>
            </div>

            {/* Botones */}
            <div className="flex justify-between mt-8">
              <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors shadow"
                  disabled={loading}
              >
                Cancelar
              </button>
              <button
                  type="submit"
                  className={`px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-900 transition-colors shadow ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
              >
                {loading ? "Procesando..." : "Registrar turno"}
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}
