'use client';

import { Room } from "@/models/Room";

export default function RoomReservationCard({ room }: { room: Room }) {
  return (
    <div className="flex items-start gap-10 bg-white rounded-lg p-6 shadow-md max-w-5xl mx-auto mt-6">
      <div className="flex flex-col items-center text-center max-w-sm">
        <img src={room.image} alt={room.building} className="w-48 h-48 rounded-full object-cover mb-4" />
        <p className="text-sm font-semibold">{room.description}</p>
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">{room.building}</h2>
        <div className="grid grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Nombre Apellido" />
          <input className="border p-2 rounded" placeholder="Identificación" />
          <input className="border p-2 rounded" placeholder="mm/dd/yyyy" />
          <input className="border p-2 rounded" placeholder="hh:mm" />
        </div>
        <div className="mt-4">
          <p className="font-bold mb-2">Elementos recreativos</p>
          <button className="w-10 h-10 rounded-full bg-red-100 text-2xl flex items-center justify-center text-red-700">
            +
          </button>
        </div>
        <div className="flex gap-4 mt-6">
          <span className="bg-red-700 text-white px-3 py-1 rounded font-bold text-sm">
            Cupos {room.capacity}
          </span>
          <button className="bg-red-700 text-white px-4 py-1 rounded font-semibold">
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
}