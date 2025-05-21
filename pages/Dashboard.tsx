"use client"
import { useState, useEffect } from "react";
import prestamo from "../assets/images/prestamo.png";
import notificacionesImg from "../assets/images/notificaciones.png"; 
import misReservas from "../assets/images/misReservas.png";

import inventario from "../assets/images/inventario.png";
import analisis from "../assets/images/analisis.png";
import devoluciones from "../assets/images/devoluciones.png";
import prestamos from "../assets/images/prestamo.png";
import reportes from "../assets/images/reportes.png";

import Layout from "@/components/Layout";
import Opciones from "@/components/Opciones";


const Dashboard = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Obtener el rol del usuario desde sessionStorage
    const role = sessionStorage.getItem("role");
    setUserRole(role);
  }, []);

  return (
    <div>
      <Layout>
      <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Opciones para estudiantes y profesores */}
          {(userRole === "STUDENT" || userRole === "TEACHER") && (
            <>
              <Opciones title="Prestamos" imgSrc={prestamo.src} href="../prestamosDeportivos/Prestamos" />
              <Opciones title="Notificaciones" imgSrc={notificacionesImg.src} href="../prestamosDeportivos/Notificaciones" />
              <Opciones title="Mis Reservas" imgSrc={misReservas.src} href="../prestamosDeportivos/MisReservas" />
            </>
          )}

          {/* Opciones para administradores */}
          {userRole === "ADMIN" && (
            <>
              <Opciones title="Analisis" imgSrc={analisis.src} href="../admin/AnalisisPage" />
              <Opciones title="Devoluciones" imgSrc={devoluciones.src} href="../admin/DevolucionesPage" />
              <Opciones title="Inventario" imgSrc={inventario.src} href="../admin/InventarioPage" />
              <Opciones title="Prestamos" imgSrc={prestamos.src} href="../admin/PrestamosPage" />
              <Opciones title="Reportes" imgSrc={reportes.src} href="../admin/ReportesPage" />
            </>
          )}
      </div>
      </Layout>
    </div>
  );
};

export default Dashboard;