"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { getArticulos, updateArticulo } from "@/services/inventarioService";
import { Articulo } from "@/services/inventarioService";

interface Unidad {
    id: number;
    observacion?: string;
}

interface Producto {
    id: string;
    nombre: string;
    categoria: string;
    estado: string;
    unidades: Unidad[];
}

export default function InventarioPage() {
    const router = useRouter();
    const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const [productos, setProductos] = useState<Producto[]>([]);
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [obsVisible, setObsVisible] = useState<string | null>(null);

    useEffect(() => {
        // Verificar si el usuario tiene permisos de administrador
        if (role !== "ADMIN") {
            alert("No tienes permisos para acceder a esta página");
            router.push("/Dashboard");
            return;
        }

        const fetchArticulos = async () => {
            try {
                const data = await getArticulos();
                setArticulos(data);
                
                // Transformar los artículos a productos para la vista
                const productosTransformados = data.map(art => ({
                    id: art.id.toString(),
                    nombre: art.name,
                    categoria: "Deportes", // Esto debería venir del backend
                    estado: art.articleStatus,
                    unidades: Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }))
                }));
                
                setProductos(productosTransformados);
            } catch (error) {
                console.error("Error al cargar artículos:", error);
            }
        };

        fetchArticulos();
    }, [role, router]);

    const modificarCantidad = async (productoId: string, delta: number) => {
        // En una implementación real, aquí llamarías al backend para actualizar
        setProductos(prev =>
            prev.map(producto => {
                if (producto.id === productoId) {
                    const nuevaCantidad = producto.unidades.length + delta;
                    if (nuevaCantidad < 0) return producto;

                    const nuevasUnidades =
                        delta > 0
                            ? [
                                ...producto.unidades,
                                ...Array.from({ length: delta }, (_, i) => ({
                                    id: producto.unidades.length + i + 1,
                                })),
                            ]
                            : producto.unidades.slice(0, nuevaCantidad);

                    return { ...producto, unidades: nuevasUnidades };
                }
                return producto;
            })
        );
    };

    const obtenerObservaciones = (producto: Producto) => {
        return producto.unidades.filter((u) => u.observacion);
    };

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
                                    <th className="px-4 py-3 border">Categoría</th>
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
                                            <td className="px-4 py-2 border">{producto.nombre}</td>
                                            <td className="px-4 py-2 border">{producto.categoria}</td>
                                            <td className="px-4 py-2 border">{producto.estado}</td>
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