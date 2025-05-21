// pages/prestamosDeportivos/generarReserva.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/Layout';
import LoanService from '../../services/loanService';
import { useUser } from '../../context/UserContext';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: 'disponible' | 'mantenimiento' | 'dañado';
  estadoEquipo?: 'buen estado' | 'requiere mantenimiento' | 'dañado';
}

export default function GenerarReserva() {
  const [productosSeleccionados, setProductosSeleccionados] = useState<Product[]>([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { user } = useUser(); // Asume que tienes un contexto de usuario

  useEffect(() => {
    const productosGuardados = localStorage.getItem('productosSeleccionados');
    if (productosGuardados) {
      const productos = JSON.parse(productosGuardados);
      const productosConEstado = productos.map((producto: Product) => ({
        ...producto,
        estadoEquipo: 'buen estado'
      }));
      setProductosSeleccionados(productosConEstado);
    } else {
      router.push('/prestamosDeportivos/catalogo');
    }
  }, [router]);

  const actualizarEstadoEquipo = (id: string, nuevoEstado: 'buen estado' | 'requiere mantenimiento' | 'dañado') => {
    setProductosSeleccionados(prevProductos => 
      prevProductos.map(producto => 
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
    
    try {
      const loanData = {
        articleIds: productosSeleccionados.map(p => parseInt(p.id)),
        nameUser: user?.name || 'Usuario no identificado',
        userId: user?.id ? `U-${user.id}` : 'U-000',
        userRole: user?.role || 'Estudiante',
        loanDescriptionType: `Reserva de ${productosSeleccionados.map(p => p.name).join(', ')}`,
        loanDate: new Date().toISOString().split('T')[0],
        loanStatus: 'Prestado',
        equipmentStatus: 'En buen estado',
        startTime: horaInicio,
        endTime: horaFin
      };

      await LoanService.createLoan(loanData);
      
      alert('¡Reserva generada con éxito!');
      localStorage.removeItem('productosSeleccionados');
      router.push('/Dashboard');
    } catch (err) {
      console.error('Error al crear reserva:', err);
      setError('Error al crear la reserva. Por favor intenta nuevamente.');
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
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* ... (resto del JSX permanece igual) */}
        </div>
      </div>
    </Layout>
  );
}