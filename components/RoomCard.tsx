'use client';

import Image from 'next/image';
import { useRouter } from 'next/router';

export default function RoomCard({ name, description, image, capacity, link }: {
  name: string;
  description: string;
  image: string;
  capacity: number;
  link: string;
}) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow p-4 w-80 flex flex-col items-center text-center space-y-3">
      <h2 className="font-bold text-lg">{name}</h2>
      <div className="w-24 h-24 relative">
        <Image src={image} alt={name} fill className="rounded-full object-cover" />
      </div>
      <p className="text-sm text-gray-700">{description}</p>
      <div className="flex space-x-2">
        <span className="bg-red-700 text-white text-xs px-3 py-1 rounded-full">
          Capacidad {capacity}
        </span>
        <button
          className="bg-red-700 text-white text-xs px-3 py-1 rounded-full"
          onClick={() => router.push(link)}
        >
          Reservar
        </button>
      </div>
    </div>
  );
}