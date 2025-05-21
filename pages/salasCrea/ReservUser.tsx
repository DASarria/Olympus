"use client"

import React, { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, Package } from "lucide-react"
import Swal from "sweetalert2"

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const fetchData = async () => {
        if (!token || !apiUrl) {
            console.error("❌ Falta token o API URL")
            return
        }

        try {
            const res = await fetch(`${apiUrl}/revs`, {
            headers: { Authorization: `Bearer ${token}` }
            })

            const raw = await res.text()
            console.log("🔍 Respuesta RAW desde API /revs:", raw)

            if (!res.ok) {
            console.error("❌ Error de respuesta:", res.status)
            return
            }

            let data: any[] = []
            try {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) {
                data = parsed
            } else if (Array.isArray(parsed.reservas)) {
                data = parsed.reservas
            } else {
                console.warn("⚠️ No se encontró estructura esperada en la respuesta")
            }
            } catch (e) {
            console.error("❌ Error al parsear JSON:", e)
            }

            console.log("📦 Reservas obtenidas:", data)
            setReservas(data)
        } catch (error) {
            console.error("❌ Error al obtener reservas:", error)
        }
        }

        fetchData()
    }, [apiUrl, token])

    const getPeopleCount = (roomId: string) => {
        const relevantes = reservas.filter((r) => r.roomId === roomId && r.state === "RESERVA_CONFIRMADA")
        return relevantes.reduce((sum, r) => sum + (r.people || 0), 0)
    }

    const handleSubmit = async () => {
        const { people, time, day } = formData
        if (!people || !time || !day || !selectedRoom) {
        return Swal.fire("Error", "Completa todos los campos", "error")
        }

        if (!token) {
        return Swal.fire("Error", "Token no encontrado, inicia sesión", "error")
        }

        const reserva: Reserva = {
        userName,
        userId,
        roomId: selectedRoom,
        date: {
            day,
            time: time.includes(":00") ? time : `${time}:00`
        },
        people,
        state: "RESERVA_CONFIRMADA"
        }

        console.log("📤 Enviando reserva:", JSON.stringify(reserva, null, 2))
        console.log("🔐 Usando token:", token)

        try {
        const res = await fetch(`${apiUrl}/revs`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(reserva)
        })

        const text = await res.text()

        if (!res.ok) {
            console.error("⛔ Error al crear reserva. Status:", res.status)
            console.error("⛔ Texto de respuesta:", text)
            Swal.fire("Error", `Error ${res.status}: ${text}`, "error")
            return
        }

        Swal.fire("Éxito", "Reserva creada correctamente", "success")
        setSelectedRoom(null)
        setFormData({ people: 1, time: "", day: "" })
        } catch (e) {
        console.error("❌ Error de red o de aplicación:", e)
        Swal.fire("Error", "No se pudo crear la reserva", "error")
        }
    }

    return (
        <div className="p-4 max-w-screen-md mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Reservar Sala</h2>

        <div className="grid md:grid-cols-2 gap-4">
            {rooms.map((room) => {
            const ocupados = getPeopleCount(room.id)
            return (
                <div
                key={room.id}
                className="border rounded-[12px] p-3 shadow hover:shadow-md transition bg-white"
                >
                <h3 className="text-lg font-semibold mb-1">{room.nombre}</h3>
                <p className="text-xs text-gray-600 mb-2">{room.descripcion}</p>
                <ul className="text-xs space-y-1 mb-3">
                    <li className="flex gap-2 items-center">
                    <Package className="w-4 h-4" /> Aforo total: {MAX_AFORO}
                    </li>
                    <li className="flex gap-2 items-center text-amber-600">
                    <AlertCircle className="w-4 h-4" /> Ocupados: {ocupados}
                    </li>
                    <li className="flex gap-2 items-center text-green-600">
                    <CheckCircle className="w-4 h-4" /> Disponibles:{" "}
                    {Math.max(0, MAX_AFORO - ocupados)}
                    </li>
                </ul>
                <button
                    onClick={() => setSelectedRoom(room.id)}
                    className="w-full bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700 text-sm transition"
                >
                    Crear Reserva
                </button>
                </div>
            )
            })}
        </div>

        {selectedRoom && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-xl w-[90%] md:w-[380px] shadow-md relative">
                <button
                onClick={() => setSelectedRoom(null)}
                className="absolute top-2 right-3 text-lg"
                >
                ×
                </button>
                <h3 className="text-lg font-semibold mb-3 text-center">Crear Reserva</h3>

                <label className="block text-xs mb-1">Fecha (AAAA-MM-DD)</label>
                <input
                type="date"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="border w-full rounded p-2 mb-3 text-sm"
                />

                <label className="block text-xs mb-1">Hora (HH:MM)</label>
                <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="border w-full rounded p-2 mb-3 text-sm"
                />

                <label className="block text-xs mb-1">Cantidad de personas</label>
                <input
                type="number"
                min={1}
                max={MAX_AFORO}
                value={formData.people}
                onChange={(e) =>
                    setFormData({
                    ...formData,
                    people: parseInt(e.target.value) || 1
                    })
                }
                className="border w-full rounded p-2 mb-4 text-sm"
                />

                <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition text-sm"
                >
                Confirmar Reserva
                </button>
            </div>
            </div>
        )}
        </div>
    )
}

export default ReservUser