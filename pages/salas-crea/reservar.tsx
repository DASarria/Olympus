'use client';

import { useEffect, useState } from 'react';
import { getAll } from '@/services/roomService';
import RoomCard from '@/components/RoomCard';
import { Room } from '@/models/Room';

export default function ReservationPage() {
    const [rooms, setRooms] = useState<Room[]>([]);

      useEffect(() => {
        getAll().then(res => setRooms(res.data));
      }, []);

    // const rooms:Room[] = [
    //     {
    //         roomId: "1",
    //         building: "Sala CREA",
    //         description: "¡Descubre tu nuevo lugar favorito! Juegos, arte y creatividad.",
    //         capacity: 25,
    //         image:
    //             "",
    //     },
    //     {
    //         roomId: "2",
    //         building: "Sala de Descanso",
    //         description: "Un espacio para relajarte y desconectarte del estrés.",
    //         capacity: 30,
    //         image:
    //             "",
    //     },
    // ];

    return (
        <div className="flex flex-wrap gap-6 p-6">
            {rooms.map((room: Room) => (
                <RoomCard
                    key={room.roomId}
                    name={room.building}
                    description={room.description}
                    image={room.image}
                    capacity={room.capacity}
                    link={`/reservas/${room.roomId}`}
                />
            ))}
        </div>
    );
}