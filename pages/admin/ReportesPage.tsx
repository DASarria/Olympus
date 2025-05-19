"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/Layout';
interface Reporte {
    id: string;
    resumen: string;
    detalle: string;
    tiempo: string;
}

export default function ReportesPage() {
    const [reportes] = useState<Reporte[]>([
        {
            id: "1",
            resumen: "Reportó pérdida de 1 torre del tablero de ajedrez",
            detalle:
                "El usuario Pepito Pérez, al momento de devolver el préstamo del ajedrez, reportó la pérdida de una ficha del ajedrez: una torre.",
            tiempo: "hace 3 horas",
        },
        {
            id: "2",
            resumen: "Raqueta con mango suelto detectada",
            detalle:
                "Durante la inspección del equipo, se encontró que una raqueta de ping pong tenía el mango ligeramente suelto.",
            tiempo: "hace 5 horas",
        },
        {
            id: "3",
            resumen: "Puerta dañada en casillero 4B",
            detalle:
                "Se reportó que la puerta del casillero 4B no cierra correctamente debido a una bisagra rota.",
            tiempo: "ayer",
        },
    ]);

    const [reporteActivo, setReporteActivo] = useState<string | null>(null);

    const toggleDetalle = (id: string) => {
        setReporteActivo(reporteActivo === id ? null : id);
    };

    return (
        <Layout>
        <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)]">
            
            <div className="flex flex-col flex-grow">
                
                <main className="flex-grow p-8">
                    <h1 className="text-3xl font-bold mb-6">Reportes recientes</h1>

                    <div className="space-y-4">
                        {reportes.map((reporte) => (
                            <div
                                key={reporte.id}
                                className="border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all bg-white"
                            >
                                <button
                                    onClick={() => toggleDetalle(reporte.id)}
                                    className="w-full text-left px-6 py-4 flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-medium">{reporte.resumen}</p>
                                        <span className="text-sm text-gray-500">{reporte.tiempo}</span>
                                    </div>
                                    <span className="text-blue-500 font-bold">
                    {reporteActivo === reporte.id ? "−" : "+"}
                  </span>
                                </button>
                                {reporteActivo === reporte.id && (
                                    <div className="px-6 pb-4 text-gray-700">
                                        {reporte.detalle}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
              
            </div>
        </div>
        </Layout>
    );
}