"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { aUr } from "@/pages/api/salasCreaU"
import { ArrowLeft } from "lucide-react"
import { CheckCheck, CircleX, Play } from "lucide-react"
import Swal from "sweetalert2"
import React from "react"

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

const stateColors: Record<string, string> = {
  RESERVA_CONFIRMADA: "bg-yellow-400",
  RESERVA_CANCELADA: "bg-red-700",
  RESERVA_TERMINADA: "bg-green-600",
  RESERVA_CREADA: "bg-blue-500"
}

export default function ReservOwnUser() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [dateFilter, setDateFilter] = useState<string>("")
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null
  const url = aUr
  const router = useRouter()

  const getRowColor = (reserva: Reservation) => {
    switch(reserva.state.toLowerCase()){
      case "reserva_confirmada":
        return stateColors.RESERVA_CONFIRMADA
      case "reserva_cancelada":
        return stateColors.RESERVA_CANCELADA
      case "reserva_terminada":
        return stateColors.RESERVA_TERMINADA
        case "reserva_creada":
        return stateColors.RESERVA_CREADA
    }
  }

  useEffect(() => {
    const fetchReservas = async () => {
      if (!token) {
        return
      }
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
        console.error(error)
      }
    }

    fetchReservas()

    const channel = new BroadcastChannel("reservas_channel")
    channel.onmessage = (event) =>{
      if(event.data === "reservas_actualizadas" || event.data === "estado_reservas_actualizadas"){
        fetchReservas()
      }
    }
    return () => {
    channel.close()
  }
  }, [token, url])

  const handleClickBack = () => router.back()

  

  const updateReservaState = async (
    id: string,
    newState: "RESERVA_CANCELADA" | "RESERVA_TERMINADA" | "RESERVA_CONFIRMADA"
  ) => {
    if (!token) {
      Swal.fire("Error", "No autorizado. Por favor inicia sesión.", "error")
      return
    }

    const confirm = await Swal.fire({
      title: `¿Estás seguro?`,
      text: `Vas a marcar la reserva como ${
        newState === "RESERVA_TERMINADA" ? "terminada" : "cancelada"
      }.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    })

    if (!confirm.isConfirmed) return

    try {
      const response = await fetch(`${url}/revs/state/${id}/${newState}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      })
      

      if (!response.ok) throw new Error("Error actualizando estado")

      Swal.fire("Actualizado", "Estado de la reserva actualizado", "success")
      const channel = new BroadcastChannel("reservas_channel")
      channel.postMessage("estado_reservas_actualizadas")
      channel.close()

      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, state: newState } : r))
      )
    } catch (e) {
      console.error(e)
      Swal.fire("Error", "No se pudo actualizar el estado", "error")
    }
  }


  const filteredReservas = reservations.filter((reserva) => {
    const matchesDate = dateFilter === "" || reserva.date.day === dateFilter
    return matchesDate
  })

  return (
    <div >
      <div className="flex gap-5 font-bold text-[30px] ml-6">
        <ArrowLeft onClick={handleClickBack} className="cursor-pointer mt-3" />
        <h1>Reservas</h1>
      </div>
      <section className="bg-[#EAEAEA] p-4 rounded-2xl shadow-md w-[70vw] ml-[10vw] mt-[5vh]">
        <div className="flex justify-between items-center mb-4 sm:ml-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-[1vw] text-sm">
            <div className="relative w-full md:w-64">
            <input
              type="date"
              className="w-[55vw] sm:w-[15vw] px-4 py-2 rounded-xl bg-white drop-shadow-xl pl-3 text-center sm:h-[5vh]"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            </div>
          </div>
        </div>

        <div className="max-h-[40vh] overflow-y-auto  ">
          <table className="w-full text-center border-separate border-spacing-y-3 border-spacing-x-3 drop-shadow-xl">
            <thead>
              <tr className="text-sm font-semibold drop-shadow-xl">
                <th className="bg-white rounded-xl px-4 py-2 h-[1vh]">Nombre</th>
                <th className="bg-white rounded-xl px-4 py-2 h-[1vh]">Identificación</th>
                <th className="bg-white rounded-xl px-4 py-2 h-[1vh]">Fecha</th>
                <th className="bg-white rounded-xl px-4 py-2 h-[1vh]">Hora</th>
                <th className="bg-white rounded-xl px-4 py-2 h-[1vh]">Sala</th>
                <th className="bg-white rounded-xl px-4 py-2 h-[1vh]">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservas.map((reserva) => (
                <React.Fragment key={reserva.id}>
                    <tr
                      key={reserva.id}
                      className="bg-white rounded-xl hover:bg-[#990000] hover:text-white drop-shadow-xl text-sm"
                    >
                      <td className={`px-4 py-2 rounded-xl `}>
                        <div>
                          <div className={`absolute left-0 top-0 h-full w-2 rounded-l-xl ${getRowColor(reserva)}`} />
                          <span>{reserva.userName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 rounded-xl">{reserva.userId}</td>
                      <td className="px-4 py-2 rounded-xl">{reserva.date.day}</td>
                      <td className="px-4 py-2 rounded-xl">{reserva.date.time}</td>
                      <td className="px-4 py-2 rounded-xl">
                        <span>{reserva.roomId.split("-").join(" ")}</span>
                      </td>

                      <td className="rounded-xl">
                        <div className="flex gap-2 justify-center gap-4">
                          <CheckCheck
                            className="cursor-pointer text-green-600"
                            onClick={() => updateReservaState(reserva.id!, "RESERVA_TERMINADA")}
                          /> 
                          <CircleX
                            className="cursor-pointer text-red-700"
                            onClick={() => updateReservaState(reserva.id!, "RESERVA_CANCELADA")}
                          />
                          <Play
                            className="cursor-pointer text-yellow-400"
                            onClick={() => updateReservaState(reserva.id!, "RESERVA_CONFIRMADA")}
                          />
                        </div>
                      </td>
                    </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
