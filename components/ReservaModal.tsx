"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

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
  state: string
  people: number
}

interface ReservaModalProps {
  onClose: () => void
  onSubmit: (reserva: Reserva) => void
}

const ReservaModal: React.FC<ReservaModalProps> = ({ onClose, onSubmit }) => {
  const [userName] = useState("")
  const [userId] = useState("")
  const [day, setDay] = useState("")
  const [time, setTime] = useState("")
  const [people, setPeople] = useState(1)
  const [selectedRoom, setSelectedRoom] = useState("Sala-Crea")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Se eliminó la inicialización de fecha y hora predeterminadas

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    // Asegurarse de que el formato de la hora sea correcto (HH:MM:00)
    const formattedTime = time.includes(":00") ? time : `${time}:00`

    // Crear una estructura en el formato exacto requerido
    const newReserva: Reserva = {
      userName,
      userId,
      role: null,
      date: {
        day,
        time: formattedTime,
      },
      roomId: selectedRoom,
      state: "RESERVA_CONFIRMADA",
      people,
    }
    try {
      onSubmit(newReserva)
    } catch (error) {
      console.error("Error al crear reserva:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-black"
          disabled={isSubmitting}
        >
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4">Nueva Reserva</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            

            <div>
              <label className="block text-sm font-medium mb-1">Personas</label>
              <input
                type="number"
                min="1"
                value={people}
                onChange={(e) => setPeople(Number.parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Sala</label>
            <div className="flex gap-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="roomType"
                  value="Sala-Crea"
                  checked={selectedRoom === "Sala-Crea"}
                  onChange={() => setSelectedRoom("Sala-Crea")}
                  className="mr-2"
                  disabled={isSubmitting}
                />
                <span>Sala Crea</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="roomType"
                  value="Sala-De-Descanso"
                  checked={selectedRoom === "Sala-De-Descanso"}
                  onChange={() => setSelectedRoom("Sala-De-Descanso")}
                  className="mr-2"
                  disabled={isSubmitting}
                />
                <span>Sala De Descanso</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#990000] text-white rounded-md hover:bg-red-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReservaModal
