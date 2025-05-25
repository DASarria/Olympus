"use client"

import React, { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, Package, ArrowLeft } from "lucide-react"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import { aUr } from "@/pages/api/salasCreaU"

const MAX_AFORO = 30

const rooms = [
  {
    id: "Sala-Crea",
    nombre: "Sala CREA",
    descripcion: "Espacio para actividades creativas"
  },
  {
    id: "Sala-De-Descanso",
    nombre: "Sala de Descanso",
    descripcion: "Espacio para relajación"
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
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [formData, setFormData] = useState({ people: 1, time: "", day: "" })

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null
  const userName = typeof window !== "undefined" ? sessionStorage.getItem("userName") || "Desconocido" : "Desconocido"
  const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") || "000000" : "000000"
  const apiUrl = aUr
  const [ocupados, setOcupados] = useState<{ [roomId: string]: number }>({})

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0] // "YYYY-MM-DD"
  }


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
      console.log("🔍 Respuesta RAW desde API /revs:", raw)

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
      setReservas(data)
      const nuevosOcupados: { [roomId: string]: number } = {}
      const today = getTodayDate()
      data.forEach((r) => {
        if (
          r.state === "RESERVA_CONFIRMADA" &&
          r.date?.day === today
        ) {
          nuevosOcupados[r.roomId] = (nuevosOcupados[r.roomId] || 0) + r.people
        }
      })
      setOcupados(nuevosOcupados)

    } catch (error) {
      console.error("❌ Error al obtener reservas:", error)
    }
  }

  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [apiUrl, token])

  const getPeopleCount = (roomId: string) => {
    const now = new Date()

    const relevantes = reservas.filter((r) => {
      if (r.roomId !== roomId || r.state !== "RESERVA_CONFIRMADA") return false

      const reservaDateTime = new Date(`${r.date.day}T${r.date.time}`)
      return (
        reservaDateTime.toDateString() === now.toDateString() &&
        reservaDateTime.getTime() > now.getTime()
      )
    })

    return relevantes.reduce((sum, r) => sum + (r.people || 0), 0)
  }

  const handleSubmit = async () => {
    const { people, time, day } = formData;
    if (!people || !time || !day || !selectedRoom) {
      return Swal.fire("Error", "Completa todos los campos", "error");
    }

    if (!token) {
      return Swal.fire("Error", "Token no encontrado, inicia sesión", "error");
    }

    // Validar formato de hora
    const [hourStr] = time.split(":");
    const hour = parseInt(hourStr);

    // Obtener fecha y hora actuales
    const now = new Date()

    // Validar que la reserva no sea con más de 1 día de anticipación (máximo hasta mañana)
    const maxDay = new Date()
    maxDay.setDate(now.getDate() + 2)
    maxDay.setHours(23, 59, 59, 999) // final del día siguiente

    const reservaDate = new Date(`${day}T${time}`)

    if (reservaDate > maxDay) {
      return Swal.fire(
        "Fecha inválida",
        "No se pueden hacer reservas con más de 2 día de anticipación",
        "error"
      )
    }

    if (reservaDate < now) {
      return Swal.fire(
        "Fecha inválida",
        "No se pueden hacer reservas en fechas u horas pasadas",
        "error"
      )
    }

    // Validar que la hora de reserva sea máximo 2 horas adelante desde ahora
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    if (reservaDate > twoHoursLater) {
      return Swal.fire(
        "Hora inválida",
        "Solo puedes reservar hasta 2 horas adelante desde la hora actual",
        "error"
      )
    }

    // Validar que no sea sábado (6) ni domingo (0)
    const dayOfWeek = reservaDate.getDay(); // 0: domingo, 6: sábado
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return Swal.fire(
        "Día no permitido",
        "No se permiten reservas en fines de semana (sábado o domingo)",
        "warning"
      );
    }

    // Validar horario permitido: entre 7-10 o 13-16 horas
    const isMorning = hour >= 7 && hour < 10;
    const isAfternoon = hour >= 13 && hour < 16;

    if (!(isMorning || isAfternoon)) {
      return Swal.fire(
        "Horario inválido",
        "Solo se permiten reservas entre 7:00–10:00 y 13:00–16:00",
        "warning"
      );
    }


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
    };

    console.log("📤 Enviando reserva:", JSON.stringify(reserva, null, 2));
    console.log("🔐 Usando token:", token);
    try {
      const res = await fetch(`${apiUrl}/revs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(reserva),
      });
      const text = await res.text();
      if (!res.ok) {
        console.error("⛔ Error al crear reserva. Status:", res.status);
        console.error("⛔ Texto de respuesta:", text);
        Swal.fire("Error", `Error ${res.status}: ${text}`, "error");
        return;
      }

      Swal.fire("Éxito", "Reserva creada correctamente", "success");
      await fetchData();
      setSelectedRoom(null);
      setFormData({ people: 1, time: "", day: "" });
    } catch (e) {
      console.error("❌ Error de red o de aplicación:", e);
      Swal.fire("Error", "No se pudo crear la reserva", "error");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 text-black hover:text-gray-700 transition"
        aria-label="Volver"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Reservar Sala</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {rooms.map((room) => {
          const ocupados = getPeopleCount(room.id)
          return (
            <div
              key={room.id}
              className="border rounded-[24px] p-6 shadow-lg hover:shadow-2xl transition bg-white w-full h-[320px] md:h-[340px] flex flex-col justify-between"
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-bold mb-2">{room.nombre}</h3>
                  <p className="text-sm text-gray-700 mb-3">{room.descripcion}</p>
                  <ul className="text-sm space-y-2">
                    <li className="flex gap-2 items-center">
                      <Package className="w-5 h-5" /> Aforo total: {MAX_AFORO}
                    </li>
                    <li className="flex gap-2 items-center text-amber-600">
                      <AlertCircle className="w-5 h-5" /> Ocupados: {ocupados}
                    </li>
                    <li className="flex gap-2 items-center text-green-600">
                      <CheckCircle className="w-5 h-5" /> Disponibles: {MAX_AFORO - ocupados}
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setSelectedRoom(room.id)}
                  disabled={ocupados >= MAX_AFORO}
                  className={`w-full mt-4 rounded-xl py-2 font-semibold transition ${
                    ocupados >= MAX_AFORO
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-lime-600 hover:bg-lime-800 text-white"
                  }`}
                >
                  Reservar
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {selectedRoom && (
        <div className="mt-8 max-w-lg mx-auto border rounded-xl p-6 bg-white shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Reservar {rooms.find((r) => r.id === selectedRoom)?.nombre}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
            className="flex flex-col gap-4"
          >
            <label>
              Fecha (máximo 2 día de anticipación):
              <input
                type="date"
                value={formData.day}
                min={getTodayDate()}
                max={(() => {
                  const maxDay = new Date()
                  maxDay.setDate(maxDay.getDate() + 1)
                  return maxDay.toISOString().split("T")[0]
                })()}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                required
                className="mt-1 border rounded px-3 py-2 w-full"
              />
            </label>

            <label>
              Hora (7:00–10:00 y 13:00–16:00, máximo 2 horas adelante):
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                min="07:00"
                max="16:00"
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
                className="bg-lime-600 hover:bg-lime-800 text-white rounded-xl py-2 font-semibold w-full transition"
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
      )}
      <br />
      <br />

      <div>
        {reservas.length === 0 && <p className="text-center text-gray-500">.</p>}
        {reservas
          .filter((r) => r.userId === userId)
          .map((r) => (
            <div
              key={r.id}
              className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm flex justify-between items-center"
            >
              <div>
                <p>
                  <b>Sala:</b> {rooms.find((room) => room.id === r.roomId)?.nombre || r.roomId}
                </p>
                <p>
                  <b>Fecha:</b> {r.date.day}
                </p>
                <p>
                  <b>Hora:</b> {r.date.time}
                </p>
                <p>
                  <b>Personas:</b> {r.people}
                </p>
                <p>
                  <b>Estado:</b>{" "}
                  <span
                    className={`font-semibold ${
                      r.state === "RESERVA_CONFIRMADA"
                        ? "text-green-600"
                        : r.state === "RESERVA_TERMINADA"
                        ? "text-gray-500"
                        : "text-red-600"
                    }`}
                  >
                    {r.state}
                  </span>
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ReservUser
