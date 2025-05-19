// app/admin/analisis/page.tsx
"use client";

import Layout from "@/components/Layout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

const semanalData = [
    { name: "Balón Fútbol", prestamos: 18 },
    { name: "Raquetas", prestamos: 12 },
    { name: "Ajedrez", prestamos: 9 },
    { name: "Balón Básquet", prestamos: 7 },
    { name: "Casilleros", prestamos: 5 },
];

const mensualData = [
    { name: "Balón Fútbol", prestamos: 65 },
    { name: "Raquetas", prestamos: 50 },
    { name: "Ajedrez", prestamos: 42 },
    { name: "Balón Básquet", prestamos: 29 },
    { name: "Casilleros", prestamos: 21 },
];

export default function AnalisisPage() {
    return (
        <Layout>
        <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)]">
            <div className="flex flex-col flex-grow">

                <main className="flex-grow p-8">
                    <h1 className="text-2xl font-bold mb-8 text-gray-800">Análisis de Préstamos</h1>

                    {/* Análisis Semanal */}
                    <section className="mb-16">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Análisis Semanal</h2>
                        <div className="w-full h-80 bg-white rounded-lg shadow p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={semanalData}>
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

                    {/* Análisis Mensual */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Análisis Mensual</h2>
                        <div className="w-full h-80 bg-white rounded-lg shadow p-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mensualData}>
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
                </main>

            </div>
        </div>
        </Layout>
    );
}