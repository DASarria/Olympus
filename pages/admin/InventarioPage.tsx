
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import api from '@/services/prestamosService'; // Or create a dedicated inventarioService if needed
import axios from "axios";

interface Unidad {
    id: number;
    observacion?: string;
}

interface Producto {
    id: string;
    name: string;
    description: string;
    articleStatus: string;
    unidades: Unidad[];
}

// Añade esta interfaz para definir la estructura de los artículos recibidos del backend
interface ArticuloResponse {
  id: number;
  name: string;
  description?: string;
  articleStatus?: string;
  quantity?: number;
}

export default function InventarioPage() {
    const router = useRouter();
    const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const [productos, setProductos] = useState<Producto[]>([]);
    const [obsVisible, setObsVisible] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (role !== "ADMIN") {
            alert("No tienes permisos para acceder a esta página");
            router.push("/Dashboard");
            return;
        }

        const fetchArticulos = async () => {
            try {
                const response = await api.get('/Article');
                setProductos(response.data.map((art: ArticuloResponse) => ({
                    id: art.id.toString(),
                    name: art.name,
                    description: art.description || "Sin descripción",
                    articleStatus: art.articleStatus || "disponible",
                    unidades: Array.from({ length: art.quantity || 1 }, (_, i) => ({ id: i + 1 }))
                })));
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.message || 'Error al cargar artículos');
                } else {
                    setError('Error desconocido al cargar artículos');
                }
                console.error("Error al cargar artículos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticulos();
    }, [role, router]);

    const modificarCantidad = async (productoId: string, delta: number) => {
        try {
            setLoading(true);
            const producto = productos.find(p => p.id === productoId);
            if (!producto) return;

            const nuevaCantidad = producto.unidades.length + delta;
            if (nuevaCantidad < 0) return;

            // Actualizar en el backend
            await api.put(`/articles/${productoId}`, {
                quantity: nuevaCantidad
            });

            // Actualizar en el frontend
            setProductos(prev =>
                prev.map(p =>
                    p.id === productoId
                        ? {
                            ...p,
                            unidades: Array.from({ length: nuevaCantidad }, (_, i) => ({
                                id: i + 1,
                                observacion: p.unidades[i]?.observacion
                            }))
                        }
                        : p
                )
            );
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Error al modificar cantidad');
            } else {
                alert('Error desconocido al modificar cantidad');
            }
            console.error("Error al modificar cantidad:", error);
        } finally {
            setLoading(false);
        }
    };

    const obtenerObservaciones = (producto: Producto) => {
        return producto.unidades.filter((u) => u.observacion);
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p>{error}</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)]">
                <div className="flex flex-col flex-grow">
                    <main className="flex-grow p-8">
                        <h1 className="text-3xl font-bold mb-6">Inventario Deportivo</h1>
                        
                        <div className="overflow-x-auto rounded-lg shadow">
                            <table className="min-w-full table-auto bg-white text-sm text-gray-700 border border-gray-200">
                                <thead className="bg-gray-200 text-left">
                                <tr>
                                    <th className="px-4 py-3 border">ID</th>
                                    <th className="px-4 py-3 border">Producto</th>
                                    <th className="px-4 py-3 border">Descripción</th>
                                    <th className="px-4 py-3 border">Estado</th>
                                    <th className="px-4 py-3 border text-center">Cantidad</th>
                                    <th className="px-4 py-3 border">Observaciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {productos.map((producto) => {
                                    const observaciones = obtenerObservaciones(producto);
                                    return (
                                        <tr key={producto.id} className="hover:bg-gray-100 align-top">
                                            <td className="px-4 py-2 border">{producto.id}</td>
                                            <td className="px-4 py-2 border">{producto.name}</td>
                                            <td className="px-4 py-2 border">{producto.description}</td>
                                            <td className="px-4 py-2 border">{producto.articleStatus}</td>
                                            <td className="px-4 py-2 border text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 text-white px-2 rounded"
                                                        onClick={() => modificarCantidad(producto.id, -1)}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="font-medium">{producto.unidades.length}</span>
                                                    <button
                                                        className="bg-green-500 hover:bg-green-600 text-white px-2 rounded"
                                                        onClick={() => modificarCantidad(producto.id, 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td
                                                className="px-4 py-2 border cursor-pointer text-blue-600 hover:underline"
                                                onClick={() =>
                                                    setObsVisible(obsVisible === producto.id ? null : producto.id)
                                                }
                                            >
                                                {observaciones.length > 0
                                                    ? `Sí (${observaciones.length})`
                                                    : "No"}
                                                {obsVisible === producto.id && observaciones.length > 0 && (
                                                    <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                                                        {observaciones.map((u) => (
                                                            <li key={u.id}>
                                                                Unidad #{u.id}: {u.observacion}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>
        </Layout>
    );
}