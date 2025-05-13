import { useState } from 'react';
import { useRouter } from 'next/router';

const Turnos = () => {
  const router = useRouter();

  const initialFormState = {
    nombre: '',
    documento: '',
    especializacion: '',
    discapacidad: ''
  };

  
  const [formData, setFormData] = useState(initialFormState);
  const [token, setToken] = useState<string | null>(null);

  const especialidades = ['Odontologia', 'MedicinaGeneral', 'Psicologia'];
  const opcionesDiscapacidad = ['NoTiene', 'MayorDeEdad', 'DisfuncionMotriz', 'Embarazo', 'Otra'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert('Token no encontrado. Por favor inicie sesión.');
      return;
    }

    try {
      const res = await fetch(
        'https://ecibienestarturns-gnascpdhfhfhevbb.eastus-01.azurewebsites.net/api/turns/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al registrar el turno');
      }

      const data = await res.json();
      console.log('Turno registrado:', data);
      alert('Turno registrado exitosamente!');
      setFormData(initialFormState);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg w-full max-w-md shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Registro de Turno</h2>

        {/* Nombre */}
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold mb-2" htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
            required
          />
        </div>

        {/* Documento */}
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold mb-2" htmlFor="documento">Cédula</label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
            required
          />
        </div>

        {/* Especialización */}
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold mb-2" htmlFor="especializacion">Rol</label>
          <select
            id="especializacion"
            name="especializacion"
            value={formData.especializacion}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none"
            required
          >
            <option value="">Seleccione una opción</option>
            {especialidades.map((esp) => (
              <option key={esp} value={esp}>
                {esp.replace(/([A-Z])/g, ' $1').trim()}
              </option>
            ))}
          </select>
        </div>

        {/* Discapacidad */}
        <div className="mb-6">
          <label className="block text-gray-800 font-semibold mb-2" htmlFor="discapacidad">Prioridad</label>
          <select
            id="discapacidad"
            name="discapacidad"
            value={formData.discapacidad}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none"
            required
          >
            <option value="">Seleccione una opción</option>
            {opcionesDiscapacidad.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion.replace(/([A-Z])/g, ' $1').trim()}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => {
              setFormData(initialFormState);
              router.back();
            }}
            className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors shadow"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-900 transition-colors shadow"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
};

export default Turnos;
