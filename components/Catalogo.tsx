"use client";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import Layout from "@/components/Layout";
import api from "@/services/api";
import axios from "axios";

interface Catalogo {
  id: string;
  name: string;
  description: string;
  category: string;
  availability: "Disponible" | "No disponible" | "En mantenimiento";
  location: string;
  quantity: number;
  specifications: string;
  creationDate: string;
  lastUpdate: string;
  createdBy: string;
  imageUrl?: string;
}

interface UserRole {
  role: "student" | "teacher";
  userId: string;
  userName: string;
}

export default function CatalogosPage() {
  const [catalogos, setCatalogos] = useState<Catalogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<"todos" | "disponibles" | "mantenimiento">("todos");
  const [detalle, setDetalle] = useState<Catalogo | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas");
  const [catalogoEditando, setCatalogoEditando] = useState<Catalogo | null>(null);

  // Estado específico para roles
  const [userRole, setUserRole] = useState<UserRole>({
    role: "student", // Por defecto
    userId: "",
    userName: ""
  });

  const [nuevoCatalogo, setNuevoCatalogo] = useState({
    name: "",
    description: "",
    category: "Deportes",
    availability: "Disponible" as const,
    location: "",
    quantity: 1,
    specifications: "",
    imageUrl: ""
  });

  // Categorías disponibles
  const categorias = [
    "Deportes",
    "Tecnología",
    "Laboratorio",
    "Biblioteca",
    "Audiovisual",
    "Mobiliario",
    "Otros"
  ];

  useEffect(() => {
    // Obtener rol del usuario desde sessionStorage o contexto
    const token = sessionStorage.getItem('token');
    const storedRole = sessionStorage.getItem('userRole') as "student" | "teacher";
    const storedUserId = sessionStorage.getItem('userId');
    const storedUserName = sessionStorage.getItem('userName');

    if (!token) {
      setError("No se encontró token de autenticación. Debe iniciar sesión.");
      setLoading(false);
      return;
    }

    setUserRole({
      role: storedRole || "student",
      userId: storedUserId || "",
      userName: storedUserName || ""
    });

    fetchCatalogos();
  }, []);

  const fetchCatalogos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Endpoint adaptado para catálogos
      const response = await api.get("/Catalog");
      console.log("Respuesta del servidor:", response.data);

      let catalogosArray = [];

      if (response.data && response.data.catalogos && Array.isArray(response.data.catalogos)) {
        catalogosArray = response.data.catalogos;
      } else if (Array.isArray(response.data)) {
        catalogosArray = response.data;
      } else {
        console.warn("Formato de respuesta inesperado:", response.data);
        catalogosArray = [];
      }

      const catalogosOrdenados = catalogosArray.sort((a: Catalogo, b: Catalogo) =>
        new Date(b.lastUpdate || b.creationDate).getTime() -
        new Date(a.lastUpdate || a.creationDate).getTime()
      );

      setCatalogos(catalogosOrdenados);
    } catch (err) {
      console.error("Error al obtener catálogos:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ||
                err.message ||
                "Error al cargar catálogos. Compruebe su conexión e inténtelo de nuevo.");
      } else {
        setError("Error desconocido al cargar catálogos");
      }
    } finally {
      setLoading(false);
    }
  };

  const agregarCatalogo = async () => {
    // Solo los teachers pueden agregar elementos al catálogo
    if (userRole.role !== "teacher") {
      setError("Solo los profesores pueden agregar elementos al catálogo");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const camposRequeridos = ["name", "description", "category", "location"];

      const campoFaltante = camposRequeridos.find(campo => {
        const valor = nuevoCatalogo[campo as keyof typeof nuevoCatalogo];
        return !valor || (typeof valor === 'string' && valor.trim() === '');
      });

      if (campoFaltante) {
        setError(`El campo ${campoFaltante} es obligatorio`);
        setLoading(false);
        return;
      }

      const catalogoData = {
        ...nuevoCatalogo,
        createdBy: userRole.userName || userRole.userId,
        creationDate: new Date().toISOString(),
        lastUpdate: new Date().toISOString()
      };

      console.log("Datos a enviar:", catalogoData);

      const response = await api.post("/Catalog", catalogoData);

      console.log("Catálogo creado:", response.data);
      fetchCatalogos();
      setMostrarFormulario(false);

      setNuevoCatalogo({
        name: "",
        description: "",
        category: "Deportes",
        availability: "Disponible",
        location: "",
        quantity: 1,
        specifications: "",
        imageUrl: ""
      });

    } catch (err) {
      console.error("Error al crear catálogo:", err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message ||
                             err.response?.data?.Error ||
                             err.response?.data?.error ||
                             "Error al crear el elemento del catálogo";
        setError(`Error al crear catálogo: ${errorMessage}`);
      } else {
        setError("Error desconocido al crear el catálogo");
      }
    } finally {
      setLoading(false);
    }
  };

  const actualizarCatalogo = async () => {
    // Solo los teachers pueden editar elementos del catálogo
    if (userRole.role !== "teacher") {
      setError("Solo los profesores pueden editar elementos del catálogo");
      return;
    }

    if (!catalogoEditando) {
      setError("No se ha seleccionado un catálogo para editar");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = {
        ...catalogoEditando,
        lastUpdate: new Date().toISOString()
      };

      console.log("Actualizando catálogo:", data);

      const response = await api.put(`/Catalog/${catalogoEditando.id}`, data);
      console.log("✅ Catálogo actualizado:", response.data);

      fetchCatalogos();
      setCatalogoEditando(null);
      setMostrarFormulario(false);

    } catch (err) {
      console.error("❌ Error al actualizar catálogo:", err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message ||
                             err.response?.data?.Error ||
                             "Error al actualizar el catálogo";
        setError(errorMessage);
      } else {
        setError("Error desconocido al actualizar el catálogo");
      }
    } finally {
      setLoading(false);
    }
  };

  const eliminarCatalogo = async (id: string) => {
    // Solo los teachers pueden eliminar elementos del catálogo
    if (userRole.role !== "teacher") {
      setError("Solo los profesores pueden eliminar elementos del catálogo");
      return;
    }

    if (!window.confirm("¿Está seguro que desea eliminar este elemento del catálogo? Esta acción es irreversible.")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.delete(`/Catalog/${id}`);
      fetchCatalogos();

    } catch (err) {
      console.error("Error al eliminar catálogo:", err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message ||
                             err.response?.data?.Error ||
                             "Error al eliminar el elemento del catálogo";
        setError(errorMessage);
      } else {
        setError("Error desconocido al eliminar el catálogo");
      }
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicion = (catalogo: Catalogo) => {
    if (userRole.role !== "teacher") {
      setError("Solo los profesores pueden editar elementos del catálogo");
      return;
    }

    setCatalogoEditando({...catalogo});
    setMostrarFormulario(true);
  };

  // Función para solicitar un elemento (solo para students)
  const solicitarElemento = async (catalogoId: string) => {
    if (userRole.role !== "student") {
      setError("Esta función está disponible solo para estudiantes");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const solicitudData = {
        catalogItemId: catalogoId,
        studentId: userRole.userId,
        studentName: userRole.userName,
        requestDate: new Date().toISOString(),
        status: "Pendiente"
      };

      const response = await api.post("/CatalogRequest", solicitudData);
      console.log("Solicitud creada:", response.data);

      alert("Solicitud enviada exitosamente. Un profesor revisará su solicitud.");

    } catch (err) {
      console.error("Error al solicitar elemento:", err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message ||
                             "Error al enviar la solicitud";
        setError(errorMessage);
      } else {
        setError("Error desconocido al enviar la solicitud");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredCatalogos = catalogos
    .filter(c => {
      if (filtro === "disponibles") return c.availability === "Disponible";
      if (filtro === "mantenimiento") return c.availability === "En mantenimiento";
      return true;
    })
    .filter(c =>
      categoriaFiltro === "todas" || c.category === categoriaFiltro
    )
    .filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Layout>
      <div className="flex min-h-screen">
        <div className="flex flex-col flex-grow">
          <main className="flex-grow p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Catálogo de Recursos</h1>

              {/* Indicador de rol */}
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userRole.role === "teacher"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}>
                  {userRole.role === "teacher" ? "👨‍🏫 Profesor" : "👨‍🎓 Estudiante"}
                </div>
                <span className="text-sm text-gray-600">
                  {userRole.userName || userRole.userId}
                </span>
              </div>
            </div>

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
                onClick={() => setFiltro("todos")}
                className={`px-4 py-2 rounded text-white ${filtro === "todos" ? "bg-blue-600" : "bg-gray-400"}`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltro("disponibles")}
                className={`px-4 py-2 rounded text-white ${filtro === "disponibles" ? "bg-green-600" : "bg-gray-400"}`}
              >
                Disponibles
              </button>
              <button
                onClick={() => setFiltro("mantenimiento")}
                className={`px-4 py-2 rounded text-white ${filtro === "mantenimiento" ? "bg-yellow-600" : "bg-gray-400"}`}
              >
                En Mantenimiento
              </button>

              {/* Filtro por categoría */}
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6 flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Buscar por nombre, descripción o categoría"
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
                onClick={() => fetchCatalogos()}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Actualizar
              </button>
            </div>

            {/* Grid de catálogos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {filteredCatalogos.length > 0 ? (
                filteredCatalogos.map((catalogo) => (
                  <div key={catalogo.id} className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow">
                    {/* Imagen del elemento */}
                    {catalogo.imageUrl ? (
                      <img
                        src={catalogo.imageUrl}
                        alt={catalogo.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{catalogo.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          catalogo.availability === "Disponible" ? "bg-green-100 text-green-800" :
                          catalogo.availability === "En mantenimiento" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {catalogo.availability}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{catalogo.description}</p>

                      <div className="space-y-1 text-xs text-gray-500 mb-3">
                        <p><strong>Categoría:</strong> {catalogo.category}</p>
                        <p><strong>Ubicación:</strong> {catalogo.location}</p>
                        <p><strong>Cantidad:</strong> {catalogo.quantity}</p>
                      </div>

                      {/* Acciones específicas por rol */}
                      <div className="space-y-2">
                        <button
                          onClick={() => setDetalle(catalogo)}
                          className="w-full text-blue-600 hover:underline text-sm"
                        >
                          Ver Detalles
                        </button>

                        {userRole.role === "student" && catalogo.availability === "Disponible" && (
                          <button
                            onClick={() => solicitarElemento(catalogo.id)}
                            className="w-full bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Solicitar Elemento
                          </button>
                        )}

                        {userRole.role === "teacher" && (
                          <div className="space-y-1">
                            <button
                              onClick={() => iniciarEdicion(catalogo)}
                              className="w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => eliminarCatalogo(catalogo.id)}
                              className="w-full bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  {searchTerm ? 'No se encontraron elementos que coincidan con la búsqueda' : 'No hay elementos en el catálogo'}
                </div>
              )}
            </div>

            {/* Botón para agregar nuevo elemento (solo para teachers) */}
            {userRole.role === "teacher" && !mostrarFormulario && !catalogoEditando && (
              <div className="mt-6">
                <button
                  onClick={() => {
                    setMostrarFormulario(true);
                    setCatalogoEditando(null);
                    setNuevoCatalogo({
                      name: "",
                      description: "",
                      category: "Deportes",
                      availability: "Disponible",
                      location: "",
                      quantity: 1,
                      specifications: "",
                      imageUrl: ""
                    });
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Agregar Nuevo Elemento
                </button>
              </div>
            )}

            {/* Formulario de creación/edición */}
            {mostrarFormulario && userRole.role === "teacher" && (
              <div className="mt-6 p-6 border rounded bg-gray-50 max-w-4xl">
                <h2 className="text-xl font-bold mb-4">
                  {catalogoEditando ? "Editar Elemento" : "Nuevo Elemento del Catálogo"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre del Elemento</label>
                    <input
                      type="text"
                      value={catalogoEditando ? catalogoEditando.name : nuevoCatalogo.name}
                      onChange={(e) => {
                        if (catalogoEditando) {
                          setCatalogoEditando({ ...catalogoEditando, name: e.target.value });
                        } else {
                          setNuevoCatalogo({ ...nuevoCatalogo, name: e.target.value });
                        }
                      }}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Categoría</label>
                    <select
                      value={catalogoEditando ? catalogoEditando.category : nuevoCatalogo.category}
                      onChange={(e) => {
                        if (catalogoEditando) {
                          setCatalogoEditando({ ...catalogoEditando, category: e.target.value });
                        } else {
                          setNuevoCatalogo({ ...nuevoCatalogo, category: e.target.value });
                        }
                      }}
                      className="border p-2 rounded w-full"
                    >
                      {categorias.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <textarea
                      value={catalogoEditando ? catalogoEditando.description : nuevoCatalogo.description}
                      onChange={(e) => {
                        if (catalogoEditando) {
                          setCatalogoEditando({ ...catalogoEditando, description: e.target.value });
                        } else {
                          setNuevoCatalogo({ ...nuevoCatalogo, description: e.target.value });
                        }
                      }}
                      className="border p-2 rounded w-full"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Ubicación</label>
                    <input
                      type="text"
                      value={catalogoEditando ? catalogoEditando.location : nuevoCatalogo.location}
                      onChange={(e) => {
                        if (catalogoEditando) {
                          setCatalogoEditando({ ...catalogoEditando, location: e.target.value });
                        } else {
                          setNuevoCatalogo({ ...nuevoCatalogo, location: e.target.value });
                        }
                      }}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Cantidad</label>
                    <input
                      type="number"
                      min="0"
                      value={catalogoEditando ? catalogoEditando.quantity : nuevoCatalogo.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (catalogoEditando) {
                          setCatalogoEditando({ ...catalogoEditando, quantity: value });
                        } else {
                          setNuevoCatalogo({ ...nuevoCatalogo, quantity: value });
                        }
                      }}
                      className="border p-2 rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Disponibilidad</label>
                    <select
                      value={catalogoEditando ? catalogoEditando.availability : nuevoCatalogo.availability}
                      onChange={(e) => {
                        const value = e.target.value as "Disponible" | "No disponible" | "En mantenimiento";
                        if (catalogoEditando) {
                          setCatalogoEditando({ ...catalogoEditando, availability: value });
                        } else {
                          setNuevoCatalogo({ ...nuevoCatalogo});
                        }
                      }}
                      className="border p-2 rounded w-full"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="No disponible">No disponible</option>
                      <option value="En mantenimiento">En mantenimiento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">URL de Imagen (opcional)</label>
                    <input
                      type="url"
                      value={catalogoEditando ? catalogoEditando.imageUrl || "" : nuevoCatalogo.imageUrl}
                      onChange={(e) => {
                        if (catalogoEditando) {
                          setCatalogoEditando({ ...catalogoEditando, imageUrl: e.target.value });
                        } else {
                          setNuevoCatalogo({ ...nuevoCatalogo, imageUrl: e.target.value });
                        }
                      }}
                      className="border p-2 rounded w-full"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Especificaciones Técnicas</label>
                    <textarea
                      value={catalogoEditando ? catalogoEditando.specifications : nuevoCatalogo.specifications}
                      onChange={(e) => {
                        if (catalogoEditando) {
                          setCatalogoEditando({ ...catalogoEditando, specifications: e.target.value });
                        } else {
                          setNuevoCatalogo({ ...nuevoCatalogo, specifications: e.target.value });
                        }
                      }}
                      className="border p-2 rounded w-full"
                      rows={2}
                      placeholder="Detalles técnicos, dimensiones, etc."
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={catalogoEditando ? actualizarCatalogo : agregarCatalogo}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : (catalogoEditando ? "Actualizar" : "Guardar")}
                  </button>
                  <button
                    onClick={() => {
                      setMostrarFormulario(false);
                      setCatalogoEditando(null);
                      setError(null);
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
                <Dialog.Panel className="mx-auto max-w-2xl rounded bg-white p-6 max-h-[90vh] overflow-y-auto">
                  <Dialog.Title className="text-lg font-bold mb-4 flex justify-between items-center">
                    <span>Detalles del Elemento</span>
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
                    <div className="space-y-4">
                      {/* Imagen */}
                      {detalle.imageUrl && (
                        <div className="w-full">
                          <img
                            src={detalle.imageUrl}
                            alt={detalle.name}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold">Nombre:</p>
                          <p>{detalle.name}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Categoría:</p>
                          <p>{detalle.category}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Disponibilidad:</p>
                          <span className={`px-2 py-1 rounded text-xs ${
                            detalle.availability === "Disponible" ? "bg-green-100 text-green-800" :
                            detalle.availability === "En mantenimiento" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {detalle.availability}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">Ubicación:</p>
                          <p>{detalle.location}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Cantidad:</p>
                          <p>{detalle.quantity}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Creado por:</p>
                          <p>{detalle.createdBy}</p>
                        </div>
                      </div>

                      <div>
                        <p className="font-semibold">Descripción:</p>
                        <p className="bg-gray-50 p-3 rounded">{detalle.description}</p>
                      </div>

                      {detalle.specifications && (
                        <div>
                          <p className="font-semibold">Especificaciones:</p>
                          <p className="bg-gray-50 p-3 rounded whitespace-pre-wrap">{detalle.specifications}</p>
                        </div>
                      )}

                      {/* Acciones específicas por rol */}
                      <div className="flex gap-4 pt-4">
                        {userRole.role === "student" && detalle.availability === "Disponible" && (
                          <button
                            onClick={() => {
                              setDetalle(null);
                              solicitarElemento(detalle.id);
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex-1"
                          >
                            Solicitar Elemento
                          </button>
                        )}

                        {userRole.role === "teacher" && (
                          <button
                            onClick={() => {
                              setDetalle(null);
                              iniciarEdicion(detalle);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1"
                          >
                            Editar Elemento
                          </button>
                        )}
                      </div>
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