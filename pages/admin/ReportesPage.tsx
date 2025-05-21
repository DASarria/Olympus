"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { getReportes, Reporte } from '@/services/reportesService';

export default function ReportesPage() {
    const [reportes, setReportes] = useState<Reporte[]>([]);
    const [reporteActivo, setReporteActivo] = useState<string | null>(null);

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const data = await getReportes();
                setReportes(data);
            } catch (error) {
                console.error("Error al cargar reportes:", error);
            }
        };

        fetchReportes();
    }, []);

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