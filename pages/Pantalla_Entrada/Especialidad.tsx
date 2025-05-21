import { useRouter } from 'next/router';
import type { NextPage } from 'next';

const Especialidad: NextPage = () => {
  const router = useRouter();

  // Tipamos el parámetro como string (o un tipo específico si tienes uno)
  const handleButtonClick = (especialidad: string) => {
    router.push({
      pathname: '/Pantalla_Entrada/Turnos',
      query: { especialidad }, // Envía la especialidad como query parameter
    });
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-start bg-gray-50 pt-8 pb-20 px-4">
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-12">
        {/* Botón Medicina General */}
        <button
          onClick={() => handleButtonClick("MedicinaGeneral")}
          className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow h-32 border border-gray-200"
        >
          <span className="text-gray-700 text-3xl mb-2">🩺</span>
          <span className="text-gray-700 font-medium">Medicina General</span>
        </button>

        {/* Botón Psicología */}
        <button
          onClick={() => handleButtonClick("Psicologia")}
          className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow h-32 border border-gray-200"
        >
          <span className="text-gray-700 text-3xl mb-2">🧠</span>
          <span className="text-gray-700 font-medium">Psicología</span>
        </button>

        {/* Botón Odontología (centrado) */}
        <div className="col-span-2 flex justify-center mt-4">
          <button
            onClick={() => handleButtonClick("Odontologia")}
            className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow h-32 w-full max-w-xs border border-gray-200"
          >
            <span className="text-gray-700 text-3xl mb-2">🦷</span>
            <span className="text-gray-700 font-medium">Odontología</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Especialidad;