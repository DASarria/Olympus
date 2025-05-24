"use client";

import { useEffect, useState } from "react";

interface Reservation {
  id: number;
  roomName: string;
  date: string;
  hour: string;
  responsible: string;
  amountPeople: number;
}

export default function ReservOwnUser() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const url =
          "https://cvds-mod-2-cmbsgrgva2edc7b8.brazilsouth-01.azurewebsites.net/reservations";

        console.log("Haciendo fetch a:", url);

        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          // Si necesitas enviar token de autorización, descomenta y agrega tu token aquí:
          /*
          headers: {
            "Authorization": "Bearer TU_TOKEN_AQUI",
            "Content-Type": "application/json",
          },
          */
        });

        console.log("Código de estado:", response.status);

        if (!response.ok) {
          const text = await response.text();
          console.error("Respuesta del servidor:", text);
          throw new Error(`Error al obtener reservas: ${response.status}`);
        }

        const data: Reservation[] = await response.json();
        console.log("Reservas completas recibidas:", data);

        setReservations(data);
        setErrorMsg(null);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error capturado:", error.message);
          setErrorMsg(error.message);
        } else {
          console.error("Error desconocido:", error);
          setErrorMsg("Error desconocido");
        }
      }
    };

    fetchReservations();
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
              <p><strong>Sala:</strong> {res.roomName}</p>
              <p><strong>Fecha:</strong> {res.date}</p>
              <p><strong>Hora:</strong> {res.hour}</p>
              <p><strong>Responsable:</strong> {res.responsible}</p>
              <p><strong>Personas:</strong> {res.amountPeople}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
