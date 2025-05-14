"use client";
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Opciones from "../components/Opciones";

export default function Home() {
  const [profile, setProfile] = useState<"user" | "admin">("user");

  const roleLabel = profile === "admin" ? "Administrador" : "Usuario";
  const initials = profile === "admin" ? "AD" : "US";

  return (
      <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)]">
        <Sidebar role={profile} />

        <div className="flex flex-col flex-grow">
          <Header role={roleLabel} initials={initials} />

          <div className="grid grid-rows-[1fr_auto] items-start justify-items-center flex-grow p-8 pb-20 gap-16 sm:p-10">
            <main className="flex flex-col gap-[32px] items-center sm:items-start w-full">
              <div className="w-full max-w-6xl mx-auto">
                {/* Texto informativo según el perfil */}
                {profile === "user" && (
                    <div className="bg-red-800 text-white p-6 rounded-md shadow-md">
                      <h1 className="text-2xl font-bold mb-4">MÓDULO DE PRÉSTAMO DEPORTIVO</h1>
                      <p className="text-lg">
                        El Módulo de Préstamo Deportivo permite solicitar y reservar equipos deportivos disponibles en el coliseo,
                        registrar devoluciones y notificar al usuario sobre fechas y horarios límite.
                      </p>
                    </div>
                )}

                {profile === "admin" && (
                    <div className="bg-green-800 text-white p-6 rounded-md shadow-md">
                      <h1 className="text-2xl font-bold mb-4">MÓDULO DE GESTIÓN ADMINISTRATIVA</h1>
                      <p className="text-lg">
                        Permite gestionar el inventario deportivo, verificar devoluciones, generar reportes y realizar análisis detallados.
                      </p>
                    </div>
                )}

                {/* Botones para cambiar de perfil */}
                <div className="mt-8 flex gap-4">
                  <button
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                      onClick={() => setProfile("user")}
                  >
                    Cambiar a Usuario
                  </button>
                  <button
                      className="px-4 py-2 bg-green-600 text-white rounded"
                      onClick={() => setProfile("admin")}
                  >
                    Cambiar a Administrador
                  </button>
                </div>

                {/* Opciones visibles por perfil */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {profile === "user" && (
                      <>
                        <Opciones title="Préstamo Deportivo" imgSrc="/prestamo.png" href="/prestamo" />
                        {/* Corregido: notificaciones.png con "s" */}
                        <Opciones title="Notificaciones" imgSrc="/notificaciones.png" href="/notificaciones" />
                      </>
                  )}

                  {profile === "admin" && (
                      <>
                        <Opciones title="Inventario" imgSrc="/inventario.png" href="/admin/inventario" />
                        <Opciones title="Prestamos" imgSrc="/prestamos.png" href="/admin/prestamos" />
                        <Opciones title="Devoluciones" imgSrc="/devoluciones.png" href="/admin/devoluciones" />
                        <Opciones title="Reportes" imgSrc="/reportes.png" href="/admin/reportes" />
                        <Opciones title="Análisis" imgSrc="/analisis.png" href="/admin/analisis" />

                      </>
                  )}
                </div>
              </div>
            </main>
          </div>

          <Footer />
        </div>
      </div>
  );
}