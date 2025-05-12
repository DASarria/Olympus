"use client"
import { useState } from "react";
import Layout from "@/components/Layout";

interface Notification {
    id: number;
    title: string;
    message: string;
    date: string;
}

export default function Notificaciones() {
    const [notifications] = useState<Notification[]>([
        {
            id: 1,
            title: "Recordatorio de devolución",
            message: "Por favor, devuelve el balón de fútbol antes del viernes.",
            date: "2024-06-15",
        },
        {
            id: 2,
            title: "Nueva disponibilidad",
            message: "El equipo de raquetas está disponible para préstamo.",
            date: "2024-06-14",
        },
        {
            id: 3,
            title: "Mantenimiento programado",
            message: "El coliseo estará cerrado el próximo lunes por mantenimiento.",
            date: "2024-06-13",
        },
    ]);

    return (
        <div className="flex min-h-screen flex-col font-[family-name:var(--font-geist-sans)]">
            <div className="flex flex-grow">
                <Layout>

                    <main className="flex-grow p-8">
                        <h1 className="text-2xl font-bold mb-6">Notificaciones</h1>
                        <ul className="space-y-4">
                            {notifications.map(({ id, title, message, date }) => (
                                <li key={id} className="bg-white p-4 rounded shadow">
                                    <p className="font-semibold">{title}</p>
                                    <p>{message}</p>
                                    <p className="text-sm text-gray-500">Fecha: {date}</p>
                                </li>
                            ))}
                        </ul>
                    </main>
                </Layout>                
                </div>
            </div>
        
    );
}

