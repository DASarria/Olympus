// import { getRoomById } from "@/services/roomService";
// import RoomReservationCard from "@/components/RoomReservationCard";
// import { Room } from "@/models/Room";

// export default async function RoomReservationPage({ params }: { params: { roomId: string } }) {
//     const response = await getRoomById(params.roomId);
//     const room: Room | null = response.data;
//     if (!room) return <div className="p-6">Sala no encontrada</div>;

//     return <RoomReservationCard room={room} />;
// }

import { useState, useEffect } from "react";
import RoomReservationCard from "@/components/RoomReservationCard";
import { Room } from "@/models/Room";
import { useRouter } from "next/router";

export default function RoomDetailPage() {
  const router = useRouter();
  const { roomId } = router.query;
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (typeof roomId !== "string") return;
    const mockRoomData = {
      roomId: roomId,
      building: "Building Test",
      description: "For testing.",
      image: "",
      capacity: 20,
    };

    setRoom(mockRoomData);
  }, [roomId]);

  if (!room) return <div className="p-6">Sala no encontrada</div>;

  return (
    <div className="room-detail-page">
      <RoomReservationCard room={room} />
    </div>
  );
}