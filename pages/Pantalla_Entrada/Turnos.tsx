import { useState } from "react";
import { useRouter } from "next/router";

interface FormData {
  nombre: string;
  documento: string;
  rol: string;
  discapacidad: string;
}

const Turnos = () => {
  const router = useRouter();
  const { especialidad } = router.query;

  const initialFormState: FormData = {
    nombre: "",
    documento: "",
    rol: "",
    discapacidad: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const Roles = ["Estudiante", "Profesor", "Administrativo", "ServiciosGenerales"];
  const opcionesDiscapacidad = ["NoTiene", "MayorDeEdad", "DisfuncionMotriz", "Embarazo", "Otra"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validar especialidad
      if (!especialidad) {
        throw new Error("No se ha seleccionado una especialidad");
      }

      // Preparar datos para la API
      const turnoDTO = {
        userName: formData.nombre,
        identityDocument: formData.documento,
        role: formData.rol,
        specialization: especialidad as string,
        disabilitie: formData.discapacidad,
      };

      // Llamar al endpoint
      const response = await fetch(
        "https://eciturnos-e5egf4dyezdkdgfq.canadaeast-01.azurewebsites.net/api/turns/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(turnoDTO),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el turno");
      }

      const data = await response.json();

      // Redirigir a confirmación con el código
      router.push({
        pathname: "/Pantalla_Entrada/Confirmacion",
        query: { 
          codigoTurno: data.code,
          especialidad: especialidad as string 
        },
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg w-full max-w-md border border-red-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Registro de Turno - {especialidad}
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        {/* Campo Nombre */}
        <div className="mb-6 border border-red-500 rounded p-1">
          <label className="block text-gray-700 mb-2" htmlFor="nombre">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 focus:outline-none bg-transparent"
            required
          />
        </div>

        {/* Campo Documento */}
        <div className="mb-6 border border-red-500 rounded p-1">
          <label className="block text-gray-700 mb-2" htmlFor="documento">
            Documento
          </label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            className="w-full px-3 py-2 focus:outline-none bg-transparent"
            required
          />
        </div>

        {/* Campo Rol */}
        <div className="mb-6 border border-red-500 rounded p-1">
          <label className="block text-gray-700 mb-2" htmlFor="rol">
            Rol
          </label>
          <select
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="w-full px-3 py-2 focus:outline-none bg-transparent appearance-none"
            required
          >
            <option value="">Seleccione una opción</option>
            {Roles.map((rol) => (
              <option key={rol} value={rol}>
                {rol.replace(/([A-Z])/g, " $1").trim()}
              </option>
            ))}
          </select>
        </div>

        {/* Campo Discapacidad */}
        <div className="mb-8 border border-red-500 rounded p-1">
          <label className="block text-gray-700 mb-2" htmlFor="discapacidad">
            Discapacidad
          </label>
          <select
            id="discapacidad"
            name="discapacidad"
            value={formData.discapacidad}
            onChange={handleChange}
            className="w-full px-3 py-2 focus:outline-none bg-transparent appearance-none"
            required
          >
            <option value="">Seleccione una opción</option>
            {opcionesDiscapacidad.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion.replace(/([A-Z])/g, " $1").trim()}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors border border-gray-600"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors border border-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Creando turno..." : "Confirmar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Turnos;