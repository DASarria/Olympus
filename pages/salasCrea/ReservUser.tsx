"use client"

import React, { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, Package, ArrowLeft } from "lucide-react"
import salaJuaegos from "../../assets/images/salaJuegos.jpg"
import salaDescanso from "../../assets/images/salaDescanso.jpg"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import { aUr } from "@/pages/api/salasCreaU"

const MAX_AFORO = 30

const rooms = [
  {
    id: "Sala-Crea",
    nombre: "Sala CREA",
    descripcion: "Espacio para actividades creativas y la mejor diversión con tus amigos",
    image: salaJuaegos
  },
  {
    id: "Sala-De-Descanso",
    nombre: "Sala de Descanso",
    descripcion: "Espacio para relajación y tomar un descanso del mundo",
    image: salaDescanso
  }
]

interface Reserva {
  id?: string
  userName: string
  userId: string
  date: { day: string; time: string }
  roomId: string
  people: number
  state: string
}

const ReservUser = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [formData, setFormData] = useState({ people: 1, time: "", day: "" })
  const [ocupados, setOcupados] = useState<{ [roomId: string]: number }>({})

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null
  const userName = typeof window !== "undefined" ? sessionStorage.getItem("userName") || "Desconocido" : "Desconocido"
  const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") || "000000" : "000000"
  const apiUrl = aUr
  const router = useRouter()


  const fetchData = async () => {
  if (!token || !apiUrl) {
    console.error("❌ Falta token o API URL")
    return
  }

  try {
    const res = await fetch(`${apiUrl}/revs`, {
      headers: { Authorization: `${token}` }
    })

    const raw = await res.text()
    if (!res.ok) {
      console.error("❌ Error de respuesta:", res.status)
      return
    }

    let data: Reserva[] = []
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        data = parsed as Reserva[]
      } else if (Array.isArray(parsed.reservas)) {
        data = parsed.reservas as Reserva[]
      } else {
        console.warn("⚠️ No se encontró estructura esperada en la respuesta")
      }
    } catch (e) {
      console.error("❌ Error al parsear JSON:", e)
    }

    const hoy = new Date().toISOString().split("T")[0] // Formato YYYY-MM-DD
    const nuevosOcupados: { [roomId: string]: number } = {}

    data.forEach((r) => {
      const mismaFecha = r.date.day === hoy
      const estadoActivo = r.state === "RESERVA_CREADA" || r.state === "RESERVA_CONFIRMADA"

      if (mismaFecha && estadoActivo) {

        const mismaFecha = r.date.day === hoy
const estadoActivo = r.state === "RESERVA_CREADA" || r.state === "RESERVA_CONFIRMADA"

if (mismaFecha && estadoActivo) {
  nuevosOcupados[r.roomId] = (nuevosOcupados[r.roomId] || 0) + r.people
}

      }
    })

    setOcupados(nuevosOcupados)
  } catch (error) {
    console.error("❌ Error al obtener reservas:", error)
  }
}


  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async () => {
    const { people, time, day } = formData
    if (!people || !time || !day || !selectedRoom) {
      return Swal.fire("Error", "Completa todos los campos", "error")
    }

    if (!token) {
      return Swal.fire("Error", "Token no encontrado, inicia sesión", "error")
    }

    const [hourStr] = time.split(":")
    const hour = parseInt(hourStr)
    const now = new Date()
    const maxDay = new Date()
    maxDay.setDate(now.getDate() + 2)
    maxDay.setHours(23, 59, 59, 999)
    const reservaDate = new Date(`${day}T${time}`)
    const dayOfWeek = reservaDate.getDay()
    // if (dayOfWeek === 0 || dayOfWeek === 6) {
    //   return Swal.fire("Día no permitido", "No se permiten reservas en fines de semana", "warning")
    // }
    // if (reservaDate < now) {
    //   return Swal.fire("Fecha inválida", "No se pueden hacer reservas en fechas u horas pasadas", "error")
    // }
    // if (reservaDate > maxDay) {
    //   return Swal.fire("Fecha inválida", "No se pueden hacer reservas en días futuros", "error")
    // }
    // const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    // if (reservaDate > twoHoursLater) {
    //   return Swal.fire("Hora inválida", "Solo puedes reservar hasta 2 horas adelante desde la hora actual", "error")
    // }

    // const isMorning = hour >= 7 && hour < 10
    // const isAfternoon = hour >= 13 && hour < 16
    // if (!(isMorning || isAfternoon)) {
    //   return Swal.fire("Horario inválido", "Solo se permiten reservas entre 7:00–10:00 y 13:00–16:00", "warning")
    // }

    const reserva: Reserva = {
      userName,
      userId,
      roomId: selectedRoom,
      date: {
        day,
        time: time.includes(":00") ? time : `${time}:00`,
      },
      people,
      state: "RESERVA_CREADA",
    }

    try {
      const res = await fetch(`${apiUrl}/revs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(reserva),
      })

      const text = await res.text()
      if (!res.ok) {
        console.error("⛔ Error al crear reserva. Status:", res.status)
        console.error("⛔ Texto de respuesta:", text)
        Swal.fire("Error", `Error ${res.status}: ${text}`, "error")
        return
      }

      Swal.fire("Éxito", "Reserva creada correctamente", "success")
      await fetchData()

      const channel = new BroadcastChannel("reservas_channel")
      channel.postMessage("reservas_actualizadas")
      channel.close()

      setSelectedRoom(null)
      setFormData({ people: 1, time: "", day: "" })
    } catch (e) {
      console.error("❌ Error de red o de aplicación:", e)
      Swal.fire("Error", "No se pudo crear la reserva", "error")
    }
  }

  return (
  <div className="p-6 max-w-6xl mx-auto relative">
    <button
      onClick={() => router.back()}
      className="absolute top-4 left-4 text-black hover:text-gray-700 transition"
    >
      <ArrowLeft className="w-6 h-6" />
    </button>

    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Reservar Sala</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {rooms.map((room) => {
        const ocupadosSala = ocupados[room.id] || 0;
        return (
          <div
            key={room.id}
            className="rounded-[24px] p-0 shadow-lg hover:shadow-2xl transition bg-white w-full h-[400px] md:h-[420px] flex flex-col overflow-hidden"
          >
            <img
              src={typeof room.image === "string" ? room.image : room.image.src}
              alt={room.nombre}
              className="h-40 w-full object-cover rounded-t-[24px]"
            />
            <div className="flex flex-col justify-between flex-1 p-4">
              <div>
                <h3 className="text-lg font-bold mb-2">{room.nombre}</h3>
                <p className="text-sm text-gray-700 mb-3">{room.descripcion}</p>
                <ul className="text-sm space-y-2">
                  <li className="flex gap-2 items-center">
                    <Package className="w-5 h-5" /> Aforo total: {MAX_AFORO}
                  </li>
                  <li className="flex gap-2 items-center text-amber-600">
                    <AlertCircle className="w-5 h-5" /> Ocupados: {ocupadosSala}
                  </li>
                  <li className="flex gap-2 items-center text-green-600">
                    <CheckCircle className="w-5 h-5" /> Disponibles: {MAX_AFORO - ocupadosSala}
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedRoom(room.id)}
                disabled={ocupadosSala >= MAX_AFORO}
                className={`w-full mt-4 rounded-xl py-2 font-semibold transition ${
                  ocupadosSala >= MAX_AFORO
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-800 text-white"
                }`}
              >
                Reservar
              </button>
            </div>
          </div>
        );
      })}
    </div>

    {selectedRoom && (
      // Fondo difuminado y formulario modal centrado
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-lg relative">
          <button
            onClick={() => setSelectedRoom(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition text-xl font-bold"
            aria-label="Cerrar formulario"
          >
            &times;
          </button>

          <h3 className="text-xl font-semibold mb-4">
            Reservar {rooms.find((r) => r.id === selectedRoom)?.nombre}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <label>
              Fecha:
              <input
                type="date"
                value={formData.day}

                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                required
                className="mt-1 border rounded px-3 py-2 w-full"
              />
            </label>

            <label>
              Hora:
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="mt-1 border rounded px-3 py-2 w-full"
              />
            </label>

            <label>
              Número de personas:
              <input
                type="number"
                min={1}
                max={MAX_AFORO - (ocupados[selectedRoom] || 0)}
                value={formData.people}
                onChange={(e) => setFormData({ ...formData, people: Number(e.target.value) })}
                required
                className="mt-1 border rounded px-3 py-2 w-full"
              />
            </label>

            <div className="flex justify-between gap-4 mt-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-800 text-white rounded-xl py-2 font-semibold w-full transition"
              >
                Confirmar reserva
              </button>

              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
                className="bg-gray-300 hover:bg-gray-400 rounded-xl py-2 font-semibold w-full transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    <br />
    <br />
    <br />
  </div>
);


}

export default ReservUser
