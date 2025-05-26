"use client";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import Layout from "@/components/Layout";
import api from "@/services/api";
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

interface ArticleStates {
  [key: number]: string;
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
  const [tipoEdicion, setTipoEdicion] = useState<"general" | "horario" | "articulos" | null>(null);
  const [estadosArticulos, setEstadosArticulos] = useState<ArticleStates>({});
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    nameUser: "",
    userId: "",
    userRole: "Estudiante",
    loanDescriptionType: "",
    loanDate: new Date().toISOString().split("T")[0],
    startTime: "08:00",
    endTime: "16:00",
    articleIds: [101] as number[],
    loanStatus: "Prestado",
    equipmentStatus: "En buen estado"
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError("No se encontró token de autenticación. Debe iniciar sesión.");
      setLoading(false);
      return;
    }
    fetchPrestamos();
  }, []);

  const fetchPrestamos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/LoanArticle");
      console.log("Respuesta del servidor:", response.data);

      let prestamosArray = [];

      if (response.data && response.data.prestamos && Array.isArray(response.data.prestamos)) {
        prestamosArray = response.data.prestamos;
      } else if (Array.isArray(response.data)) {
        prestamosArray = response.data;
      } else {
        console.warn("Formato de respuesta inesperado:", response.data);
        prestamosArray = [];
      }

      const prestamosOrdenados = prestamosArray.sort((a: Prestamo, b: Prestamo) =>
        new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
      );

      setPrestamos(prestamosOrdenados);
    } catch (err) {
      console.error("Error al obtener préstamos:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ||
                err.message ||
                "Error al cargar préstamos. Compruebe su conexión e inténtelo de nuevo.");
      } else {
        setError("Error desconocido al cargar préstamos");
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para validar formato HH:MM estricto
  const validarFormatoHora = (hora: string): boolean => {
    // Debe ser exactamente HH:MM (dos dígitos para hora, dos para minutos)
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(hora);
  };

  // Función para asegurar formato HH:MM
  const formatearHora = (hora: string): string => {
    if (!hora) return "00:00";
   
    // Si viene en formato H:MM, agregar 0 al inicio
    if (hora.length === 4 && hora.includes(':')) {
      return '0' + hora;
    }
   
    // Si viene sin minutos, agregar :00
    if (hora.length === 1 || hora.length === 2) {
      const horaNum = parseInt(hora, 10);
      if (horaNum >= 0 && horaNum <= 23) {
        return `${horaNum.toString().padStart(2, '0')}:00`;
      }
    }
   
    return hora;
  };

  const validarRangoHorario = (inicio: string, fin: string): boolean => {
    const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
    const [horaFin, minutoFin] = fin.split(':').map(Number);
   
    const tiempoInicio = horaInicio * 60 + minutoInicio;
    const tiempoFin = horaFin * 60 + minutoFin;
   
    return tiempoInicio < tiempoFin;
  };

  // Función de actualización usando los campos correctos de la API
  const actualizarPrestamo = async () => {
    if (!prestamoEditando || !tipoEdicion) {
      setError("Información insuficiente para actualizar el préstamo");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setDebugInfo("");

      let url = `/LoanArticle/${prestamoEditando.id}`;
      let data: any = {};

      // Preparar datos según el tipo de edición usando los campos correctos
      switch(tipoEdicion) {
        case "general":
          // Usar los campos válidos según el error de la API
          data = {
            equipmentStatus: prestamoEditando.equipmentStatus,
            observaciones: prestamoEditando.loanDescriptionType.trim()
          };
          break;

        case "horario":
          // Validar y formatear horas
          const startTimeFormatted = formatearHora(prestamoEditando.startTime);
          const endTimeFormatted = formatearHora(prestamoEditando.endTime);

          if (!validarFormatoHora(startTimeFormatted) || !validarFormatoHora(endTimeFormatted)) {
            setError("El formato de hora debe ser exactamente HH:MM (ej: 08:00, 14:30)");
            setLoading(false);
            return;
          }

          if (!validarRangoHorario(startTimeFormatted, endTimeFormatted)) {
            setError("La hora de inicio debe ser anterior a la hora de fin");
            setLoading(false);
            return;
          }

          // Según la documentación, usar parámetros de consulta para horario
          url = `/LoanArticle/${prestamoEditando.id}?startTime=${encodeURIComponent(startTimeFormatted)}&endTime=${encodeURIComponent(endTimeFormatted)}`;
          data = {
            observaciones: prestamoEditando.loanDescriptionType.trim()
          };
          break;

        case "articulos":
          if (Object.keys(estadosArticulos).length === 0) {
            setError("Debe especificar el estado de al menos un artículo");
            setLoading(false);
            return;
          }

          // Usar el campo correcto para artículos
          data = {
            articulo_estado: estadosArticulos
          };
          break;
      }

      // Debugging
      const debugInfo = {
        prestamoId: prestamoEditando.id,
        tipoEdicion,
        url,
        data,
        camposValidos: ["observaciones", "fecha_devolucion", "equipmentStatus", "estado", "articulo_estado"]
      };

      console.log("=== DEBUG ACTUALIZACIÓN (CORREGIDA) ===");
      console.log(JSON.stringify(debugInfo, null, 2));
      console.log("=====================================");

      setDebugInfo(JSON.stringify(debugInfo, null, 2));

      // Realizar la petición
      const response = await api.put(url, data);
      console.log("✅ Respuesta exitosa:", response.data);

      fetchPrestamos();
      setPrestamoEditando(null);
      setTipoEdicion(null);
      setEstadosArticulos({});
      setMostrarFormulario(false);

    } catch (err) {
      console.error("❌ Error al actualizar préstamo:", err);
     
      if (axios.isAxiosError(err)) {
        const errorDetails = {
          status: err.response?.status,
          statusText: err.response?.statusText,
          url: err.config?.url,
          method: err.config?.method,
          requestData: err.config?.data,
          responseData: err.response?.data,
        };

        console.log("=== ERROR DETAILS ===");
        console.log(JSON.stringify(errorDetails, null, 2));
        console.log("===================");

        let errorMessage = "Error al actualizar el préstamo";
       
        if (err.response?.status === 400) {
          const errorData = err.response.data;
         
          if (errorData?.Message) {
            errorMessage = errorData.Message;
          } else if (errorData?.Error) {
            errorMessage = errorData.Error;
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          } else {
            errorMessage = `Error 400: ${JSON.stringify(errorData)}`;
          }
        } else {
          errorMessage = err.response?.data?.message || err.message || "Error de servidor";
        }

        setError(errorMessage);
      } else {
        setError("Error desconocido al actualizar el préstamo");
      }
    } finally {
      setLoading(false);
    }
  };

  const devolverPrestamo = async (id: string) => {
    if (!window.confirm("¿Está seguro que desea marcar este préstamo como devuelto?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("=== DEVOLVER PRÉSTAMO ===");
      console.log("ID:", id);
      console.log("Datos a enviar:", { devolver: true });

      const response = await api.put(`/LoanArticle/${id}`, { devolver: true });
     
      console.log("✅ Préstamo devuelto exitosamente:", response.data);

      fetchPrestamos();
      setDetalle(null);

    } catch (err) {
      console.error("❌ Error al devolver préstamo:", err);
      if (axios.isAxiosError(err)) {
        console.log("Error response:", err.response?.data);
        const errorMessage = err.response?.data?.message ||
                           err.response?.data?.Error ||
                           "Error al devolver el préstamo";
        setError(errorMessage);
      } else {
        setError("Error desconocido al devolver el préstamo");
      }
    } finally {
      setLoading(false);
    }
  };

  const agregarPrestamo = async () => {
    try {
      setLoading(true);
      setError(null);

      const camposRequeridos = ["nameUser", "userId", "userRole", "loanDescriptionType", "loanDate", "articleIds"];

      const campoFaltante = camposRequeridos.find(campo => {
        const valor = nuevoPrestamo[campo as keyof typeof nuevoPrestamo];
        return !valor || (Array.isArray(valor) && valor.length === 0);
      });

      if (campoFaltante) {
        setError(`El campo ${campoFaltante} es obligatorio`);
        setLoading(false);
        return;
      }

      // Formatear horas
      const startTimeFormatted = formatearHora(nuevoPrestamo.startTime);
      const endTimeFormatted = formatearHora(nuevoPrestamo.endTime);

      if (!validarFormatoHora(startTimeFormatted) || !validarFormatoHora(endTimeFormatted)) {
        setError("El formato de hora debe ser exactamente HH:MM (ej: 08:00, 14:30)");
        setLoading(false);
        return;
      }

      if (!validarRangoHorario(startTimeFormatted, endTimeFormatted)) {
        setError("La hora de inicio debe ser anterior a la hora de fin");
        setLoading(false);
        return;
      }

      const prestamoData = {
        articleIds: nuevoPrestamo.articleIds,
        nameUser: nuevoPrestamo.nameUser,
        userId: nuevoPrestamo.userId,
        userRole: nuevoPrestamo.userRole,
        loanDescriptionType: nuevoPrestamo.loanDescriptionType,
        loanDate: nuevoPrestamo.loanDate,
        loanStatus: nuevoPrestamo.loanStatus,
        equipmentStatus: nuevoPrestamo.equipmentStatus
      };

      console.log("Datos a enviar:", prestamoData);
      console.log("Horario:", startTimeFormatted, endTimeFormatted);

      const response = await api.post(
        `/LoanArticle?startTime=${startTimeFormatted}&endTime=${endTimeFormatted}`,
        prestamoData
      );

      console.log("Préstamo creado:", response.data);
      fetchPrestamos();
      setMostrarFormulario(false);

      setNuevoPrestamo({
        nameUser: "",
        userId: "",
        userRole: "Estudiante",
        loanDescriptionType: "",
        loanDate: new Date().toISOString().split("T")[0],
        startTime: "08:00",
        endTime: "16:00",
        articleIds: [101],
        loanStatus: "Prestado",
        equipmentStatus: "En buen estado"
      });

    } catch (err) {
      console.error("Error al crear préstamo:", err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message ||
                             err.response?.data?.Error ||
                             err.response?.data?.error ||
                             "Error al crear el préstamo";
        setError(`Error al crear préstamo: ${errorMessage}`);
      } else {
        setError("Error desconocido al crear el préstamo");
      }
    } finally {
      setLoading(false);
    }
  };

  const eliminarPrestamo = async (id: string) => {
    if (!window.confirm("¿Está seguro que desea eliminar este préstamo? Esta acción es irreversible.")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.delete(`/LoanArticle/${id}`);
      fetchPrestamos();

    } catch (err) {
      console.error("Error al eliminar préstamo:", err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message ||
                             err.response?.data?.Error ||
                             "Error al eliminar el préstamo";
        setError(errorMessage);
      } else {
        setError("Error desconocido al eliminar el préstamo");
      }
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicion = (prestamo: Prestamo, tipo: "general" | "horario" | "articulos") => {
    if (prestamo.loanStatus === "Devuelto") {
      setError("No se puede modificar un préstamo ya devuelto");
      return;
    }

    setPrestamoEditando({...prestamo});
    setTipoEdicion(tipo);
    setMostrarFormulario(true);

    if (tipo === "articulos" && prestamo.articleIds.length > 0) {
      const estadosIniciales: ArticleStates = {};
      prestamo.articleIds.forEach(id => {
        estadosIniciales[id] = prestamo.equipmentStatus || "En buen estado";
      });
      setEstadosArticulos(estadosIniciales);
    } else {
      setEstadosArticulos({});
    }
  };

  const filteredPrestamos = prestamos
    .filter(p => {
      if (filtro === "activos") return p.loanStatus === "Prestado";
      if (filtro === "historial") return p.loanStatus === "Devuelto";
      return true;
    })
    .filter(p =>
      p.nameUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Layout>
      <div className="flex min-h-screen">
        <div className="flex flex-col flex-grow">
          <main className="flex-grow p-8">
            <h1 className="text-3xl font-bold mb-6">Gestión de Préstamos</h1>

            

            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
                <button
                  className="absolute top-1 right-1 text-red-500"
                  onClick={() => setError(null)}
                >
                  &times;
                </button>
                <div className="whitespace-pre-wrap">
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}

            

            {/* Indicador de carga */}
            {loading && (
              <div className="mb-4 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                <span>Cargando...</span>
              </div>
            )}

            {/* Filtros y búsqueda */}
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

            {/* Barra de búsqueda */}
            <div className="mb-6 flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Buscar por usuario, ID o identificación"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border p-2 rounded w-full pl-10"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => fetchPrestamos()}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Actualizar
              </button>
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
                  {filteredPrestamos.length > 0 ? (
                    filteredPrestamos.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border text-xs">{p.id}</td>
                        <td className="px-4 py-2 border">{p.nameUser}</td>
                        <td className="px-4 py-2 border">{p.loanDate}</td>
                        <td className="px-4 py-2 border">{p.devolutionDate}</td>
                        <td className="px-4 py-2 border">
                          <span className={`px-2 py-1 rounded text-xs ${
                            p.loanStatus === "Prestado" ? "bg-blue-100 text-blue-800" :
                            p.loanStatus === "Vencido" ? "bg-red-100 text-red-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {p.loanStatus}
                          </span>
                        </td>
                        <td className="px-4 py-2 border">
                          <div className="space-y-1">
                            <button
                              onClick={() => setDetalle(p)}
                              className="text-blue-600 hover:underline block w-full text-left text-xs"
                            >
                              Ver Detalles
                            </button>

                            {/* Opciones de edición para préstamos activos */}
                            {p.loanStatus === "Prestado" && (
                              <>
                                <div className="space-y-1">
                                  <button
                                    onClick={() => iniciarEdicion(p, "general")}
                                    className="text-green-600 hover:underline block w-full text-left text-xs"
                                  >
                                    Editar Info
                                  </button>
                                  
                                </div>

                                <button
                                  onClick={() => devolverPrestamo(p.id)}
                                  className="text-purple-600 hover:underline block w-full text-left text-xs"
                                >
                                  Devolver
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => eliminarPrestamo(p.id)}
                              className={`text-red-600 hover:underline block w-full text-left text-xs ${
                                p.loanStatus !== "Prestado" ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              disabled={p.loanStatus !== "Prestado"}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500">
                        {searchTerm ? 'No se encontraron préstamos que coincidan con la búsqueda' : 'No hay préstamos para mostrar'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Botón para mostrar formulario de nuevo préstamo */}
            <div className="mt-6">
              {!mostrarFormulario && !prestamoEditando && (
                <button
                  onClick={() => {
                    setMostrarFormulario(true);
                    setPrestamoEditando(null);
                    setTipoEdicion(null);
                    setNuevoPrestamo({
                      nameUser: "",
                      userId: "",
                      userRole: "Estudiante",
                      loanDescriptionType: "",
                      loanDate: new Date().toISOString().split("T")[0],
                      startTime: "08:00",
                      endTime: "16:00",
                      articleIds: [101],
                      loanStatus: "Prestado",
                      equipmentStatus: "En buen estado"
                    });
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Crear Nuevo Préstamo
                </button>
              )}
            </div>

            {/* Formulario de creación */}
            {mostrarFormulario && !prestamoEditando && (
              <div className="mt-6 p-6 border rounded bg-gray-50 max-w-4xl">
                <h2 className="text-xl font-bold mb-4">Nuevo Préstamo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del Usuario</label>
                    <input
                      type="text"
                      value={nuevoPrestamo.nameUser}
                      onChange={(e) => {
                        setNuevoPrestamo({ ...nuevoPrestamo, nameUser: e.target.value });
                      }}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">ID del Usuario</label>
                    <input
                      type="text"
                      placeholder="Ej: U-12345"
                      value={nuevoPrestamo.userId}
                      onChange={(e) => {
                        setNuevoPrestamo({ ...nuevoPrestamo, userId: e.target.value });
                      }}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Rol del Usuario</label>
                    <select
                      value={nuevoPrestamo.userRole}
                      onChange={(e) => {
                        setNuevoPrestamo({ ...nuevoPrestamo, userRole: e.target.value });
                      }}
                      className="border p-2 rounded w-full"
                    >
                      <option value="Estudiante">Estudiante</option>
                      <option value="Docente">Docente</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Préstamo</label>
                    <input
                      type="text"
                      placeholder="Ej: Clase deportiva"
                      value={nuevoPrestamo.loanDescriptionType}
                      onChange={(e) => {
                        setNuevoPrestamo({ ...nuevoPrestamo, loanDescriptionType: e.target.value });
                      }}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de Préstamo</label>
                    <input
                      type="date"
                      value={nuevoPrestamo.loanDate}
                      onChange={(e) => {
                        setNuevoPrestamo({ ...nuevoPrestamo, loanDate: e.target.value });
                      }}
                      className="border p-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Hora de Inicio (HH:MM)</label>
                    <input
                      type="time"
                      value={nuevoPrestamo.startTime}
                      onChange={(e) => {
                        setNuevoPrestamo({ ...nuevoPrestamo, startTime: e.target.value });
                      }}
                      className="border p-2 rounded w-full"
                      step="3600" // Solo permite horas completas
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formato: HH:MM (ej: 08:00, 14:00)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Hora de Fin (HH:MM)</label>
                    <input
                      type="time"
                      value={nuevoPrestamo.endTime}
                      onChange={(e) => {
                        setNuevoPrestamo({ ...nuevoPrestamo, endTime: e.target.value });
                      }}
                      className="border p-2 rounded w-full"
                      step="3600" // Solo permite horas completas
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formato: HH:MM (ej: 16:00, 20:00)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">ID de Artículo</label>
                    <input
                      type="number"
                      placeholder="Ej: 101"
                      value={nuevoPrestamo.articleIds[0] || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        setNuevoPrestamo({
                          ...nuevoPrestamo,
                          articleIds: isNaN(value) ? [] : [value]
                        });
                      }}
                      className="border p-2 rounded w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Debe ingresar al menos un ID de artículo
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={agregarPrestamo}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : "Guardar Préstamo"}
                  </button>
                  <button
                    onClick={() => {
                      setMostrarFormulario(false);
                      setError(null);
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Formulario de edición */}
            {mostrarFormulario && prestamoEditando && tipoEdicion && (
              <div className="mt-6 p-6 border rounded bg-gray-50 max-w-4xl">
                <h2 className="text-xl font-bold mb-4">
                  {tipoEdicion === "general" && "Editar Información General"}
                  {tipoEdicion === "horario" && "Actualizar Horario"}
                  {tipoEdicion === "articulos" && "Actualizar Estado de Artículos"}
                </h2>

                {/* Información del préstamo */}
                <div className="mb-4 p-3 bg-blue-50 border rounded">
                  <p><strong>Préstamo:</strong> {prestamoEditando.id}</p>
                  <p><strong>Usuario:</strong> {prestamoEditando.nameUser}</p>
                  <p><strong>Estado actual:</strong> {prestamoEditando.loanStatus}</p>
                </div>

                {/* Edición de información general */}
                {tipoEdicion === "general" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Observaciones</label>
                      <textarea
                        value={prestamoEditando.loanDescriptionType}
                        onChange={(e) => {
                          setPrestamoEditando({
                            ...prestamoEditando,
                            loanDescriptionType: e.target.value
                          });
                        }}
                        className="border p-2 rounded w-full"
                        rows={3}
                        placeholder="Ej: Clase de baloncesto actualizada"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Campo: observaciones (según API)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Estado del Equipo</label>
                      <select
                        value={prestamoEditando.equipmentStatus}
                        onChange={(e) => {
                          setPrestamoEditando({
                            ...prestamoEditando,
                            equipmentStatus: e.target.value
                          });
                        }}
                        className="border p-2 rounded w-full"
                      >
                        <option value="En buen estado">En buen estado</option>
                        <option value="Dañado">Dañado</option>
                        <option value="Requiere mantenimiento">Requiere mantenimiento</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Campo: equipmentStatus (según API)
                      </p>
                    </div>
                  </div>
                )}

                {/* Edición de horario */}
                {tipoEdicion === "horario" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Hora de Inicio (HH:MM)</label>
                      <input
                        type="time"
                        value={prestamoEditando.startTime}
                        onChange={(e) => {
                          setPrestamoEditando({
                            ...prestamoEditando,
                            startTime: e.target.value
                          });
                        }}
                        className="border p-2 rounded w-full"
                        step="3600"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Formato requerido: HH:MM (ej: 08:00)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Hora de Fin (HH:MM)</label>
                      <input
                        type="time"
                        value={prestamoEditando.endTime}
                        onChange={(e) => {
                          setPrestamoEditando({
                            ...prestamoEditando,
                            endTime: e.target.value
                          });
                        }}
                        className="border p-2 rounded w-full"
                        step="3600"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Formato requerido: HH:MM (ej: 16:00)
                      </p>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Observaciones</label>
                      <textarea
                        value={prestamoEditando.loanDescriptionType}
                        onChange={(e) => {
                          setPrestamoEditando({
                            ...prestamoEditando,
                            loanDescriptionType: e.target.value
                          });
                        }}
                        className="border p-2 rounded w-full"
                        rows={2}
                        placeholder="Ej: Clase de baloncesto con horario actualizado"
                      />
                    </div>
                  </div>
                )}

                {/* Edición de estados de artículos */}
                {tipoEdicion === "articulos" && (
                  <div>
                    <h3 className="font-medium mb-2">Artículos del Préstamo</h3>
                    <div className="space-y-3">
                      {prestamoEditando.articleIds.map(id => (
                        <div key={id} className="flex items-center gap-3">
                          <span className="font-medium">Artículo #{id}:</span>
                          <select
                            value={estadosArticulos[id] || "En buen estado"}
                            onChange={(e) => {
                              setEstadosArticulos({
                                ...estadosArticulos,
                                [id]: e.target.value
                              });
                            }}
                            className="border p-2 rounded"
                          >
                            <option value="En buen estado">En buen estado</option>
                            <option value="Dañado">Dañado</option>
                            <option value="Requiere mantenimiento">Requiere mantenimiento</option>
                          </select>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Campo: articulo_estado (según API)
                    </p>
                  </div>
                )}

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={actualizarPrestamo}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                  <button
                    onClick={() => {
                      setMostrarFormulario(false);
                      setPrestamoEditando(null);
                      setTipoEdicion(null);
                      setEstadosArticulos({});
                      setError(null);
                      setDebugInfo("");
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Modal de detalles */}
            <Dialog open={!!detalle} onClose={() => setDetalle(null)} className="relative z-50">
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-lg rounded bg-white p-6">
                  <Dialog.Title className="text-lg font-bold mb-4 flex justify-between items-center">
                    <span>Detalles del Préstamo</span>
                    <button
                      onClick={() => setDetalle(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </Dialog.Title>
                  {detalle && (
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold">ID:</p>
                          <p className="text-xs">{detalle.id}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Nombre Usuario:</p>
                          <p>{detalle.nameUser}</p>
                        </div>
                        <div>
                          <p className="font-semibold">ID Usuario:</p>
                          <p>{detalle.userId}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Rol:</p>
                          <p>{detalle.userRole}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Tipo de Préstamo:</p>
                          <p>{detalle.loanDescriptionType}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Fecha Creación:</p>
                          <p>{new Date(detalle.creationDate).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Fecha Préstamo:</p>
                          <p>{detalle.loanDate}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Fecha Devolución:</p>
                          <p>{detalle.devolutionDate}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Hora Inicio:</p>
                          <p>{detalle.startTime}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Hora Fin:</p>
                          <p>{detalle.endTime}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Estado Préstamo:</p>
                          <p>{detalle.loanStatus}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Estado Equipo:</p>
                          <p>{detalle.equipmentStatus}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="font-semibold">IDs de Artículos:</p>
                        <p>{detalle.articleIds.length > 0 ? detalle.articleIds.join(", ") : "Sin artículos"}</p>
                      </div>

                      {detalle.devolutionRegister && (
                        <div className="mt-4">
                          <p className="font-semibold">Registro de Devolución:</p>
                          <div className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
                            {detalle.devolutionRegister}
                          </div>
                        </div>
                      )}

                      {/* Acciones dentro del modal */}
                      {detalle.loanStatus === "Prestado" && (
                        <div className="mt-6 flex gap-4">
                          <button
                            onClick={() => {
                              setDetalle(null);
                              devolverPrestamo(detalle.id);
                            }}
                            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex-1"
                          >
                            Devolver Préstamo
                          </button>
                          <button
                            onClick={() => {
                              setDetalle(null);
                              iniciarEdicion(detalle, "general");
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1"
                          >
                            Editar Préstamo
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => setDetalle(null)}
                    className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 w-full"
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