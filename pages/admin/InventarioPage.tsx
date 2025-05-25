"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import api from '@/services/prestamosService';
import axios from "axios";

interface Articulo {
    id: number;
    name: string;
    description?: string;
    articleStatus?: string;
    imageUrl?: string;
}

interface GroupedArticulo {
    name: string;
    description: string;
    available: number;
    total: number;
    observaciones: Articulo[];
}

export default function InventarioPage() {
    const router = useRouter();
    const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [obsVisible, setObsVisible] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (role !== "ADMIN") {
            alert("No tienes permisos para acceder a esta página");
            router.push("/module4");
            return;
        }

        fetchArticulos();
    }, [role, router]);

    const fetchArticulos = async (q?: string) => {
        try {
            setLoading(true);
            const params = q ? { params: { q } } : {};
            const response = await api.get('/Article', params);
            setArticulos(response.data.articulos);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.details || 'Error al cargar artículos');
            } else {
                setError('Error desconocido al cargar artículos');
            }
        } finally {
            setLoading(false);
        }
    };

    const groupArticulos = (): GroupedArticulo[] => {
        const grouped = articulos.reduce((acc: { [key: string]: GroupedArticulo }, articulo) => {
            const key = articulo.name;
            if (!acc[key]) {
                acc[key] = {
                    name: key,
                    description: articulo.description || "Sin descripción",
                    available: 0,
                    total: 0,
                    observaciones: []
                };
            }
            
            acc[key].total += 1;
            
            if (articulo.articleStatus === 'Disponible') {
                acc[key].available += 1;
            }
            
            if (articulo.articleStatus === 'Danado' || articulo.articleStatus === 'RequireMantenimiento') {
                acc[key].observaciones.push(articulo);
            }
            
            return acc;
        }, {});
        
        return Object.values(grouped);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchArticulos(searchTerm);
    };

    const agregarArticulo = async (name: string, description: string) => {
        try {
            await api.post('/Article', {
                name,
                description,
                articleStatus: "Disponible"
            });
            fetchArticulos();
        } catch (error) {
            alert('Error al crear artículo');
        }
    };

    const eliminarArticulo = async (name: string) => {
        try {
            const disponible = articulos.find(a => 
                a.name === name && a.articleStatus === 'Disponible'
            );
            
            if (!disponible) {
                alert('No hay unidades disponibles para eliminar');
                return;
            }
            
            await api.delete(`/Article/${disponible.id}`);
            fetchArticulos();
        } catch (error) {
            alert('Error al eliminar artículo');
        }
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

    const groupedArticulos = groupArticulos();

    return (
        <Layout>
            <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)]">
                <div className="flex flex-col flex-grow">
                    <main className="flex-grow p-8">
                        <h1 className="text-3xl font-bold mb-6">Inventario Deportivo</h1>
                        
                        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                            <input
                                type="text"
                                placeholder="Buscar por ID, nombre o estado..."
                                className="p-2 border rounded flex-grow"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Buscar
                            </button>
                        </form>

                        <div className="overflow-x-auto rounded-lg shadow">
                            <table className="min-w-full table-auto bg-white text-sm text-gray-700 border border-gray-200">
                                <thead className="bg-gray-200 text-left">
                                <tr>
                                    <th className="px-4 py-3 border">Producto</th>
                                    <th className="px-4 py-3 border">Descripción</th>
                                    <th className="px-4 py-3 border">Disponibles</th>
                                    <th className="px-4 py-3 border">Total</th>
                                    <th className="px-4 py-3 border">Acciones</th>
                                    <th className="px-4 py-3 border">Observaciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {groupedArticulos.map((grupo) => (
                                    <tr key={grupo.name} className="hover:bg-gray-100 align-top">
                                        <td className="px-4 py-2 border">{grupo.name}</td>
                                        <td className="px-4 py-2 border">{grupo.description}</td>
                                        <td className="px-4 py-2 border text-center">{grupo.available}</td>
                                        <td className="px-4 py-2 border text-center">{grupo.total}</td>
                                        <td className="px-4 py-2 border text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white px-2 rounded"
                                                    onClick={() => eliminarArticulo(grupo.name)}
                                                >
                                                    −
                                                </button>
                                                <button
                                                    className="bg-green-500 hover:bg-green-600 text-white px-2 rounded"
                                                    onClick={() => agregarArticulo(grupo.name, grupo.description)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td
                                            className="px-4 py-2 border cursor-pointer text-blue-600 hover:underline"
                                            onClick={() =>
                                                setObsVisible(obsVisible === grupo.name ? null : grupo.name)
                                            }
                                        >
                                            {grupo.observaciones.length > 0
                                                ? `Ver (${grupo.observaciones.length})`
                                                : "Sin observaciones"}
                                            {obsVisible === grupo.name && grupo.observaciones.length > 0 && (
                                                <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                                                    {grupo.observaciones.map((articulo) => (
                                                        <li key={articulo.id}>
                                                            ID {articulo.id}: {articulo.articleStatus} -{" "}
                                                            {articulo.description || "Sin detalles"}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </div>
        </Layout>
    );
}