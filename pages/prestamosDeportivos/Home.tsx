'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Opciones from '@/components/Opciones';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const role = sessionStorage.getItem('role');
    if (!role) {
      setUserRole(null);
      return;
    }

    setUserRole(role);
  }, [router]);

  const studentOptions = [
    { title: 'Prestamos', imgSrc: '/images/prestamo.png', href: '/prestamosDeportivos/Prestamos' },
    { title: 'Notificaciones', imgSrc: '/images/notificaciones.png', href: '/prestamosDeportivos/Notificaciones' },
    { title: 'Mis Reservas', imgSrc: '/images/misReservas.png', href: '/prestamosDeportivos/MisReservas' },
  ];

  const adminOptions = [
    { title: 'Analisis', imgSrc: '/images/analisis.png', href: '/admin/AnalisisPage' },
    { title: 'Devoluciones', imgSrc: '/images/devoluciones.png', href: '/admin/DevolucionesPage' },
    { title: 'Inventario', imgSrc: '/images/inventario.png', href: '/admin/InventarioPage' },
    { title: 'Prestamos', imgSrc: '/images/prestamo.png', href: '/admin/PrestamosPage' },
    { title: 'Reportes', imgSrc: '/images/reportes.png', href: '/admin/ReportesPage' },
  ];

  const getOptions = () => {
    if (userRole === 'ADMIN') return adminOptions;
    if (userRole === 'STUDENT' || userRole === 'TEACHER') return studentOptions;
    return [];
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {userRole === null ? (
          <p className="text-gray-600">Cargando opciones...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {getOptions().map((option, index) => (
              <Opciones key={index} title={option.title} imgSrc={option.imgSrc} href={option.href} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
