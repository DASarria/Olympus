"use client"
import React, { useEffect, useState } from "react"

const url = process.env.NEXT_PUBLIC_API_URL || ""

export default function ReservOwnUser() {
  const [reservas, setReservas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null
  const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") : null

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
  }, [token, userId])

  const fetchReservas = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Token usado en fetch:", token)
      const response = await fetch(`${url}/revs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Datos recibidos de reservas:", data)

      if (!Array.isArray(data)) {
        throw new Error("El formato de datos recibido no es un arreglo")
      }

      // Filtrar reservas por userId (ajusta "userId" según el nombre real del campo)
      const reservasFiltradas = data.filter((reserva: any) => {
        return reserva.userId === userId
      })

      console.log("Reservas filtradas por userId:", reservasFiltradas)
      setReservas(reservasFiltradas)
      localStorage.setItem("reservationsUpdated", "true")
    } catch (error: any) {
      console.error("Error cargando reservas:", error)
      setError(error.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

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
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th>Teléfono</th>
          <th>Correo</th>
          <th>Sala</th>
          <th>Fecha</th>
          <th>Hora inicio</th>
          <th>Hora fin</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {reservas.map((reserva) => (
          <tr key={reserva.id}>
            <td>{reserva.id}</td>
            <td>{reserva.nombre}</td>
            <td>{reserva.telefono}</td>
            <td>{reserva.correo}</td>
            <td>{reserva.sala}</td>
            <td>{reserva.fecha}</td>
            <td>{reserva.hora_inicio}</td>
            <td>{reserva.hora_fin}</td>
            <td>{reserva.estado}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
