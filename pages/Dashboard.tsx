"use client"
import prestamo from "../assets/images/prestamo.png";
import notificacionesImg from "../assets/images/notificaciones.png"; 
import misReservas from "../assets/images/misReservas.png";
import Layout from "@/components/Layout";
import Opciones from "@/components/Opciones";


const Dashboard = () => {
  return (
    <div>
      <Layout>
      <div className="flex flex-col md:flex-row md:space-x-4">
          <Opciones title="Prestamos" imgSrc={prestamo.src} href="../prestamosDeportivos/Prestamos" />
          <Opciones title="Notificaciones" imgSrc={notificacionesImg.src} href="../prestamosDeportivos/Notificaciones" />
          <Opciones title="Mis Reservas" imgSrc={misReservas.src} href="../prestamosDeportivos/MisReservas" />
      </div>
      </Layout>
    </div>
  );
};

export default Dashboard;