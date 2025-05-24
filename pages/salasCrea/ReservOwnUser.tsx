"use client";

import { useEffect, useState } from "react";
import { aUr } from "@/pages/api/salasCreaU"


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
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const token = sessionStorage.getItem("token")
  const url = aUr

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
    }
  }
  fetchReservas();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todas las Reservas</h1>
      {errorMsg ? (
        <p className="text-red-600">Error: {errorMsg}</p>
      ) : reservations.length === 0 ? (
        <p>No hay reservas registradas.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((res) => (
            <li
              key={res.id}
              className="border p-4 rounded-lg shadow-md bg-white"
            >
              <p><strong>Sala:</strong> {res.roomId}</p>
              <p><strong>Fecha:</strong> {res.date.day}</p>
              <p><strong>Hora:</strong> {res.date.time}</p>
              <p><strong>Personas:</strong> {res.people}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}