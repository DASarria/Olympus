'use client';

import Image from 'next/image';
import myimage from "../assets/images/logosolo2.jpg";

import { useRouter } from "next/router";

export default function SalasCreaMain(){

    const router = useRouter();
    
    return (
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="w-full text-center bg-red-700 text-white rounded px-6 py-3 text-xl font-bold">
              Salas Crea
            </div>
          </div>
    
          <p className="text-gray-700 mb-8">Favor seleccionar una opcion:</p>
    
          <div className="flex gap-8">
            <div
              onClick={() => router.push('/salas-crea/reservar')}
              className="cursor-pointer bg-white shadow-md rounded-lg p-4 w-40 text-center hover:shadow-lg transition"
            >
              <Image src={myimage} alt="Reservar" className="w-16 h-16 mx-auto" />
              <p className="mt-2 font-medium">Reservar</p>
            </div>
    
            <div
              onClick={() => router.push('/salas-crea/mis-reservas')}
              className="cursor-pointer bg-white shadow-md rounded-lg p-4 w-40 text-center hover:shadow-lg transition"
            >
              <Image src={myimage} alt="Mis Reservas" className="w-16 h-16 mx-auto" />
              <p className="mt-2 font-medium">Mis Reservas</p>
            </div>
          </div>
        </div>
      );

}