import { useState } from 'react';
import { useRouter } from 'next/router';

const Turnos = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  
  const initialFormState = {
    nombre: '',
    documento: '',
    especializacion: '',
    discapacidad: '' 
  };
  
  const [formData, setFormData] = useState(initialFormState);

  const especialidades = [
    'Odontologia',
    'MedicinaGeneral',
    'Psicologia'
  ];

  const opcionesDiscapacidad = [
    'NoTiene',
    'MayorDeEdad',
    'DisfuncionMotriz',
    'Embarazo',
    'Otra'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
    alert('Turno registrado exitosamente!');
    
    setFormData(initialFormState);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {!showForm ? (
        <div className="text-center space-y-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800">Registrar Turno</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Registrar Turno
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Formulario de Turno</h2>
          
          {/* Campos del formulario (igual que antes) */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="nombre">
              Nombre completo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="documento">
              Número de documento *
            </label>
            <input
              type="text"
              id="documento"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="especializacion">
              Especialización a visitar *
            </label>
            <select
              id="especializacion"
              name="especializacion"
              value={formData.especializacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Condición especial
            </label>
            <div className="space-y-2">
              {opcionesDiscapacidad.map((opcion) => (
                <div key={opcion} className="flex items-center">
                  <input
                    type="radio"
                    id={opcion}
                    name="discapacidad"
                    value={opcion}
                    checked={formData.discapacidad === opcion}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    required={!formData.discapacidad} // Requerido si no hay selección
                  />
                  <label htmlFor={opcion} className="ml-2 block text-gray-700">
                    {opcion.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData(initialFormState);
                setShowForm(false);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirmar Turno
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Turnos;