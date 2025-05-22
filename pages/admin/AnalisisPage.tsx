"use client"
import Layout from "@/components/Layout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";
// Eliminamos la importación no utilizada
// import LoginServices from "../api/UserManagement/LoginService";

interface ChartData {
  name: string;
  prestamos: number;
}

export default function AnalisisPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState<{
    semanal: ChartData[];
    mensual: ChartData[];
  }>({
    semanal: [],
    mensual: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Aquí deberías llamar a tu servicio para obtener los datos reales
        // const response = await LoanService.getAnalyticsData();
        // setChartData(response.data);
        
        // Datos de ejemplo mientras implementas el backend
        setChartData({
          semanal: [
            { name: "Balón Fútbol", prestamos: 18 },
            { name: "Raquetas", prestamos: 12 },
            { name: "Ajedrez", prestamos: 9 },
            { name: "Balón Básquet", prestamos: 7 },
            { name: "Casilleros", prestamos: 5 },
          ],
          mensual: [
            { name: "Balón Fútbol", prestamos: 65 },
            { name: "Raquetas", prestamos: 50 },
            { name: "Ajedrez", prestamos: 42 },
            { name: "Balón Básquet", prestamos: 29 },
            { name: "Casilleros", prestamos: 21 },
          ]
        });
      } catch (err) {
        // Corregimos el tipo any
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos de análisis';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Análisis de Préstamos</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <>
            <section className="mb-16">
              <h2 className="text-xl font-semibold mb-4">Análisis Semanal</h2>
              <div className="w-full h-80 bg-white rounded-lg shadow p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.semanal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="prestamos" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Análisis Mensual</h2>
              <div className="w-full h-80 bg-white rounded-lg shadow p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.mensual}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="prestamos" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}