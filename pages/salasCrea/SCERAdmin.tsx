"use client"

import type React from "react"
import type { StaticImageData } from "next/image"

import { useEffect, useState } from "react"
import Image from "next/image"
import uno from "../../assets/images/uno.webp"
import jenga from "../../assets/images/jenga.webp"
import ajedrez from "../../assets/images/Ajedrez.jpg"
import cranium from "../../assets/images/cranium.webp"
import monos from "../../assets/images/Monos.webp"
import defaultImage from "../../assets/images/1imagen.jpg"
import Swal from "sweetalert2"

import { useRouter } from "next/router"
import { ArrowLeft, Package, CheckCircle, AlertCircle } from "lucide-react"

const imagenesPorNombre: Record<string, StaticImageData> = {
  Uno: uno,
  Jenga: jenga,
  Ajedrez: ajedrez,
  Cranium: cranium,
  Monos: monos,
}

interface Elemento {
  id: string
  nombre: string
  descripcion: string
  cantidad: number
  imagen: string | StaticImageData
  reservedCount?: number
}

interface Reserva {
  id: string
  userName: string
  userId: string
  role: string
  date: {
    day: string
    time: string
  }
  roomId: string
  loans: string[]
  state: string
  people: number
}

const SCERAdmin = () => {
  const [elementosList, setElementosList] = useState<Elemento[]>([])
  const [elementoSeleccionado, setElementoSeleccionado] = useState<Elemento | null>(null)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [nuevaDescripcion, setNuevaDescripcion] = useState("")
  const [nuevaCantidad, setNuevaCantidad] = useState(0)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState("")
  const [nuevaDesc, setNuevaDesc] = useState("")
  const [nuevaCantidadFormulario, setNuevaCantidadFormulario] = useState(0)
  const [nuevaImagen, setNuevaImagen] = useState<File | null>(null)
  const [previewImagen, setPreviewImagen] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const token = sessionStorage.getItem("token")
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const router = useRouter()
  const irAlInicio = () => {
    window.location.href = "/salasCrea/InicioSalasCreaADMIN"
  }

  useEffect(() => {
    const lastUpdateTime = localStorage.getItem("reservationsUpdated")
    if (lastUpdateTime) {
      setLastUpdated(new Date(lastUpdateTime))
    }

    const checkInterval = setInterval(() => {
      const lastUpdateTime = localStorage.getItem("reservationsUpdated")
      if (lastUpdateTime && (!lastUpdated || new Date(lastUpdateTime) > lastUpdated)) {
        setLastUpdated(new Date(lastUpdateTime))
        fetchElementos()
      }
    }, 3000)

    return () => clearInterval(checkInterval)
  }, [lastUpdated])

  const fetchElementos = async () => {
    try {
      console.log("SCERAdmin: Obteniendo elementos y reservas...")
      const response = await fetch(`${apiUrl}/elements`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      })

      if (!response.ok) throw new Error(`Error: ${response.statusText}`)
      const data = await response.json()
      console.log("SCERAdmin: Elementos obtenidos:", data)

      const reservationsResponse = await fetch(`${apiUrl}/revs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      })

      let activeReservations: Reserva[] = []
      if (reservationsResponse.ok) {
        activeReservations = await reservationsResponse.json()
        console.log("SCERAdmin: Reservas obtenidas:", activeReservations)

        activeReservations.forEach((reserva: Reserva) => {
          console.log(`SCERAdmin: Reserva ${reserva.id} - Préstamos:`, reserva.loans)
        })
      } else {
        console.error("SCERAdmin: Error obteniendo reservas:", reservationsResponse.statusText)
      }

      const reservedCounts: Record<string, number> = {}

      activeReservations.forEach((reserva) => {
        if (
          isWithinTimeWindow(reserva.date) &&
          reserva.state !== "RESERVA_TERMINADA" &&
          reserva.state !== "RESERVA_CANCELADA"
        ) {
          if (reserva.loans && reserva.loans.length > 0) {
            reserva.loans.forEach((loanId) => {
              reservedCounts[loanId] = (reservedCounts[loanId] || 0) + 1
            })
          }
        }
      })

      console.log("SCERAdmin: Conteo de elementos reservados:", reservedCounts)

      const elementos = data
        .filter((el: any) => el.name)
        .map((el: any) => ({
          id: el.id,
          nombre: el.name,
          descripcion: el.description || "Sin descripción",
          cantidad: el.quantity || 0,
          imagen: imagenesPorNombre[el.name] || defaultImage,
          reservedCount: reservedCounts[el.id] || 0,
        }))

      console.log("SCERAdmin: Elementos procesados con conteo de reservas:", elementos)
      setElementosList(elementos)

      if (elementoSeleccionado) {
        const updatedElement = elementos.find((el: Elemento) => el.id === elementoSeleccionado.id)
        if (updatedElement) {
          console.log("SCERAdmin: Actualizando elemento seleccionado:", updatedElement)
          setElementoSeleccionado(updatedElement)
          setNuevaDescripcion(updatedElement.descripcion)
          setNuevaCantidad(updatedElement.cantidad)
        }
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error("SCERAdmin: Error al obtener los datos de la API:", error)
    } finally {
    }
  }

  const isWithinTimeWindow = (date: { day: string; time: string }) => {
    const now = new Date()
    const reservationTime = new Date(`${date.day}T${date.time}`)

    const timeDiff = reservationTime.getTime() - now.getTime()

    return Math.abs(timeDiff) <= 5400000
  }

  const uploadImagen = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "tu_upload_preset")

    const res = await fetch(`https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload`, {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    return data.secure_url
  }

  useEffect(() => {
    fetchElementos()
  }, [])

  const handleClick = (elemento: Elemento) => {
    setElementoSeleccionado(elemento)
    setNuevaDescripcion(elemento.descripcion)
    setNuevaCantidad(elemento.cantidad)
    setModoEdicion(false)
  }

  const cerrarModal = () => {
    setElementoSeleccionado(null)
    setModoEdicion(false)
  }

  const guardarEdicion = async () => {
    if (!elementoSeleccionado) return

    try {
      const response = await fetch(`${apiUrl}/elements/${elementoSeleccionado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: nuevaDescripcion,
          quantity: nuevaCantidad,
        }),
      })

      if (!response.ok) throw new Error("No se pudo actualizar el elemento")

      const actualizados = elementosList.map((el) =>
        el.id === elementoSeleccionado.id ? { ...el, descripcion: nuevaDescripcion, cantidad: nuevaCantidad } : el,
      )
      setElementosList(actualizados)
      cerrarModal()

      Swal.fire("Éxito", "Elemento actualizado correctamente", "success")
    } catch (error) {
      console.error("Error al actualizar el elemento:", error)
      Swal.fire("Error", "No se pudo actualizar el elemento", "error")
    }
  }

  const eliminarElemento = async () => {
    if (!elementoSeleccionado) return

    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(`${apiUrl}/elements/${elementoSeleccionado.id}`, {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Error al eliminar el elemento: ${errorText}`)
        }

        const nuevos = elementosList.filter((el) => el.id !== elementoSeleccionado.id)
        setElementosList(nuevos)
        cerrarModal()

        Swal.fire("Eliminado", "Elemento eliminado correctamente", "success")
      } catch (error) {
        console.error(error)
        Swal.fire("Error", "No se pudo eliminar el elemento", "error")
      }
    }
  }

  const guardarNuevoElemento = async () => {
    if (!nuevoNombre.trim()) {
      Swal.fire("Error", "El nombre del elemento no puede estar vacío", "error")
      return
    }

    try {
      let imagenFinal: string | StaticImageData = defaultImage

      if (imagenesPorNombre[nuevoNombre]) {
        imagenFinal = imagenesPorNombre[nuevoNombre]
      } else if (previewImagen) {
        imagenFinal = previewImagen
      }

      if (nuevaImagen) {
        try {
          await uploadImagen(nuevaImagen)
        } catch (error) {
          console.error("Error al subir la imagen:", error)
        }
      }

      const response = await fetch(`${apiUrl}/elements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nuevoNombre,
          description: nuevaDesc || "Sin descripción",
          quantity: nuevaCantidadFormulario,
        }),
      })

      if (!response.ok) throw new Error("No se pudo crear el elemento")

      let nuevoElementoId
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()
        nuevoElementoId = data.id
      } else {
        const allResponse = await fetch(`${apiUrl}/elements`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        const allElements = await allResponse.json()
        const recienCreado = allElements.find((el: any) => el.name === nuevoNombre)
        if (!recienCreado) throw new Error("No se encontró el nuevo elemento")
        nuevoElementoId = recienCreado.id
      }

      const nuevoElemento: Elemento = {
        id: nuevoElementoId,
        nombre: nuevoNombre,
        descripcion: nuevaDesc || "Sin descripción",
        cantidad: nuevaCantidadFormulario,
        imagen: imagenFinal,
        reservedCount: 0,
      }

      setElementosList((prev) => [...prev, nuevoElemento])

      setMostrarFormulario(false)
      setNuevoNombre("")
      setNuevaDesc("")
      setNuevaCantidadFormulario(0)
      setPreviewImagen(null)
      setNuevaImagen(null)

      Swal.fire("Éxito", "Elemento creado correctamente", "success")
    } catch (error) {
      console.error("Error al crear nuevo elemento:", error)
      Swal.fire("Error", "No se pudo crear el elemento", "error")
    }
  }

  const handleImagenSeleccionada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0]
    if (archivo) {
      setNuevaImagen(archivo)
      setPreviewImagen(URL.createObjectURL(archivo))
    }
  }

  const getImageSrc = (imagen: string | StaticImageData): string => {
    if (typeof imagen === "string") {
      return imagen
    }
    return imagen.src
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex gap-5 font-bold text-[30px] ml-6 mb-6">
        <ArrowLeft onClick={irAlInicio} className="cursor-pointer mt-3" />
        <h1>Elementos Recreativos</h1>
      </div>

      {lastUpdated && (
        <div className="text-sm text-gray-500 mb-4 w-full max-w-4xl text-right">
          Última actualización: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {elementosList.map((elemento, idx) => (
          <div
            key={idx}
            className="cursor-pointer border rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 p-4 text-center bg-white"
            onClick={() => handleClick(elemento)}
          >
            <Image
              src={getImageSrc(elemento.imagen) || "/placeholder.svg"}
              alt={elemento.nombre}
              width={300}
              height={200}
              className="rounded-md object-cover mb-3 mx-auto"
            />
            <h3 className="text-lg font-semibold">{elemento.nombre}</h3>

            {/* Lista de información del elemento */}
            <ul className="mt-3 text-left space-y-2 px-2">
              <li className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-sm">
                  <span className="font-medium">Total:</span> {elemento.cantidad}
                </span>
              </li>

              <li className="flex items-center gap-2">
                <AlertCircle className={`w-4 h-4 ${elemento.reservedCount ? "text-amber-600" : "text-gray-400"}`} />
                <span className={`text-sm ${elemento.reservedCount ? "text-amber-600" : "text-gray-400"}`}>
                  <span className="font-medium">En préstamo:</span> {elemento.reservedCount || 0}
                </span>
              </li>

              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">
                  <span className="font-medium">Disponibles:</span>{" "}
                  {Math.max(0, elemento.cantidad - (elemento.reservedCount || 0))}
                </span>
              </li>
            </ul>
          </div>
        ))}
      </div>

      {/* Modal de detalle/edición */}
      {elementoSeleccionado && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-2xl relative text-center">
            <button
              onClick={cerrarModal}
              className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>
            <Image
              src={getImageSrc(elementoSeleccionado.imagen) || "/placeholder.svg"}
              alt={elementoSeleccionado.nombre}
              width={300}
              height={200}
              className="mx-auto rounded-md mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{elementoSeleccionado.nombre}</h3>
            {modoEdicion ? (
              <>
                <textarea
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  className="w-full border rounded-md p-2 mb-3"
                />
                <input
                  type="number"
                  value={nuevaCantidad}
                  onChange={(e) => setNuevaCantidad(Number.parseInt(e.target.value) || 0)}
                  className="w-full border rounded-md p-2 mb-4"
                  placeholder="Cantidad"
                  min={0}
                />
              </>
            ) : (
              <>
                <p className="mb-4">{elementoSeleccionado.descripcion}</p>

                {/* Lista de información del elemento en el modal */}
                <ul className="mb-6 space-y-3 bg-gray-50 p-4 rounded-lg text-left">
                  <li className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-gray-700" />
                    <div>
                      <p className="text-sm text-gray-600">Cantidad Total</p>
                      <p className="text-lg font-bold">{elementoSeleccionado.cantidad}</p>
                    </div>
                  </li>

                  <li className="flex items-center gap-3">
                    <AlertCircle
                      className={`w-5 h-5 ${elementoSeleccionado.reservedCount ? "text-amber-600" : "text-gray-400"}`}
                    />
                    <div>
                      <p className="text-sm text-gray-600">En Préstamo (próximas 1.5h)</p>
                      <p
                        className={`text-lg font-bold ${elementoSeleccionado.reservedCount ? "text-amber-600" : "text-gray-400"}`}
                      >
                        {elementoSeleccionado.reservedCount || 0}
                      </p>
                    </div>
                  </li>

                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Disponibles</p>
                      <p className="text-lg font-bold text-green-600">
                        {Math.max(0, elementoSeleccionado.cantidad - (elementoSeleccionado.reservedCount || 0))}
                      </p>
                    </div>
                  </li>
                </ul>
              </>
            )}
            <div className="flex justify-center gap-4 mt-4">
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={eliminarElemento}>
                Eliminar
              </button>
              {modoEdicion ? (
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={guardarEdicion}>
                  Guardar
                </button>
              ) : (
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setModoEdicion(true)}>
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Formulario de nuevo elemento */}
      {mostrarFormulario && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-2xl relative text-center">
            <button
              onClick={() => setMostrarFormulario(false)}
              className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">Nuevo Elemento</h3>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full border p-2 rounded mb-3"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
            <textarea
              placeholder="Descripción"
              className="w-full border p-2 rounded mb-3"
              value={nuevaDesc}
              onChange={(e) => setNuevaDesc(e.target.value)}
            />
            <input
              type="number"
              placeholder="Cantidad"
              className="w-full border p-2 rounded mb-3"
              value={nuevaCantidadFormulario}
              onChange={(e) => setNuevaCantidadFormulario(Number.parseInt(e.target.value) || 0)}
              min={0}
            />
            <input type="file" accept="image/*" onChange={handleImagenSeleccionada} className="mb-3" />
            {previewImagen && (
              <Image
                src={previewImagen || "/placeholder.svg"}
                alt="preview"
                width={300}
                height={200}
                className="mx-auto mb-3 rounded"
              />
            )}
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={guardarNuevoElemento}>
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Botón agregar */}
      <button
        onClick={() => setMostrarFormulario(true)}
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform z-40"
      >
        Agregar
      </button>
    </div>
  )
}

export default SCERAdmin
