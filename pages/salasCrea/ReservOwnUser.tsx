"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { aUr } from "@/pages/api/salasCreaU"
import { ArrowLeft } from "lucide-react"

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
        if (!response.ok) {
          throw new Error("Error cargando datos: " + response.statusText)
        }
        const data = await response.json()
        setReservations(data)
        localStorage.setItem("reservationsUpdated", "true")
      } catch (error) {
        console.error("Error cargando reservas:", error)
        setErrorMsg("No se pudo cargar la información de las reservas.")
      }
    }
    fetchReservas()
  }, [])

  const handleClickBack = () => {
    router.back()
  }

  return (
    <div className="p-6 text-black">
      {/* Flecha e ícono */}
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
              {/* Encabezados */}
              <div className="grid grid-cols-4 gap-4 mb-2 px-2">
                {["Sala", "Fecha", "Hora", "Personas"].map((title) => (
                  <div
                    key={title}
                    className="bg-white rounded-[15px] px-4 py-2 font-semibold text-center shadow-md"
                  >
                    {title}
                  </div>
                ))}
              </div>

              {/* Filas */}
              <div className="space-y-3">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="grid grid-cols-4 gap-4 px-2"
                  >
                    <div className="bg-white rounded-[15px] px-4 py-2 text-center shadow-md">
                      {res.roomId.split("-").join(" ")}
                    </div>
                    <div className="bg-white rounded-[15px] px-4 py-2 text-center shadow-md">
                      {res.date.day}
                    </div>
                    <div className="bg-white rounded-[15px] px-4 py-2 text-center shadow-md">
                      {res.date.time}
                    </div>
                    <div className="bg-white rounded-[15px] px-4 py-2 text-center shadow-md">
                      {res.people}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
