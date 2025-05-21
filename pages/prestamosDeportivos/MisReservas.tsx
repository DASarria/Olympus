// pages/prestamosDeportivos/misReservas.tsx
"use client"
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Image from "next/image";
import LoanService from "../../services/loanService";
import { useUser } from "../../context/UserContext";

interface Reserva {
  id: string;
  articleIds: number[];
  nameUser: string;
  userId: string;
  startTime: string;
  endTime: string;
  loanDate: string;
  status: string;
  articles: {
    id: number;
    name: string;
    imageUrl: string;
  }[];
}

export default function MisReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const fetchReservas = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const userId = user.id.startsWith('U-') ? user.id.substring(2) : user.id;
        const reservasData = await LoanService.getUserLoans(userId);
        setReservas(reservasData);
      } catch (err) {
        console.error('Error al obtener reservas:', err);
        setError('Error al cargar tus reservas');
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [user?.id]);

  const handleCancelReserva = async (reservaId: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      try {
        await LoanService.cancelLoan(reservaId);
        setReservas(reservas.filter(r => r.id !== reservaId));
        alert('Reserva cancelada con éxito');
      } catch (err) {
        console.error('Error al cancelar reserva:', err);
        alert('Error al cancelar la reserva');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-grow">
        <Layout>
          <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Mis Reservas</h1>
            
            {loading ? (
              <p>Cargando reservas...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : reservas.length > 0 ? (
              <div className="space-y-4">
                {reservas.map((reserva) => (
                  <div key={reserva.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">Reserva {reserva.id.substring(0, 6)}</h2>
                        <p className="text-sm text-gray-500">
                          {new Date(reserva.loanDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        reserva.status === 'Prestado' ? 'bg-blue-100 text-blue-800' :
                        reserva.status === 'Devuelto' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reserva.status}
                      </span>
                    </div>
                    
                    <p className="mb-2">
                      <span className="font-medium">Horario:</span> {reserva.startTime} - {reserva.endTime}
                    </p>
                    
                    <h3 className="font-medium mb-2">Productos:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {reserva.articles.map((producto) => (
                        <div key={producto.id} className="flex items-center border rounded p-3">
                          <div className="relative h-16 w-16 mr-3">
                            <Image
                              src={producto.imageUrl}
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
                    
                    {reserva.status === 'Prestado' && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleCancelReserva(reserva.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                        >
                          Cancelar Reserva
                        </button>
                      </div>
                    )}
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