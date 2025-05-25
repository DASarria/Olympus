"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon as X } from "@heroicons/react/24/outline";
import Layout from "@/components/Layout";
import api from "@/services/prestamosService";
import axios from "axios";

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
  loanStatus: "Prestado" | "Vencido" | "Devuelto";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [prestamoEditando, setPrestamoEditando] = useState<Prestamo | null>(null);

  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    nameUser: "",
    userId: "",
    userRole: "Estudiante",
    loanDescriptionType: "",
    loanDate: new Date().toISOString().split("T")[0],
    devolutionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    startTime: "08:00",
    endTime: "10:00"
  });

  const getAllPrestamos = async (): Promise<Prestamo[]> => {
    try {
      const response = await api.get("/LoanArticle");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error detallado:", error.response?.data);
      }
      throw error;
    }
  };

  const createPrestamo = async (prestamoData: Omit<Prestamo, "id">): Promise<Prestamo> => {
    try {
      const response = await api.post("/LoanArticle", prestamoData);
      return response.data;
    } catch (error) {
      console.error("Error al crear préstamo:", error);
      throw error;
    }
  };

  const eliminarPrestamo = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este préstamo?")) return;
    try {
      setLoading(true);
      await api.delete(`/LoanArticle/${id}`);
      setPrestamos(prestamos.filter((p) => p.id !== id));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al eliminar préstamo");
      } else {
        setError("Error desconocido al eliminar préstamo");
      }
    } finally {
      setLoading(false);
    }
  };

  const actualizarPrestamo = async (prestamoActualizado: Prestamo) => {
    try {
      setLoading(true);
      const response = await api.put(`/LoanArticle/${prestamoActualizado.id}`, prestamoActualizado);
      setPrestamos(prestamos.map((p) => (p.id === prestamoActualizado.id ? response.data : p)));
      setPrestamoEditando(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al actualizar préstamo");
      } else {
        setError("Error desconocido al actualizar préstamo");
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
        setPrestamos(
          data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
        );
      } catch (error) {
        setError("No se pudieron cargar los préstamos.");
      } finally {
        setLoading(false);
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
        loanDate: new Date().toISOString().split("T")[0],
        devolutionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        startTime: "08:00",
        endTime: "10:00"
      });
      setMostrarFormulario(false);
      setError(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al crear préstamo");
      } else {
        setError("Error desconocido al crear préstamo");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredPrestamos = prestamos
    .filter((p) => (filtro === "historial" ? p.loanStatus === "Devuelto" : p.loanStatus !== "Devuelto"))
    .filter((p) =>
      p.nameUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Layout>
      <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-col flex-grow">
          <main className="flex-grow p-8">
            <h1 className="text-3xl font-bold mb-6">Préstamos</h1>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {loading && (
              <div className="mb-4 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                <span>Cargando...</span>
              </div>
            )}

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

            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar por usuario o ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>

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
                      <td className="px-4 py-2 border space-x-2">
                        <button
                          onClick={() => setDetalle(p)}
                          className="text-blue-600 hover:underline"
                        >
                          Ver Detalles
                        </button>
                        <button
                          onClick={() => {
                            setPrestamoEditando(p);
                            setMostrarFormulario(true);
                          }}
                          className="text-green-600 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarPrestamo(p.id)}
                          className="text-red-600 hover:underline"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPrestamos.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500">
                        No hay préstamos para mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Botón para mostrar formulario */}
            <div className="mt-6">
              {!mostrarFormulario && (
                <button
                  onClick={() => {
                    setMostrarFormulario(true);
                    setPrestamoEditando(null);
                    setNuevoPrestamo({
                      nameUser: "",
                      userId: "",
                      userRole: "Estudiante",
                      loanDescriptionType: "",
                      loanDate: new Date().toISOString().split("T")[0],
                      devolutionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                      startTime: "08:00",
                      endTime: "10:00"
                    });
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded"
                >
                  Crear Nuevo Préstamo
                </button>
              )}
            </div>

            {/* Formulario creación / edición */}
            {mostrarFormulario && (
              <div className="mt-6 p-6 border rounded bg-gray-50 max-w-4xl">
                <h2 className="text-xl font-bold mb-4">
                  {prestamoEditando ? "Editar Préstamo" : "Nuevo Préstamo"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre del Usuario"
                    value={prestamoEditando ? prestamoEditando.nameUser : nuevoPrestamo.nameUser}
                    onChange={(e) => {
                      if (prestamoEditando) {
                        setPrestamoEditando({ ...prestamoEditando, nameUser: e.target.value });
                      } else {
                        setNuevoPrestamo({ ...nuevoPrestamo, nameUser: e.target.value });
                      }
                    }}
                    className="border p-2 rounded w-full"
                    required
                  />
                  <input
                    type="text"
                    placeholder="ID del Usuario"
                    value={prestamoEditando ? prestamoEditando.userId : nuevoPrestamo.userId}
                    onChange={(e) => {
                      if (prestamoEditando) {
                        setPrestamoEditando({ ...prestamoEditando, userId: e.target.value });
                      } else {
                        setNuevoPrestamo({ ...nuevoPrestamo, userId: e.target.value });
                      }
                    }}
                    className="border p-2 rounded w-full"
                    required
                  />
                  <select
                    value={prestamoEditando ? prestamoEditando.userRole : nuevoPrestamo.userRole}
                    onChange={(e) => {
                      if (prestamoEditando) {
                        setPrestamoEditando({ ...prestamoEditando, userRole: e.target.value });
                      } else {
                        setNuevoPrestamo({ ...nuevoPrestamo, userRole: e.target.value });
                      }
                    }}
                    className="border p-2 rounded w-full"
                  >
                    <option value="Estudiante">Estudiante</option>
                    <option value="Docente">Docente</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Tipo de Préstamo"
                    value={prestamoEditando ? prestamoEditando.loanDescriptionType : nuevoPrestamo.loanDescriptionType}
                    onChange={(e) => {
                      if (prestamoEditando) {
                        setPrestamoEditando({ ...prestamoEditando, loanDescriptionType: e.target.value });
                      } else {
                        setNuevoPrestamo({ ...nuevoPrestamo, loanDescriptionType: e.target.value });
                      }
                    }}
                    className="border p-2 rounded w-full"
                    required
                  />
                  <input
                    type="date"
                    value={prestamoEditando ? prestamoEditando.loanDate : nuevoPrestamo.loanDate}
                    onChange={(e) => {
                      if (prestamoEditando) {
                        setPrestamoEditando({ ...prestamoEditando, loanDate: e.target.value });
                      } else {
                        setNuevoPrestamo({ ...nuevoPrestamo, loanDate: e.target.value });
                      }
                    }}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="date"
                    value={prestamoEditando ? prestamoEditando.devolutionDate : nuevoPrestamo.devolutionDate}
                    onChange={(e) => {
                      if (prestamoEditando) {
                        setPrestamoEditando({ ...prestamoEditando, devolutionDate: e.target.value });
                      } else {
                        setNuevoPrestamo({ ...nuevoPrestamo, devolutionDate: e.target.value });
                      }
                    }}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="time"
                    value={prestamoEditando ? prestamoEditando.startTime : nuevoPrestamo.startTime}
                    onChange={(e) => {
                      if (prestamoEditando) {
                        setPrestamoEditando({ ...prestamoEditando, startTime: e.target.value });
                      } else {
                        setNuevoPrestamo({ ...nuevoPrestamo, startTime: e.target.value });
                      }
                    }}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="time"
                    value={prestamoEditando ? prestamoEditando.endTime : nuevoPrestamo.endTime}
                    onChange={(e) => {
                      if (prestamoEditando) {
                        setPrestamoEditando({ ...prestamoEditando, endTime: e.target.value });
                      } else {
                        setNuevoPrestamo({ ...nuevoPrestamo, endTime: e.target.value });
                      }
                    }}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => {
                      if (prestamoEditando) {
                        actualizarPrestamo(prestamoEditando);
                      } else {
                        agregarPrestamo();
                      }
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    {prestamoEditando ? "Guardar Cambios" : "Guardar Préstamo"}
                  </button>
                  <button
                    onClick={() => {
                      setMostrarFormulario(false);
                      setPrestamoEditando(null);
                      setError(null);
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Panel de detalles */}
            <Dialog open={!!detalle} onClose={() => setDetalle(null)} className="relative z-50">
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-lg rounded bg-white p-6">
                  <Dialog.Title className="text-lg font-bold mb-4">Detalles del Préstamo</Dialog.Title>
                  {detalle && (
                    <div className="space-y-2 text-sm">
                      <p><strong>ID:</strong> {detalle.id}</p>
                      <p><strong>Nombre Usuario:</strong> {detalle.nameUser}</p>
                      <p><strong>ID Usuario:</strong> {detalle.userId}</p>
                      <p><strong>Rol:</strong> {detalle.userRole}</p>
                      <p><strong>Tipo de Préstamo:</strong> {detalle.loanDescriptionType}</p>
                      <p><strong>Fecha Creación:</strong> {detalle.creationDate}</p>
                      <p><strong>Fecha Préstamo:</strong> {detalle.loanDate}</p>
                      <p><strong>Fecha Devolución:</strong> {detalle.devolutionDate}</p>
                      <p><strong>Hora Inicio:</strong> {detalle.startTime}</p>
                      <p><strong>Hora Fin:</strong> {detalle.endTime}</p>
                      <p><strong>Estado Préstamo:</strong> {detalle.loanStatus}</p>
                      <p><strong>Estado Equipo:</strong> {detalle.equipmentStatus}</p>
                      <p><strong>Registro Devolución:</strong> {detalle.devolutionRegister}</p>
                      <p><strong>Artículos:</strong> {detalle.articleIds.join(", ") || "Sin artículos"}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setDetalle(null)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Cerrar
                  </button>
                </Dialog.Panel>
              </div>
            </Dialog>
          </main>
        </div>
      </div>
    </Layout>
  );
}
