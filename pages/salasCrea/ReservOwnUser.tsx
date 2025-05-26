"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { aUr } from "@/pages/api/salasCreaU"
import { ArrowLeft } from "lucide-react"
import Swal from "sweetalert2"

interface Reservation {
  id?: string
  userName: string
  userId: string
  role: null
  date: {
    day: string
    time: string
  }
  roomId: string
  state: string
  people: number
}

export default function ReservOwnUser() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const token = sessionStorage.getItem("token")
  const url = aUr
  const router = useRouter()

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch(`${url}/revs/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          cache: "no-store",
        })
        if (!response.ok) throw new Error("Error cargando datos")
        const data = await response.json()
        setReservations(data)
        localStorage.setItem("reservationsUpdated", "true")
      } catch (error) {
        setErrorMsg("No se pudo cargar la información de las reservas.")
        console.error(error)
      }
    }

    fetchReservas()
  }, [])

  const handleClickBack = () => router.back()

  const formatEstado = (estado: string, date: { day: string; time: string }) => {
  const startDate = new Date(`${date.day}T${date.time}`)
  const now = new Date()

  if (estado === "RESERVA_CREADA") {
    return now < startDate ? "Reserva creada" : "Reserva confirmada"
  }

  if (estado === "RESERVA_CONFIRMADA") {
    return now >= startDate ? "Reserva terminada" : "Reserva confirmada"
  }
  switch (estado) {
    case "RESERVA_TERMINADA":
      return "Reserva terminada"
    case "RESERVA_CANCELADA":
      return "Reserva cancelada"
    default:
      return estado
  }
}


  const isEditableReserva = (res: Reservation) => {
    const start = new Date(`${res.date.day}T${res.date.time}`)
    const before = new Date(start.getTime() - 2 * 60 * 60000)
    const after = new Date(start.getTime() + 90 * 60000)
    const now = new Date()

    // Permitir editar si:
    // - Está dentro de la ventana editable (como antes)
    // - O si está en estado CREADA (permitir cancelar o terminar antes de que empiece)
    return (
      (res.state === "RESERVA_CONFIRMADA" && now >= before && now <= after) ||
      res.state === "RESERVA_CREADA"
    )
  }

  const updateReservaState = async (id: string, newState: "RESERVA_CANCELADA" | "RESERVA_TERMINADA") => {
    const confirm = await Swal.fire({
      title: `¿Estás seguro?`,
      text: `Vas a marcar la reserva como ${formatEstado(newState, { day: "", time: "" })}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    })

    if (!confirm.isConfirmed) return

    try {
      const response = await fetch(`${url}/revs/${id}/state`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ newState }),
      })
      if (!response.ok) throw new Error("Error actualizando estado")

      Swal.fire("Actualizado", "Estado de la reserva actualizado", "success")
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, state: newState } : r))
      )
    } catch (e) {
      console.error(e)
      Swal.fire("Error", "No se pudo actualizar el estado", "error")
    }
  }

  return (
    <div className="p-6 text-black">
      <div className="flex justify-center items-center gap-4 font-bold text-[30px] mb-6">
        <ArrowLeft onClick={handleClickBack} className="cursor-pointer mt-1" />
        <h1>Mis Reservas</h1>
      </div>

      <div className="flex justify-center">
        <section className="bg-[#EAEAEA] p-6 rounded-2xl shadow-md w-full max-w-5xl">
          {errorMsg ? (
            <p className="text-center text-red-600 font-semibold">{errorMsg}</p>
          ) : reservations.length === 0 ? (
            <p className="text-center text-gray-700">No tienes reservas registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-5 gap-4 mb-2 px-2">
                {["Sala", "Fecha", "Hora", "Personas", "Estado"].map((title) => (
                  <div
                    key={title}
                    className="bg-white rounded-[15px] px-4 py-2 font-semibold text-center shadow-md"
                  >
                    {title}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {reservations.map((res) => {
                  const { id, roomId, date, people, state } = res
                  const canEdit = isEditableReserva(res)

                  return (
                    <div key={id} className="grid grid-cols-5 gap-4 px-2 items-center">
                      <div className="bg-white rounded-[15px] px-4 py-2 text-center shadow-md">
                        {roomId.split("-").join(" ")}
                      </div>
                      <div className="bg-white rounded-[15px] px-4 py-2 text-center shadow-md">
                        {date.day}
                      </div>
                      <div className="bg-white rounded-[15px] px-4 py-2 text-center shadow-md">
                        {date.time}
                      </div>
                      <div className="bg-white rounded-[15px] px-4 py-2 text-center shadow-md">
                        {people}
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="bg-white rounded-[15px] px-4 py-2 text-center shadow-md">
                          {formatEstado(state, date)}
                        </div>

                        {canEdit && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateReservaState(id!, "RESERVA_TERMINADA")}
                              className="text-xs px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                            >
                              Terminar
                            </button>
                            <button
                              onClick={() => updateReservaState(id!, "RESERVA_CANCELADA")}
                              className="text-xs px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
