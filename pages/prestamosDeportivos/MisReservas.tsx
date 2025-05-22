"use client";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Image from "next/image";
import LoanService from "../../services/loanService";
import { useRouter } from "next/navigation";

interface LoanDTO {
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
  const [reservas, setReservas] = useState<LoanDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("id");
    const nameUser = sessionStorage.getItem("name");

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    const fetchReservas = async () => {
      try {
        setLoading(true);
        const formattedUserId = userId.startsWith("U-") ? userId.substring(2) : userId;
        const reservasData = await LoanService.getUserLoans(formattedUserId);
        // Provide a default value for nameUser if it's null
        const enrichedData = reservasData.map((r: LoanDTO) => ({ 
          ...r, 
          nameUser: nameUser || "Usuario" 
        }));
        setReservas(enrichedData);
      } catch (err) {
        console.error("Error al obtener reservas:", err);
        const errorMessage = err instanceof Error ? err.message : "Error al cargar tus reservas";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [router]);

  const handleCancelReserva = async (reservaId: string) => {
    if (confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
      try {
        await LoanService.cancelLoan(reservaId);
        setReservas((prev) => prev.filter((r) => r.id !== reservaId));
        alert("Reserva cancelada con éxito");
      } catch (err) {
        console.error("Error al cancelar reserva:", err);
        const errorMessage = err instanceof Error ? err.message : "Error al cancelar la reserva";
        alert(errorMessage);
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Mis Reservas</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : reservas.length > 0 ? (
          <div className="space-y-6">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{reserva.nameUser}</h2>
                    <p className="text-gray-600">Fecha: {new Date(reserva.loanDate).toLocaleDateString()}</p>
                    <p className="text-gray-600">Horario: {reserva.startTime} - {reserva.endTime}</p>
                    <p className="text-gray-600">Estado: {reserva.status}</p>
                  </div>
                  <button 
                    onClick={() => handleCancelReserva(reserva.id)}
                    className="mt-4 md:mt-0 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Cancelar Reserva
                  </button>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Artículos reservados:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {reserva.articles && reserva.articles.map((article) => (
                      <div key={article.id} className="flex items-center space-x-3">
                        {article.imageUrl && (
                          <div className="w-12 h-12 relative">
                            <Image 
                              src={article.imageUrl} 
                              alt={article.name}
                              width={48}
                              height={48}
                              className="rounded object-cover"
                            />
                          </div>
                        )}
                        <span>{article.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No tienes reservas registradas</p>
          </div>
        )}
      </div>
    </Layout>
  );
}