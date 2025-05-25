
"use client";

import { useState, useEffect } from "react";
import { Dialog } from '@headlessui/react';
import { XMarkIcon as X } from '@heroicons/react/24/outline';
import Layout from "@/components/Layout";
import api from '@/services/prestamosService'; // Debes crear este archivo si no existe
import axios from "axios"; // Importa axios para el manejo de errores

interface Prestamo {
    id: string;
    nameUser: string;
    userId: string;
    userRole: string;
    loanDescriptionType: string;
    loanDate: string;
    devolutionDate: string;
    startTime: string;
    endTime: string;
    loanStatus: "Prestado" | "Vencido" | "Devuelto"; // Tipado específico
    equipmentStatus: string;
    devolutionRegister: string;
    creationDate: string;
    articleIds: number[];
}

export default function PrestamosPage() {
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtro, setFiltro] = useState<"activos" | "historial">("activos");
    const [detalle, setDetalle] = useState<Prestamo | null>(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nuevoPrestamo, setNuevoPrestamo] = useState({
        nameUser: "",
        userId: "",
        userRole: "Estudiante",
        loanDescriptionType: "",
        loanDate: new Date().toISOString().split('T')[0],
        devolutionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: "08:00",
        endTime: "10:00"
    });
    const [searchTerm, setSearchTerm] = useState("");

    const getAllPrestamos = async (): Promise<Prestamo[]> => {
        try {
            const response = await api.get('/LoanArticle');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error detallado:', error.response?.data);
            }
            throw error;
        }
    };

    const createPrestamo = async (prestamoData: Omit<Prestamo, 'id'>): Promise<Prestamo> => {
        try {
            const response = await api.post('/LoanArticle', prestamoData);
            return response.data;
        } catch (error) {
            console.error('Error al crear préstamo:', error);
            throw error;
        }
    };
    const [prestamoEditando, setPrestamoEditando] = useState<Prestamo | null>(null);

    // Función para eliminar préstamo
    const eliminarPrestamo = async (id: string) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este préstamo?")) return;
        try {
            setLoading(true);
            await api.delete(`/LoanArticle/${id}`);
            setPrestamos(prestamos.filter((p) => p.id !== id));
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Error al eliminar préstamo');
            } else {
                setError('Error desconocido al eliminar préstamo');
            }
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar préstamo
    const actualizarPrestamo = async (prestamoActualizado: Prestamo) => {
        try {
            setLoading(true);
            const response = await api.put(`/LoanArticle/${prestamoActualizado.id}`, prestamoActualizado);
            setPrestamos(prestamos.map((p) => p.id === prestamoActualizado.id ? response.data : p));
            setPrestamoEditando(null);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Error al actualizar préstamo');
            } else {
                setError('Error desconocido al actualizar préstamo');
            }
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
    const fetchPrestamos = async () => {
        try {
        setLoading(true);
        const data = await getAllPrestamos();
        // Ordenar por fecha más reciente primero
        setPrestamos(data.sort((a, b) => 
            new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        ));
        } catch (error) {
        // Manejo de errores existente
        }
    };
    fetchPrestamos();
    }, []);

    const agregarPrestamo = async () => {
        const camposObligatorios = [
            "nameUser",
            "userId",
            "userRole",
            "loanDescriptionType",
            "loanDate",
            "devolutionDate",
            "startTime",
            "endTime"
        ];
        
        const vacíos = camposObligatorios.some(
            (campo) => !nuevoPrestamo[campo as keyof typeof nuevoPrestamo]
        );
        
        if (vacíos) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        try {
            setLoading(true);
            const prestamoCreado = await createPrestamo({
                ...nuevoPrestamo,
                articleIds: [],
                loanStatus: "Prestado",
                equipmentStatus: "En buen estado",
                devolutionRegister: "No registrado",
                creationDate: new Date().toISOString()
            });
            
            setPrestamos([prestamoCreado, ...prestamos]);
            setNuevoPrestamo({
                nameUser: "",
                userId: "",
                userRole: "Estudiante",
                loanDescriptionType: "",
                loanDate: new Date().toISOString().split('T')[0],
                devolutionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                startTime: "08:00",
                endTime: "10:00"
            });
            setMostrarFormulario(false);
            setError(null);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Error al crear préstamo');
            } else {
                setError('Error desconocido al crear préstamo');
            }
            console.error('Error al crear préstamo:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPrestamos = prestamos.filter((p) => {
    if (filtro === "historial") return p.loanStatus === "Devuelto";
    return p.loanStatus === "Prestado" || p.loanStatus === "Vencido";
    }).filter(p => 
    p.nameUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)]">
                <div className="flex flex-col flex-grow">
                    <main className="flex-grow p-8">
                        <h1 className="text-3xl font-bold mb-6">Préstamos</h1>

                        {/* Display error message if there is one */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        {/* Loading indicator */}
                        {loading && (
                            <div className="mb-4 flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                <span>Cargando...</span>
                            </div>
                        )}

                        {/* Filtros */}
                        <div className="mb-6 flex flex-wrap gap-4">
                        <button 
                            onClick={() => setFiltro("activos")} 
                            className={`px-4 py-2 rounded text-white ${filtro === "activos" ? "bg-blue-600" : "bg-gray-400"}`}
                        >
                            Activos
                        </button>
                        <button 
                            onClick={() => setFiltro("historial")} 
                            className={`px-4 py-2 rounded text-white ${filtro === "historial" ? "bg-yellow-600" : "bg-gray-400"}`}
                        >
                            Historial
                        </button>
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
                                            <button 
                                                onClick={() => setDetalle(p)} 
                                                className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                                            >
                                                Ver Detalles
                                            </button>
                                            <button
                                                onClick={() => setPrestamoEditando(p)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => eliminarPrestamo(p.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Botón para crear nuevo préstamo */}
                        <div className="mt-6">
                            <button 
                                onClick={() => setMostrarFormulario(true)} 
                                className="px-6 py-3 bg-green-600 text-white rounded"
                            >
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
                            <input
                                type="text"
                                placeholder="Nombre del Usuario"
                                value={nuevoPrestamo.nameUser}
                                onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, nameUser: e.target.value })}
                                className="border p-2 rounded w-full"
                            />
                            <input
                                type="text"
                                placeholder="ID del Usuario"
                                value={nuevoPrestamo.userId}
                                onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, userId: e.target.value })}
                                className="border p-2 rounded w-full"
                            />
                            <select
                                value={nuevoPrestamo.userRole}
                                onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, userRole: e.target.value })}
                                className="border p-2 rounded w-full"
                            >
                                <option value="Estudiante">Estudiante</option>
                                <option value="Docente">Docente</option>
                                <option value="Administrativo">Administrativo</option>
                                <option value="ServiciosGenerales">Servicios Generales</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Descripción del préstamo"
                                value={nuevoPrestamo.loanDescriptionType}
                                onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, loanDescriptionType: e.target.value })}
                                className="border p-2 rounded w-full"
                            />
                            <input
                                type="date"
                                value={nuevoPrestamo.loanDate}
                                onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, loanDate: e.target.value })}
                                className="border p-2 rounded w-full"
                            />
                            <input
                                type="date"
                                value={nuevoPrestamo.devolutionDate}
                                onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, devolutionDate: e.target.value })}
                                className="border p-2 rounded w-full"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    value={nuevoPrestamo.startTime}
                                    onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, startTime: e.target.value })}
                                    className="border p-2 rounded w-full"
                                />
                                <input
                                    type="time"
                                    value={nuevoPrestamo.endTime}
                                    onChange={(e) => setNuevoPrestamo({ ...nuevoPrestamo, endTime: e.target.value })}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <button
                                onClick={() => prestamoEditando && actualizarPrestamo(prestamoEditando)}
                                className="bg-green-600 text-white px-4 py-2 rounded w-full"
                            >
                                Guardar Cambios
                            </button>
                            </div>
                    
                             <div>
                            <button 
                                onClick={agregarPrestamo} 
                                className="bg-green-600 text-white px-4 py-2 rounded w-full"
                            >
                                Guardar Préstamo
                            </button>
                        </div>
                    </div>
                </Dialog>
            </div>
        </Layout>
    );
}