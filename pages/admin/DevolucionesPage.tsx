"use client"
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { getDevoluciones, createDevolucion, verificarDevolucion } from "@/services/devolucionesService";
import type { Devolucion } from "@/services/devolucionesService";



export default function DevolucionesPage() {
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newDevolucion, setNewDevolucion] = useState<Omit<Devolucion, "id" | "verificado">>({
    producto: "",
    usuario: "",
    fecha: "",
    estado: "",
    observaciones: "",
  });

  useEffect(() => {
    const fetchDevoluciones = async () => {
      try {
        setLoading(true);
        const response = await getDevoluciones();
        setDevoluciones(response);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar devoluciones';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDevoluciones();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await createDevolucion(newDevolucion);
      setDevoluciones([response, ...devoluciones]);
      setNewDevolucion({
        producto: "",
        usuario: "",
        fecha: "",
        estado: "",
        observaciones: ""
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear devolución';
      setError(errorMessage);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      const updated = await verificarDevolucion(id);
      setDevoluciones(devoluciones.map(d => d.id === id ? updated : d));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al verificar devolución';
      setError(errorMessage);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Devoluciones</h1>
        
        {/* Formulario para crear devoluciones */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Registrar Nueva Devolución</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Producto</label>
              <input
                type="text"
                value={newDevolucion.producto}
                onChange={(e) => setNewDevolucion({...newDevolucion, producto: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Usuario</label>
              <input
                type="text"
                value={newDevolucion.usuario}
                onChange={(e) => setNewDevolucion({...newDevolucion, usuario: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                value={newDevolucion.fecha}
                onChange={(e) => setNewDevolucion({...newDevolucion, fecha: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                value={newDevolucion.estado}
                onChange={(e) => setNewDevolucion({...newDevolucion, estado: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Seleccionar estado</option>
                <option value="Bueno">Bueno</option>
                <option value="Regular">Regular</option>
                <option value="Malo">Malo</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea
              value={newDevolucion.observaciones}
              onChange={(e) => setNewDevolucion({...newDevolucion, observaciones: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            ></textarea>
          </div>
          
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Registrar Devolución
          </button>
        </div>
        
        {/* Tabla de devoluciones */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verificado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : devoluciones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No hay devoluciones registradas
                  </td>
                </tr>
              ) : (
                devoluciones.map((devolucion) => (
                  <tr key={devolucion.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{devolucion.producto}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{devolucion.usuario}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(devolucion.fecha).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        devolucion.estado === 'Bueno' ? 'bg-green-100 text-green-800' :
                        devolucion.estado === 'Regular' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {devolucion.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {devolucion.verificado ? (
                        <span className="text-green-600">✓ Verificado</span>
                      ) : (
                        <span className="text-red-600">✗ Pendiente</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!devolucion.verificado && (
                        <button
                          onClick={() => handleVerify(devolucion.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Verificar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}