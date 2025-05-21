"use client"

import { useState, useEffect } from "react"
import { Plus, Clock, Pencil, Trash } from "lucide-react"
import ReservaModal from "./ReservaModal"
import ReservaExpandida from "./ReservaExpandida"
import React from "react"
import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.min.css"


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

interface RevsTableProps {
  reservas: Reserva[]
}

interface RoomsProps {
  roomId: string
  building: string
  capacity: number
  elements: string[]
}

const stateColors: Record<string, string> = {
  RESERVA_CONFIRMADA: "bg-yellow-400",
  RESERVA_CANCELADA: "bg-red-700",
  RESERVA_TERMINADA: "bg-green-600",
}

const RevsTable = () => {
  const token = sessionStorage.getItem("token")
  const url = process.env.NEXT_PUBLIC_API_URL
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingReserva, setEditingReserva] = useState<Reserva | null>(null)
  const [hiddenRows, setHiddenRows] = useState<{ [key: string]: boolean }>({})
  const [searchId, setSearchId] = useState("")
  const [searchName, setSearchName] = useState("")
  const [searchRoom, setSearchRoom] = useState("")
  const [elementNames, setElementNames] = useState<Record<string, string>>({})
  const [rooms, setRooms] = useState<RoomsProps[]>([])


  const getRowColor = (reserva: Reserva) => {
    switch(reserva.state.toLowerCase()){
      case "reserva_confirmada":
        return stateColors.RESERVA_CONFIRMADA
      case "reserva_cancelada":
        return stateColors.RESERVA_CANCELADA
      case "reserva_terminada":
        return stateColors.RESERVA_TERMINADA
    }
  }


  const fetchReservas = async () => {
    try {
      const response = await fetch(`${url}/revs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        cache: "no-store", // Evitar caché
      })
      if (!response.ok) {
        throw new Error("Error cargando datos: " + response.statusText)
      }
      const data = await response.json()
      setReservas(data)
      localStorage.setItem("reservationsUpdated", "true")
    } catch (error) {
      console.error("Error cargando reservas:", error)
    }
  }

  // Fetch element names for display
  const fetchElementNames = async () => {
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
      const namesMap: Record<string, string> = {}

      data.forEach((element: any) => {
        if (element.id && element.name) {
          namesMap[element.id] = element.name
        }
      })

      setElementNames(namesMap)
    } catch (error) {
      console.error("Error cargando nombres de elementos:", error)
    }
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

  useEffect(() => {
    fetchReservas()
    fetchElementNames()
    fetchRooms()
  const intervalId = setInterval(() => {
    checkReservationsForQuantityUpdates()
  }, 60000) // revisa cada minuto

  return () => clearInterval(intervalId) // limpieza cuando se desmonta el componente
}, [])


  // Check if any reservations have entered the time window and need quantity updates
  const checkReservationsForQuantityUpdates = async () => {
    const now = new Date()

    for (const reserva of reservas) {
      const reservationTime = new Date(`${reserva.date.day}T${reserva.date.time}`)
      const timeDiff = reservationTime.getTime() - now.getTime()

      // If reservation is now within 1.5 hours and has loans
      if (Math.abs(timeDiff) <= 5400000 && reserva.loans.length > 0) {
        // Check if we've already processed this reservation
        const processedKey = `processed_${reserva.id}`
        if (!localStorage.getItem(processedKey)) {
          // Update element quantities
          await updateElementQuantities(reserva.loans)
          // Mark as processed
          localStorage.setItem(processedKey, "true")
        }
      }
    }
  }

  // Update element quantities for reservations that just entered the time window
  const updateElementQuantities = async (loans: string[]) => {
    for (const elementId of loans) {
      try {
        // Get current element
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
  }

  // Modificar la función handleAddReserva para usar el formato exacto requerido
  const handleAddReserva = async (nueva: Reserva) => {
    try {
      // Mostrar indicador de carga
      Swal.fire({
        title: "Guardando...",
        text: "Creando nueva reserva",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      // Verificar que el token existe
      if (!token) {
        throw new Error("No hay token de autenticación disponible")
      }

      // Asegurarse de que el formato de la hora sea correcto (HH:MM:00)
      const formattedTime = nueva.date.time.includes(":00") ? nueva.date.time : `${nueva.date.time}:00`

      // Crear el objeto de datos en el formato exacto requerido
      const datosParaEnviar = {
        userName: nueva.userName,
        userId: nueva.userId,
        role: null,
        date: {
          day: nueva.date.day,
          time: formattedTime,
        },
        roomId: nueva.roomId.charAt(0).toUpperCase() + nueva.roomId.slice(1), // Asegurar que comienza con mayúscula
        loans: nueva.loans,
        state: "RESERVA_CONFIRMADA",
        people: nueva.people,
      }

      // Realizar la solicitud POST directamente
      const response = await fetch(`${url}/revs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(datosParaEnviar),
      })

      // Obtener el texto de la respuesta para diagnóstico
      const responseText = await response.text()

      if (!response.ok) {
        // Mostrar información más detallada sobre el error
        Swal.fire({
          title: "Error",
          html: `
          <p>Error del servidor: ${response.status} ${response.statusText}</p>
          <p>Detalles: ${responseText}</p>
          <p>Verifique su conexión y permisos.</p>
        `,
          icon: "error",
        })
        throw new Error(`Error del servidor: ${response.status} ${response.statusText} - ${responseText}`)
      }

      // Actualizar la lista de reservas
      await fetchReservas()

      // Cerrar el modal
      setShowModal(false)

      // Mostrar mensaje de éxito
      Swal.fire({
        title: "Éxito",
        text: "Reserva creada correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error("Error al añadir reserva:", error)
      Swal.fire({
        title: "Error",
        text: `No se pudo crear la reserva: ${error instanceof Error ? error.message : "Error desconocido"}`,
        icon: "error",
      })
    }
  }

  // Modificar la función handleUpdateReserva para usar el formato exacto requerido
  const handleUpdateReserva = async (updatedReserva: Reserva) => {
    try {
      // Asegurarse de que el formato de la hora sea correcto (HH:MM:00)
      const formattedTime = updatedReserva.date.time.includes(":00")
        ? updatedReserva.date.time
        : `${updatedReserva.date.time}:00`

      const datosParaEnviar = {
        id: updatedReserva.id,
        userName: updatedReserva.userName,
        userId: updatedReserva.userId,
        role: null,
        date: {
          day: updatedReserva.date.day,
          time: formattedTime,
        },
        roomId: updatedReserva.roomId, 
        loans: updatedReserva.loans,
        state: updatedReserva.state,
        people: updatedReserva.people,
      }

        const response = await fetch(`${url}/revs/${updatedReserva.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(datosParaEnviar),
      })
      await fetch(`${url}/revs/state/${updatedReserva.id}/${datosParaEnviar.state}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(datosParaEnviar),
      })
      if (!response.ok) {
      const errorText = await response.text()
      console.error("Error en la respuesta:", errorText)
      throw new Error("Error actualizando reserva: " + errorText)
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        try {
          const updatedData = await response.json()
        } catch (jsonError) {
          console.warn("No se pudo analizar la respuesta como JSON, pero la actualización fue exitosa")
        }
      } else {
        const responseText = await response.text()
      }
      await fetchReservas()
      localStorage.setItem("reservationsUpdated", "true")
      Swal.fire({
        title: "Éxito",
        text: "Reserva actualizada correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
      

      
    } catch (error) {
      console.error("Error FATAL actualizando reserva:", error)
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar la reserva. Por favor, intente de nuevo.",
        icon: "error",
      })
    }
  }

  // Añadir la función handleDeleteReserva después de handleUpdateReserva
  const handleDeleteReserva = async (reservaId: string) => {
    try {
      // Confirmar antes de eliminar
      const confirmResult = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      })

      if (!confirmResult.isConfirmed) {
        return
      }

      const response = await fetch(`${url}/revs/${reservaId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error en la respuesta:", errorText)
        throw new Error("Error eliminando reserva: " + errorText)
      }

      // Actualizar la lista de reservas
      await fetchReservas()

      // Notificar a otros componentes que las reservas han cambiado
      localStorage.setItem("reservationsUpdated", "true")

      Swal.fire({
        title: "Eliminada",
        text: "La reserva ha sido eliminada correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error("Error eliminando reserva:", error)
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar la reserva. Por favor, intente de nuevo.",
        icon: "error",
      })
    }
  }

  // Check if a reservation is within the time window (1.5 hours)
  const isWithinTimeWindow = (date: { day: string; time: string }) => {
    const now = new Date()
    const reservationTime = new Date(`${date.day}T${date.time}`)

    // Calculate time difference in milliseconds
    const timeDiff = reservationTime.getTime() - now.getTime()

    // 1.5 hours = 5400000 milliseconds
    return Math.abs(timeDiff) <= 5400000
  }

  // Filter reservations based on search criteria
  const filteredReservas = reservas.filter((reserva) => {
    const matchesId = searchId ? reserva.userId?.toLowerCase().includes(searchId.toLowerCase()) : true
    const matchesName = searchName ? reserva.userName.toLowerCase().includes(searchName.toLowerCase()) : true
    const matchesRoom = searchRoom ? reserva.roomId.toLowerCase().includes(searchRoom.toLowerCase()) : true
    return matchesId && matchesName && matchesRoom
  })

  return (
    <div className="flex justify-center mt-6">
      {showModal && <ReservaModal onClose={() => setShowModal(false)} onSubmit={handleAddReserva} />}
      <section className="bg-[#EAEAEA] p-4 rounded-2xl shadow-md w-[80vw]">
        <div className="flex justify-between items-center mb-4 ml-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
            <input
              type="text"
              placeholder="Buscar id"
              className="px-3 py-1 rounded-xl bg-white drop-shadow-xl"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Buscar Nombre"
              className="px-3 py-1 rounded-xl bg-white drop-shadow-xl"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <select
              className="px-3 py-1 rounded-xl bg-white drop-shadow-xl"
              value={searchRoom}
              onChange={(e) => setSearchRoom(e.target.value)}
            >
              <option value="">Todas las salas</option>
              {rooms.map((room) => (
                <option key={room.roomId} value={room.roomId}>
                  {room.roomId.split("-").join(" ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button onClick={() => setShowModal(true)} className="bg-white rounded-xl p-2 drop-shadow-xl">
              <Plus className="text-[#990000] w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-center border-separate border-spacing-y-3 border-spacing-x-3 drop-shadow-xl">
            <thead>
              <tr className="text-sm font-semibold drop-shadow-xl">
                <th className="bg-white rounded-xl px-4 py-2">Nombre</th>
                <th className="bg-white rounded-xl px-4 py-2">Identificación</th>
                <th className="bg-white rounded-xl px-4 py-2">Fecha</th>
                <th className="bg-white rounded-xl px-4 py-2">Hora</th>
                <th className="bg-white rounded-xl px-4 py-2">Sala</th>
                <th className="bg-white rounded-xl px-4 py-2">Préstamos</th>
                <th className="bg-white rounded-xl px-4 py-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservas.map((reserva) => (
                <React.Fragment key={reserva.id}>
                  {!hiddenRows[reserva.id!] && (
                    <tr
                      key={reserva.id}
                      className="bg-white rounded-xl hover:bg-[#990000] hover:text-white drop-shadow-xl"
                    >
                      <td className={`px-4 py-2 rounded-xl`}>
                        <div>
                          <div className={`absolute left-0 top-0 h-full w-2 rounded-l-xl ${getRowColor(reserva)}`} />
                          <span>{reserva.userName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 rounded-xl">{reserva.userId}</td>
                      <td className="px-4 py-2 rounded-xl">{reserva.date.day}</td>
                      <td className="px-4 py-2 rounded-xl">
                        <div className="flex items-center justify-center gap-1">
                          {reserva.date.time}
                          {isWithinTimeWindow(reserva.date) && <Clock className="w-4 h-4 text-green-500" />}
                        </div>
                      </td>
                      <td className="px-4 py-2 rounded-xl">
                        <span>{reserva.roomId.split("-").join(" ")}</span>
                      </td>
                      <td className="px-4 py-2 rounded-xl">
                        {reserva.loans.length > 0 ? (
                          <div className="group relative">
                            <span>{reserva.loans.length}</span>
                            <div className="absolute z-10 hidden group-hover:block bg-white text-black p-2 rounded shadow-lg text-xs left-1/2 transform -translate-x-1/2 w-48">
                              <ul className="text-left">
                                {reserva.loans.map((loanId) => (
                                  <li key={loanId}>• {elementNames[loanId] || loanId}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <span>0</span>
                        )}
                      </td>
                      <td className="rounded-xl">
                        <div className="flex gap-2 justify-center gap-4">
                          <Pencil
                            className="cursor-pointer"
                            onClick={() => {
                              setEditingReserva(reserva)
                              setHiddenRows((prev) => ({ ...prev, [reserva.id!]: true }))
                            }}
                          />
                          <Trash
                            className="cursor-pointer"
                            onClick={() => handleDeleteReserva(reserva.id!)}
                          />
                        </div>
                      </td>
                    </tr>
                  )}

                  {editingReserva === reserva && (
                    <ReservaExpandida
                      reserva={reserva}
                      onClose={() => {
                        setEditingReserva(null)
                        setHiddenRows((prev) => ({ ...prev, [reserva.id!]: false }))
                      }}
                      onSave={handleUpdateReserva}
                    />
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default RevsTable
