import { useRouter } from 'next/router';
import { useState } from 'react';

const TurnosGestion = () => {
  const router = useRouter();

  const especialidades = ['Medicina', 'Odontologia', 'Psicologia'];

  const [turnos, setTurnos] = useState({
    Medicina: { actual: 'M - 003', siguiente: 'M - 004' },
    Odontologia: { actual: 'O - 003', siguiente: 'O - 004' },
    Psicologia: { actual: 'P - 003', siguiente: 'P - 004' }
  });

  const handleSiguiente = (especialidad: string) => {
    alert(`Turno de ${especialidad} avanzado`);
  };

  const handleAbortar = (especialidad: string) => {
    alert(`Turno de ${especialidad} abortado`);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-6 flex items-center gap-2">
        <button onClick={() => router.back()} className="text-xl">←</button>
        <h1 className="text-2xl font-bold">Turnos</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {especialidades.map((esp) => (
          <div
            key={esp}
            className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col items-center justify-between gap-4"
          >
            <h2 className="text-lg font-bold text-center">{esp}</h2>

            <div className="w-full text-center bg-gray-200 rounded-md py-3 font-semibold">
              Turno actual<br />
              {turnos[esp as keyof typeof turnos].actual}
            </div>

            <div className="w-full text-center bg-gray-200 rounded-md py-3 font-semibold">
              Próximo turno<br />
              {turnos[esp as keyof typeof turnos].siguiente}
            </div>

            <div className="flex w-full justify-between mt-2">
              <button
                onClick={() => handleAbortar(esp)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Abortar
              </button>
              <button
                onClick={() => handleSiguiente(esp)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Siguiente
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TurnosGestion;
