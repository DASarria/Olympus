"use client";


import { useState } from "react";
// First install the package and its types with: npm install @headlessui/react @types/headlessui
import { Dialog } from '@headlessui/react';
// First install the package with: npm install @heroicons/react
import { XMarkIcon as X } from '@heroicons/react/24/outline';
import Layout from "@/components/Layout";

// Simulación de préstamos
const prestamosEjemplo = [
    {
        id: "P001",
        articleIds: [1, 2],
        nameUser: "Pepito Pérez",
        userId: "U123",
        userRole: "Usuario",
        loanDescriptionType: "Préstamo de balones",
        creationDate: "2025-05-01T10:00:00",
        loanDate: "2025-05-01",
        devolutionDate: "2025-05-07",
        loanStatus: "Activo",
        equipmentStatus: "Disponible",
        devolutionRegister: "No registrado",
    },
    {
        id: "P002",
        articleIds: [3],
        nameUser: "Laura Gómez",
        userId: "U456",
        userRole: "Administrador",
        loanDescriptionType: "Préstamo de cámaras",
        creationDate: "2025-04-29T14:00:00",
        loanDate: "2025-04-30",
        devolutionDate: "2025-05-05",
        loanStatus: "Finalizado",
        equipmentStatus: "En uso",
        devolutionRegister: "Registrado el 2025-05-06",
    },
];

export default function PrestamosPage() {
    const [prestamos, setPrestamos] = useState(prestamosEjemplo);
    const [filtro, setFiltro] = useState("activo");
    const [detalle, setDetalle] = useState<any | null>(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nuevoPrestamo, setNuevoPrestamo] = useState({
        nameUser: "",
        userId: "",
        userRole: "",
        loanDescriptionType: "",
        loanDate: "",
        devolutionDate: "",
    });

    const [searchTerm, setSearchTerm] = useState("");

    const agregarPrestamo = () => {
        const camposObligatorios = [
            "nameUser",
            "userId",
            "userRole",
            "loanDescriptionType",
            "loanDate",
            "devolutionDate",
        ];
        const vacíos = camposObligatorios.some((campo) => !nuevoPrestamo[campo as keyof typeof nuevoPrestamo]);
        if (vacíos) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        const nuevo = {
            id: `P${(prestamos.length + 1).toString().padStart(3, "0")}`,
            articleIds: [],
            creationDate: new Date().toISOString(),
            equipmentStatus: "Disponible",
            loanStatus: "Activo",
            devolutionRegister: "No registrado",
            ...nuevoPrestamo,
        };

        setPrestamos([nuevo, ...prestamos]);
        setNuevoPrestamo({
            nameUser: "",
            userId: "",
            userRole: "",
            loanDescriptionType: "",
            loanDate: "",
            devolutionDate: "",
        });
        setMostrarFormulario(false);
    };

    const filteredPrestamos = prestamos.filter((p) => {
        if (filtro === "historial") return p.loanStatus.toLowerCase() === "finalizado";
        return p.loanStatus.toLowerCase() === filtro;
    }).filter(p =>
        p.nameUser.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
        <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)]">
            <div className="flex flex-col flex-grow">
                <main className="flex-grow p-8">
                    <h1 className="text-3xl font-bold mb-6">Préstamos</h1>

                    {/* Filtros */}
                    <div className="mb-6 flex flex-wrap gap-4">
                        {[{ label: "Activos", value: "activo", color: "bg-blue-600" }, { label: "Historial", value: "historial", color: "bg-yellow-600" }].map(({ label, value, color }) => (
                            <button key={value} onClick={() => setFiltro(value)} className={`px-4 py-2 rounded text-white ${color}`}>
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Buscador de usuario */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Buscar por usuario"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    {/* Tabla de préstamos */}
                    <div className="overflow-x-auto rounded-lg shadow bg-white text-sm border">
                        <table className="min-w-full">
                            <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-3 border">ID</th>
                                <th className="px-4 py-3 border">Usuario</th>
                                <th className="px-4 py-3 border">Fecha Préstamo</th>
                                <th className="px-4 py-3 border">Fecha Devolución</th>
                                <th className="px-4 py-3 border">Estado</th>
                                <th className="px-4 py-3 border">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredPrestamos.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-100">
                                    <td className="px-4 py-2 border">{p.id}</td>
                                    <td className="px-4 py-2 border">{p.nameUser}</td>
                                    <td className="px-4 py-2 border">{p.loanDate}</td>
                                    <td className="px-4 py-2 border">{p.devolutionDate}</td>
                                    <td className="px-4 py-2 border">{p.loanStatus}</td>
                                    <td className="px-4 py-2 border">
                                        <button onClick={() => setDetalle(p)} className="bg-blue-600 text-white px-3 py-1 rounded">
                                            Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Botón para crear nuevo préstamo */}
                    <div className="mt-6">
                        <button onClick={() => setMostrarFormulario(true)} className="px-6 py-3 bg-green-600 text-white rounded">
                            Crear Nuevo Préstamo
                        </button>
                    </div>
                </main>
            </div>

            {/* Panel Detalles */}
            <Dialog open={!!detalle} onClose={() => setDetalle(null)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg p-6 overflow-y-auto">
                    <button className="ml-auto mb-4" onClick={() => setDetalle(null)}>
                        <X />
                    </button>
                    <h2 className="text-xl font-bold mb-4">Detalle del Préstamo</h2>
                    {detalle && (
                        <div className="space-y-2 text-sm">
                            {Object.entries(detalle).map(([k, v]) => (
                                <p key={k}>
                                    <strong>{k}:</strong> {Array.isArray(v) ? v.join(", ") : String(v)}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </Dialog>

            {/* Formulario Crear Préstamo */}
            <Dialog open={mostrarFormulario} onClose={() => setMostrarFormulario(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg p-6 overflow-y-auto">
                    <button className="ml-auto mb-4" onClick={() => setMostrarFormulario(false)}>
                        <X />
                    </button>
                    <h2 className="text-xl font-bold mb-4">Crear Nuevo Préstamo</h2>
                    <div className="space-y-3 text-sm">
                        {[{ label: "Nombre del Usuario", field: "nameUser" }, { label: "ID del Usuario", field: "userId" }, { label: "Rol del Usuario", field: "userRole" }, { label: "Descripción", field: "loanDescriptionType" }, { label: "Fecha de Préstamo", field: "loanDate", type: "date" }, { label: "Fecha de Devolución", field: "devolutionDate", type: "date" }].map(({ label, field, type = "text" }) => (
                            <input
                                key={field}
                                type={type}
                                placeholder={label}
                                value={nuevoPrestamo[field as keyof typeof nuevoPrestamo]}
                                onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, [field]: e.target.value })}
                                className="border p-2 rounded w-full"
                            />
                        ))}
                        <button onClick={agregarPrestamo} className="bg-green-600 text-white px-4 py-2 rounded">
                            Guardar Préstamo
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
        </Layout>
    );
}