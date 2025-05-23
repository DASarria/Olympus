"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { aUr } from "@/pages/api/salasCreaU"

interface Reserva {
  id?: string
  userName: string
  userId: string
  role: null
  date: {
    day: string
    time: string
  }
  roomId: string
  loans: string[]
  state: string
  people: number
}

interface ElementoInfo {
  id: string
  nombre: string
  cantidad: number
  descripcion: string
}
interface ElementoAPI {
  id: string;
  name: string;
  description?: string;
  quantity?: number;
}

interface Props {
  reserva: Reserva
  onClose: () => void
  onSave: (updatedReserva: Reserva) => void
}

interface RoomsProps {
  roomId: string
  building: string
  capacity: number
  elements: string[]
}

const ReservaExpandida: React.FC<Props> = ({ reserva, onClose, onSave }) => {
  const [editedReserva, setEditedReserva] = useState<Reserva>(reserva)
  const [originalLoans, setOriginalLoans] = useState<string[]>([])
  const [availableElements, setAvailableElements] = useState<ElementoInfo[]>([])
  const [elementDetails, setElementDetails] = useState<Record<string, ElementoInfo>>({})
  const [isWithinTimeWindow, setIsWithinTimeWindow] = useState<boolean>(false)
  const token = sessionStorage.getItem("token")
  const url = aUr
  const [elementoSeleccionado, setElementoSeleccionado] = useState<string>("")
  const [rooms, setRooms] = useState<RoomsProps[]>([])

  // Store the original loans when component mounts
  useEffect(() => {
    setOriginalLoans([...reserva.loans])
    fetchAvailableElements()
    fetchRooms()
    checkTimeWindow(reserva.date)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reserva])
  

  // Check if the reservation time is within 1.5 hours of current time
  const checkTimeWindow = (date: { day: string; time: string }) => {
    const now = new Date()
    const reservationTime = new Date(`${date.day}T${date.time}`)

    // Calculate time difference in milliseconds
    const timeDiff = reservationTime.getTime() - now.getTime()

    // 1.5 hours = 5400000 milliseconds
    const isWithin = Math.abs(timeDiff) <= 5400000
    setIsWithinTimeWindow(isWithin)

    return isWithin
  }

  const fetchRooms = async () => {
  try {
    const response = await fetch(`${url}/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
    if (!response.ok) throw new Error("Error al cargar salas")
    const data = await response.json()
    setRooms(data)
  } catch (error) {
    console.error("Error cargando salas:", error)
  }
}

  // Fetch available elements to show in dropdown
  const fetchAvailableElements = async () => {
    try {
      const response = await fetch(`${url}/elements`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error cargando elementos")
      }

      const data = await response.json()
      const elements = (data as ElementoAPI[])
        .filter((el: ElementoAPI) => el.name)
        .map((el: ElementoAPI) => ({
          id: el.id,
          nombre: el.name,
          cantidad: el.quantity || 0,
          descripcion: el.description || "Sin descripción",
        }))

      // Create a lookup object for element details
      const detailsMap: Record<string, ElementoInfo> = {}
      elements.forEach((el: ElementoInfo) => {
        detailsMap[el.id] = el
      })

      setElementDetails(detailsMap)
      setAvailableElements(elements)
    } catch (error) {
      console.error("Error cargando elementos:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "date") {
      const newDate = {
        ...editedReserva.date,
        day: value,
      }

      setEditedReserva({
        ...editedReserva,
        date: newDate,
      })

      // Check if the new date/time is within the time window
      checkTimeWindow(newDate)
    } else if (name === "time") {
      // Asegurarse de que el formato de la hora sea correcto (HH:MM:00)
      const formattedTime = value.includes(":00") ? value : `${value}:00`

      const newDate = {
        ...editedReserva.date,
        time: formattedTime,
      }

      setEditedReserva({
        ...editedReserva,
        date: newDate,
      })

      // Check if the new date/time is within the time window
      checkTimeWindow(newDate)
    } else {
      setEditedReserva({
        ...editedReserva,
        [name]: value,
      })
    }

    if (name === "loans") {
      setElementoSeleccionado(value)
    }
  }

  // Modificar la función handleSave para asegurar que los cambios se guarden correctamente
  const handleSave = async () => {
    try {

      // Asegurarse de que roomId tiene el formato correcto
      const updatedReserva = {
        ...editedReserva,
        role: null,
       roomId: editedReserva.roomId.replace(/\s+/g, ''),

      }

await onSave(updatedReserva)

      await onSave(updatedReserva)

      // Luego, actualizar element quantities based on loan changes and time window
      await updateElementQuantities()

      // Notificar explícitamente que las reservas han cambiado para forzar una actualización
      localStorage.setItem("reservationsUpdated", "true")

      onClose()
    } catch (error) {
      console.error("Error al guardar la reserva:", error)
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar la reserva. Por favor, intente de nuevo.",
        icon: "error",
      })
    }
  }

  // Update element quantities based on loan changes
  const updateElementQuantities = async () => {
    // Only update quantities if within the time window
    if (!isWithinTimeWindow) {
      return
    }

    // Get added elements (in new loans but not in original)
    const addedElements = editedReserva.loans.filter((id) => !originalLoans.includes(id))

    // Get removed elements (in original but not in new loans)
    const removedElements = originalLoans.filter((id) => !editedReserva.loans.includes(id))

    // Update quantities for added elements (decrease)
    for (const elementId of addedElements) {
      try {
        // First get the current element to know its quantity
        const elementResponse = await fetch(`${url}/elements/${elementId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        })

        if (!elementResponse.ok) continue

        const element = await elementResponse.json()
        const newQuantity = Math.max(0, element.quantity - 1)

        // Update the element quantity
        await fetch(`${url}/elements/${elementId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            ...element,
            quantity: newQuantity,
          }),
        })
      } catch (error) {
        console.error(`Error updating quantity for element ${elementId}:`, error)
      }
    }

    // Update quantities for removed elements (increase)
    for (const elementId of removedElements) {
      try {
        // First get the current element to know its quantity
        const elementResponse = await fetch(`${url}/elements/${elementId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        })

        if (!elementResponse.ok) continue

        const element = await elementResponse.json()
        const newQuantity = element.quantity + 1

        // Update the element quantity
        await fetch(`${url}/elements/${elementId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            ...element,
            quantity: newQuantity,
          }),
        })
      } catch (error) {
        console.error(`Error updating quantity for element ${elementId}:`, error)
      }
    }
  }

  const stateOptions = ["RESERVA_CONFIRMADA", "RESERVA_CANCELADA", "RESERVA_TERMINADA"]

  // Handle adding an element to loans
  const handleAddElement = (elementId: string) => {
    if (!elementId) return

    // Check if element is already in loans
    if (editedReserva.loans.includes(elementId)) {
      Swal.fire({
        title: "Elemento ya añadido",
        text: "Este elemento ya está en la lista de préstamos",
        icon: "warning",
      })
      return
    }

    // Check if element is available (quantity > 0)
    const element = availableElements.find((el) => el.id === elementId)
    if (!element || element.cantidad <= 0) {
      Swal.fire({
        title: "Elemento no disponible",
        text: "No hay unidades disponibles de este elemento",
        icon: "error",
      })
      return
    }

    // If not within time window, just add to loans without checking quantity
    if (!isWithinTimeWindow) {
      setEditedReserva({
        ...editedReserva,
        loans: [...editedReserva.loans, elementId],
      })
      return
    }

    // Within time window, check if there are enough elements available
    if (element.cantidad > 0) {
      setEditedReserva({
        ...editedReserva,
        loans: [...editedReserva.loans, elementId],
      })

      // Update local available elements count
      setAvailableElements((prev) =>
        prev.map((el) => (el.id === elementId ? { ...el, cantidad: el.cantidad - 1 } : el)),
      )
    } else {
      Swal.fire({
        title: "Elemento no disponible",
        text: "No hay unidades disponibles de este elemento",
        icon: "error",
      })
    }
  }

  // Handle removing an element from loans
  const handleRemoveElement = (elementId: string) => {
    setEditedReserva({
      ...editedReserva,
      loans: editedReserva.loans.filter((id) => id !== elementId),
    })

    // If within time window, update local available elements count
    if (isWithinTimeWindow) {
      setAvailableElements((prev) =>
        prev.map((el) => (el.id === elementId ? { ...el, cantidad: el.cantidad + 1 } : el)),
      )
    }
  }

  return (
    <tr className="bg-white rounded-xl drop-shadow-xl">
      <td colSpan={7}>
        <div className="bg-white p-4 rounded-xl mt-2 shadow-md">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label>
                <strong>Nombre:</strong>
              </label>
              <input
                type="text"
                name="userName"
                value={editedReserva.userName}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <label>
                <strong>Identificación:</strong>
              </label>
              <input
                type="text"
                name="userId"
                value={editedReserva.userId}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <label>
                <strong>Estado:</strong>
              </label>
              <select
                name="state"
                value={editedReserva.state}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              >
                {stateOptions.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label>
                <strong>Número de personas:</strong>
              </label>
              <input
                type="number"
                name="people"
                value={editedReserva.people}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              />
            </div>

            <div className="flex flex-col">
              <label>
                <strong>Préstamos:</strong>
                {!isWithinTimeWindow && (
                  <span className="text-xs text-amber-600 ml-1">(Fuera de ventana de tiempo)</span>
                )}
              </label>
              <div className="flex flex-col gap-2">
                <select
                  className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
                  onChange={(e) => handleAddElement(e.target.value)}
                  value={elementoSeleccionado}
                >
                  <option value="" disabled>
                    Seleccionar elemento
                  </option>
                  {availableElements.map((element) => (
                    <option key={element.id} value={element.id} disabled={isWithinTimeWindow && element.cantidad <= 0}>
                      {element.nombre} {isWithinTimeWindow ? `(Disponibles: ${element.cantidad})` : ""}
                    </option>
                  ))}
                </select>

                <div className="mt-2 max-h-20 overflow-y-auto">
                  {editedReserva.loans.length > 0 ? (
                    <ul className="text-left text-sm">
                      {editedReserva.loans.map((loanId) => {
                        const element = elementDetails[loanId]
                        return (
                          <li key={loanId} className="flex justify-between items-center mb-1 bg-gray-50 p-1 rounded">
                            <span>{element ? element.nombre : loanId}</span>
                            <button
                              onClick={() => handleRemoveElement(loanId)}
                              className="text-red-500 text-xs bg-white px-2 py-1 rounded-full"
                            >
                              Quitar
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No hay elementos prestados</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label>
                <strong>Fecha:</strong>
              </label>
              <input
                type="date"
                name="date"
                value={`${editedReserva.date.day}`}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              />
            </div>

            <div className="flex flex-col">
              <label>
                <strong>Hora:</strong>
              </label>
              <input
                type="time"
                name="time"
                value={`${editedReserva.date.time.substring(0, 5)}`}
                onChange={handleChange}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              />
            </div>

            <div className="flex flex-col">
              <label>
                <strong>Sala:</strong>
              </label>
              <select
                name="roomId"
                value={editedReserva.roomId}
                onChange={(e) => setEditedReserva({ ...editedReserva, roomId: e.target.value })}
                className="px-3 py-1 rounded-xl bg-white drop-shadow-md"
              >
                {rooms.map((room) => (
                <option key={room.roomId} value={room.roomId}>
                  {room.roomId.split("-").join(" ")}
                </option>
              ))}
              </select>
            </div>
          </div>

          {/* Time window indicator */}
          <div
            className={`mt-4 p-2 rounded-lg text-sm ${isWithinTimeWindow ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}
          >
            <p>
              {isWithinTimeWindow
                ? "✓ Esta reserva está dentro de la ventana de tiempo (1.5 horas). Los elementos prestados reducirán el inventario inmediatamente."
                : "⚠️ Esta reserva está fuera de la ventana de tiempo (1.5 horas). Los elementos prestados no reducirán el inventario hasta que la reserva esté más próxima."}
            </p>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button onClick={onClose} className="px-4 py-1 text-sm rounded-full bg-[#990000] text-white">
              Cerrar
            </button>
            <button onClick={handleSave} className="px-4 py-1 text-sm rounded-full bg-[#990000] text-white">
              Guardar
            </button>
          </div>
        </div>
      </td>
    </tr>
  )
}

export default ReservaExpandida