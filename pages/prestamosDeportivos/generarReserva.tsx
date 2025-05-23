'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import api from '@/services/prestamosService';
import axios from "axios";

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: 'disponible' | 'mantenimiento' | 'dañado';
  estadoEquipo?: 'buen estado' | 'requiere mantenimiento' | 'dañado';
}

// Eliminamos la interfaz ReservaRequest que no se usa

interface ReservaResponse {
  id: string;
  message: string;
  status: string;
}

export default function GenerarReserva() {
  const [productosSeleccionados, setProductosSeleccionados] = useState<Product[]>([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const productosGuardados = localStorage.getItem('productosSeleccionados');
    if (productosGuardados) {
      const productos = JSON.parse(productosGuardados);
      const productosConEstado = productos.map((producto: Product) => ({
        ...producto,
        estadoEquipo: 'buen estado',
      }));
      setProductosSeleccionados(productosConEstado);
    } else {
      router.push('/prestamosDeportivos/catalogo');
    }
  }, [router]);

  const actualizarEstadoEquipo = (
    id: string,
    nuevoEstado: 'buen estado' | 'requiere mantenimiento' | 'dañado'
  ) => {
    setProductosSeleccionados((prev) =>
      prev.map((producto) =>
        producto.id === id ? { ...producto, estadoEquipo: nuevoEstado } : producto
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!horaInicio || !horaFin) {
      setError('Por favor completa las horas de inicio y fin');
      setLoading(false);
      return;
    }

    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('id');
    const nameUser = sessionStorage.getItem('name');
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await api.post<ReservaResponse>('/loans', {
        articleIds: productosSeleccionados.map((p) => parseInt(p.id)),
        nameUser: nameUser || 'Usuario autenticado',
        userId: userId ? `U-${userId}` : 'U-autenticado',
        userRole: 'Estudiante',
        loanDescriptionType: `Reserva de ${productosSeleccionados.map((p) => p.name).join(', ')}`,
        loanDate: new Date().toISOString().split('T')[0],
        loanStatus: 'Prestado',
        equipmentStatus: 'En buen estado',
        startTime: horaInicio,
        endTime: horaFin,
      });
      
      console.log('Reserva creada con ID:', response.data.id);
      // O guardar algún dato de la respuesta
      sessionStorage.setItem('ultimaReservaId', response.data.id);
      
      alert('¡Reserva generada con éxito!');
      localStorage.removeItem('productosSeleccionados');
      router.push('/Dashboard');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Error al crear la reserva';
        setError(errorMessage);
      } else {
        setError('Error desconocido al crear la reserva');
      }
      console.error('Error al crear reserva:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Generar Reserva</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
          <div>
            <label className="block font-medium">Hora de Inicio</label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Hora de Fin</label>
            <input
              type="time"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>

          <h2 className="text-xl font-semibold mt-4">Productos Seleccionados</h2>
          {productosSeleccionados.map((producto) => (
            <div key={producto.id} className="border p-4 rounded mb-2 bg-gray-50">
              <p><strong>Nombre:</strong> {producto.name}</p>
              <label className="block mt-2 font-medium">Estado del equipo:</label>
              <select
                value={producto.estadoEquipo}
                onChange={(e) => actualizarEstadoEquipo(
                  producto.id, 
                  e.target.value as 'buen estado' | 'requiere mantenimiento' | 'dañado'
                )}
                className="border border-gray-300 rounded px-2 py-1 mt-1"
              >
                <option value="buen estado">Buen estado</option>
                <option value="requiere mantenimiento">Requiere mantenimiento</option>
                <option value="dañado">Dañado</option>
              </select>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Procesando...' : 'Confirmar Reserva'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
