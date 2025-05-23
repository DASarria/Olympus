"use client"

import React, { useEffect, useState, useCallback } from "react"

const url = process.env.NEXT_PUBLIC_API_URL || ""

// Interfaz para reservas
interface Reserva {
  id: string
  nombre: string
  telefono: string
  correo: string
  sala: string
  fecha: string
  hora_inicio: string
  hora_fin: string
  estado: string
  userId: string
}

export default function ReservOwnUser() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null
  const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") : null

  const fetchReservas = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${url}/revs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`)
      }

      const data: Reserva[] = await response.json()

      if (!Array.isArray(data)) {
        throw new Error("El formato de datos recibido no es un arreglo")
      }

      const reservasFiltradas = data.filter((reserva) => reserva.userId === userId)

      setReservas(reservasFiltradas)
      localStorage.setItem("reservationsUpdated", "true")
    } catch (error: unknown) {
      const err = error as Error
      setError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [token, userId])

  useEffect(() => {
    if (!token) {
      setError("Token no disponible. Por favor inicia sesión.")
      setLoading(false)
      return
    }
    if (!userId) {
      setError("ID de usuario no disponible.")
      setLoading(false)
      return
    }

    fetchReservas()
  }, [token, userId, fetchReservas])

  if (loading) {
    return <div>Cargando reservas...</div>
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>
  }

  if (!reservas.length) {
    return <div>No hay reservas para mostrar.</div>
  }

  return (
    <table className="w-full text-sm border border-gray-300 mt-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Id</th>
          <th className="p-2 border">Nombre</th>
          <th className="p-2 border">Teléfono</th>
          <th className="p-2 border">Correo</th>
          <th className="p-2 border">Sala</th>
          <th className="p-2 border">Fecha</th>
          <th className="p-2 border">Hora inicio</th>
          <th className="p-2 border">Hora fin</th>
          <th className="p-2 border">Estado</th>
        </tr>
      </thead>
      <tbody>
        {reservas.map((reserva) => (
          <tr key={reserva.id} className="text-center">
            <td className="p-2 border">{reserva.id}</td>
            <td className="p-2 border">{reserva.nombre}</td>
            <td className="p-2 border">{reserva.telefono}</td>
            <td className="p-2 border">{reserva.correo}</td>
            <td className="p-2 border">{reserva.sala}</td>
            <td className="p-2 border">{reserva.fecha}</td>
            <td className="p-2 border">{reserva.hora_inicio}</td>
            <td className="p-2 border">{reserva.hora_fin}</td>
            <td className="p-2 border">{reserva.estado}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}