"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { getDevoluciones, createDevolucion, verificarDevolucion, Devolucion } from "@/services/devolucionesService";

export default function DevolucionesPage() {
    const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
    const [nueva, setNueva] = useState<Omit<Devolucion, "id" | "verificado">>({
        producto: "",
        usuario: "",
        fecha: "",
        estado: "",
        observaciones: "",
    });

    useEffect(() => {
        const fetchDevoluciones = async () => {
            try {
                const data = await getDevoluciones();
                setDevoluciones(data);
            } catch (error) {
                console.error("Error al cargar devoluciones:", error);
            }
        };

        fetchDevoluciones();
    }, []);

    const agregarDevolucion = async () => {
        if (!nueva.producto || !nueva.usuario || !nueva.fecha) {
            alert("Por favor completa todos los campos obligatorios.");
            return;
        }

        try {
            const nuevaDev = await createDevolucion(nueva);
            setDevoluciones([nuevaDev, ...devoluciones]);
            setNueva({ 
                producto: "", 
                usuario: "", 
                fecha: "", 
                estado: "", 
                observaciones: "" 
            });
        } catch (error) {
            console.error("Error al agregar devolución:", error);
        }
    };

    const handleVerificarDevolucion = async (id: string) => {
        try {
            const devolucionActualizada = await verificarDevolucion(id);
            setDevoluciones(devoluciones.map(d => 
                d.id === id ? devolucionActualizada : d
            ));
        } catch (error) {
            console.error("Error al verificar devolución:", error);
        }
    };

    const cambiarObservacion = (id: string, nuevaObs: string) => {
        setDevoluciones(devoluciones.map(d => 
            d.id === id ? { ...d, observaciones: nuevaObs } : d
        ));
    };

    return (
        <Layout>
            <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)]">
                <div className="flex flex-col flex-grow">
                    <main className="flex-grow p-8">
                        <h1 className="text-3xl font-bold mb-6">Devoluciones</h1>

                        {/* FORMULARIO DE REGISTRO */}
                        <div className="bg-white p-6 rounded shadow-md mb-10 max-w-4xl">
                            <h2 className="text-xl font-semibold mb-4">Registrar nueva devolución</h2>
                            <div className="grid sm:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    placeholder="Producto*"
                                    value={nueva.producto}
                                    onChange={(e) => setNueva({ ...nueva, producto: e.target.value })}
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Usuario*"
                                    value={nueva.usuario}
                                    onChange={(e) => setNueva({ ...nueva, usuario: e.target.value })}
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="date"
                                    value={nueva.fecha}
                                    onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Estado del producto"
                                    value={nueva.estado}
                                    onChange={(e) => setNueva({ ...nueva, estado: e.target.value })}
                                    className="border p-2 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Observaciones"
                                    value={nueva.observaciones}
                                    onChange={(e) => setNueva({ ...nueva, observaciones: e.target.value })}
                                    className="border p-2 rounded col-span-2"
                                />
                            </div>
                            <button
                                onClick={agregarDevolucion}
                                className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
                            >
                                Agregar devolución
                            </button>
                        </div>

                        {/* TABLA DE DEVOLUCIONES */}
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border border-gray-300 text-sm">
                                <thead className="bg-gray-200 text-left">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Producto</th>
                                    <th className="p-3">Usuario</th>
                                    <th className="p-3">Fecha</th>
                                    <th className="p-3">Estado</th>
                                    <th className="p-3">Observaciones</th>
                                    <th className="p-3">Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {devoluciones.map((d) => (
                                    <tr key={d.id} className="border-t">
                                        <td className="p-3">{d.id}</td>
                                        <td className="p-3">{d.producto}</td>
                                        <td className="p-3">{d.usuario}</td>
                                        <td className="p-3">{d.fecha}</td>
                                        <td className="p-3">{d.estado}</td>
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={d.observaciones}
                                                onChange={(e) => cambiarObservacion(d.id, e.target.value)}
                                                className="border p-1 w-full"
                                            />
                                        </td>
                                        <td className="p-3">
                                            {d.verificado ? (
                                                <span className="text-green-600 font-semibold">Verificado</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleVerificarDevolucion(d.id)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded"
                                                >
                                                    Verificar
                                                </button>
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