"use client"
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Image from "next/image";

interface Reserva {
  horas: {
    inicio: string;
    fin: string;
  };
  productos: {
    id: string;
    name: string;
    imageSrc: string;
  }[];
  fecha: string;
}

export default function MisReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    const reservasGuardadas = localStorage.getItem('reservas');
    if (reservasGuardadas) {
      setReservas(JSON.parse(reservasGuardadas));
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-grow">
        <Layout>
          <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Mis Reservas</h1>
            
            {reservas.length > 0 ? (
              <div className="space-y-4">
                {reservas.map((reserva, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold">Reserva #{index + 1}</h2>
                      <p className="text-sm text-gray-500">
                        {new Date(reserva.fecha).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <p className="mb-2">
                      <span className="font-medium">Horario:</span> {reserva.horas.inicio} - {reserva.horas.fin}
                    </p>
                    
                    <h3 className="font-medium mb-2">Productos:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reserva.productos.map((producto) => (
                        <div key={producto.id} className="flex items-center border rounded p-3">
                          <div className="relative h-16 w-16 mr-3">
                            <Image
                              src={`/assets/images/${producto.imageSrc.replace(/^\/+/, '')}`}
                              alt={producto.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{producto.name}</p>
                            <p className="text-sm text-gray-500">ID: {producto.id}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tienes reservas registradas</p>
            )}
          </div>
        </Layout>                
      </div>
    </div>
  );
}

