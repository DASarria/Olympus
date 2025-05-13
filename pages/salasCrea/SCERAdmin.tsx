import { useEffect, useState } from "react";
import Image from "next/image";
import uno from "../../assets/images/uno.webp";
import jenga from "../../assets/images/jenga.webp";
import ajedrez from "../../assets/images/Ajedrez.jpg";
import cranium from "../../assets/images/cranium.webp";
import defaultImage from "../../assets/images/1imagen.jpg";
import Swal from "sweetalert2";

const imagenesPorNombre: Record<string, string> = {
  Uno: uno.src,
  Jenga: jenga.src,
  Ajedrez: ajedrez.src,
  Cranium: cranium.src,
};

const SCERAdmin = () => {
  const [elementosList, setElementosList] = useState<any[]>([]);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<any | null>(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [nuevaCantidad, setNuevaCantidad] = useState(0);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaDesc, setNuevaDesc] = useState("");
  const [nuevaCantidadFormulario, setNuevaCantidadFormulario] = useState(0);
  const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);
  const [previewImagen, setPreviewImagen] = useState<string | null>(null);

  const fetchElementos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/elements`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      const nuevoElementoId = data.id;
      const elementos = data
        .filter((el: any) => el.name)
        .map((el: any) => ({
          id: el.id,
          nombre: el.name,
          descripcion: el.description || "Sin descripción",
          cantidad: el.quantity || 0,
          imagen: imagenesPorNombre[el.name] || defaultImage.src,
        }));
      setElementosList(elementos);
    } catch (error) {
      console.error("Error al obtener los datos de la API:", error);
    }
  };

  const uploadImagen = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tu_upload_preset"); 

    const res = await fetch(`https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url; 
  };

  useEffect(() => {
    fetchElementos();
  }, []);

  const handleClick = (elemento: any) => {
    setElementoSeleccionado(elemento);
    setNuevaDescripcion(elemento.descripcion);
    setNuevaCantidad(elemento.cantidad);
    setModoEdicion(false);
  };

  const cerrarModal = () => {
    setElementoSeleccionado(null);
    setModoEdicion(false);
  };

  const guardarEdicion = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/elements/${elementoSeleccionado.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: elementoSeleccionado.nombre,
            description: nuevaDescripcion,
            quantity: nuevaCantidad,
          }),
        }
      );
      if (!response.ok) throw new Error("No se pudo actualizar el elemento");

      const actualizados = elementosList.map((el) =>
        el.id === elementoSeleccionado.id
          ? { ...el, descripcion: nuevaDescripcion, cantidad: nuevaCantidad }
          : el
      );
      setElementosList(actualizados);
      cerrarModal();

      Swal.fire("Éxito", "Elemento actualizado correctamente", "success");
    } catch (error) {
      console.error("Error al actualizar el elemento:", error);
      Swal.fire("Error", "No se pudo actualizar el elemento", "error");
    }
  };

  const eliminarElemento = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/elements/${elementoSeleccionado.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al eliminar el elemento: ${errorText}`);
        }

        const nuevos = elementosList.filter((el) => el.id !== elementoSeleccionado.id);
        setElementosList(nuevos);
        cerrarModal();

        Swal.fire("Eliminado", "Elemento eliminado correctamente", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo eliminar el elemento", "error");
      }
    }
  };

  const guardarNuevoElemento = async () => {
    if (!nuevoNombre.trim()) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/elements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nuevoNombre,
            description: nuevaDesc,
            quantity: nuevaCantidadFormulario,
          }),
        }
      );
      if (!response.ok) throw new Error("No se pudo crear el elemento");
      let nuevoElementoId;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        nuevoElementoId = data.id;
      } else {
        const allResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/elements`);
        const allElements = await allResponse.json();
        const recienCreado = allElements.find((el: any) => el.name === nuevoNombre);
        if (!recienCreado) throw new Error("No se encontró el nuevo elemento");
        nuevoElementoId = recienCreado.id;
      }

      const imagenUrl =
        imagenesPorNombre[nuevoNombre] || previewImagen || defaultImage.src;

      const nuevoElemento = {
        id: nuevoElementoId,
        nombre: nuevoNombre,
        descripcion: nuevaDesc || "Sin descripción",
        cantidad: nuevaCantidadFormulario,
        imagen: imagenUrl,
      };

      setElementosList((prev) => [...prev, nuevoElemento]);
      setMostrarFormulario(false);
      setNuevoNombre("");
      setNuevaDesc("");
      setNuevaCantidadFormulario(0);
      setPreviewImagen(null);
      setNuevaImagen(null);

      Swal.fire("Éxito", "Elemento creado correctamente", "success");
    } catch (error) {
      console.error("Error al crear nuevo elemento:", error);
      Swal.fire("Error", "No se pudo crear el elemento", "error");
    }
  };

  const handleImagenSeleccionada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      setNuevaImagen(archivo);
      setPreviewImagen(URL.createObjectURL(archivo));
    }
  };

  return (
    <div className="p-6 pb-28 flex flex-col items-center relative">
      <h2 className="text-2xl font-bold mt-6 mb-4 text-center">Elementos Recreativos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {elementosList.map((elemento, idx) => (
          <div
            key={idx}
            className="cursor-pointer border rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 p-4 text-center bg-white"
            onClick={() => handleClick(elemento)}
          >
            <Image
              src={elemento.imagen}
              alt={elemento.nombre}
              width={300}
              height={200}
              className="rounded-md object-cover mb-3 mx-auto"
            />
            <h3 className="text-lg font-semibold">{elemento.nombre}</h3>
          </div>
        ))}
      </div>
      {/* Modal de detalle/edición */}
      {elementoSeleccionado && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-2xl relative text-center">
            <button
              onClick={cerrarModal}
              className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>
            <Image
              src={elementoSeleccionado.imagen}
              alt={elementoSeleccionado.nombre}
              width={300}
              height={200}
              className="mx-auto rounded-md mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{elementoSeleccionado.nombre}</h3>
            {modoEdicion ? (
              <>
                <textarea
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  className="w-full border rounded-md p-2 mb-3"
                />
                <input
                  type="number"
                  value={nuevaCantidad}
                  onChange={(e) => setNuevaCantidad(parseInt(e.target.value))}
                  className="w-full border rounded-md p-2 mb-4"
                  placeholder="Cantidad"
                  min={0}
                />
              </>
            ) : (
              <>
                <p className="mb-2">{elementoSeleccionado.descripcion}</p>
                <p className="font-semibold">Cantidad: {elementoSeleccionado.cantidad}</p>
              </>
            )}
            <div className="flex justify-center gap-4 mt-4">
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={eliminarElemento}>
                Eliminar
              </button>
              {modoEdicion ? (
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={guardarEdicion}>
                  Guardar
                </button>
              ) : (
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setModoEdicion(true)}>
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Formulario de nuevo elemento */}
      {mostrarFormulario && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] shadow-2xl relative text-center">
            <button
              onClick={() => setMostrarFormulario(false)}
              className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">Nuevo Elemento</h3>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full border p-2 rounded mb-3"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
            <textarea
              placeholder="Descripción"
              className="w-full border p-2 rounded mb-3"
              value={nuevaDesc}
              onChange={(e) => setNuevaDesc(e.target.value)}
            />
            <input
              type="number"
              placeholder="Cantidad"
              className="w-full border p-2 rounded mb-3"
              value={nuevaCantidadFormulario}
              onChange={(e) => setNuevaCantidadFormulario(parseInt(e.target.value))}
              min={0}
            />
            <input type="file" accept="image/*" onChange={handleImagenSeleccionada} className="mb-3" />
            {previewImagen && (
              <Image src={previewImagen} alt="preview" width={300} height={200} className="mx-auto mb-3 rounded" />
            )}
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={guardarNuevoElemento}>
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Botón agregar */}
      <button
        onClick={() => setMostrarFormulario(true)}
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform z-40"
      >
        Agregar
      </button>
    </div>
  );
};

export default SCERAdmin;
