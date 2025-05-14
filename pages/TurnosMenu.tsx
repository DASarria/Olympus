import { useEffect } from 'react';
import { useRouter } from 'next/router';

const TurnosMenu = () => {
  const router = useRouter();

  const handleButtonClick = (action: string) => {
    switch (action) {
      case 'Turnos':
        router.push('/TurnosGestion'); 
        break;
      case 'consultar':
        router.push('su respectiva ruta');
        break;
      case 'analisis':
        router.push('su respectiva ruta');
        break;
      case 'sala':
        router.push('/Pantalla_Sala');
        break;
      case 'entrada':
        router.push('/TurnosRegistro');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-start bg-white-50 pt-8 pb-20 px-4">
      <div className="bg-red-600  text-white text-center p-4 rounded-lg shadow-md mb-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">MODULO DE SALUD</h2>
        <p className="text-sm">
          Gestiona de forma óptima los turnos, teniendo espacios para revisar los turnos actuales y
          siguientes correspondientes a cada área de la salud.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-12">
        <button
          onClick={() => handleButtonClick('Turnos')}
          className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow h-32 border border-gray-200"
        >
          <span className="text-gray-700 text-3xl mb-2">📝</span>
          <span className="text-gray-700 font-medium">Turnos</span>
        </button>

        <button
          onClick={() => handleButtonClick('analisis')}
          className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow h-32 border border-gray-200"
        >
          <span className="text-gray-700 text-3xl mb-2">📊</span>
          <span className="text-gray-700 font-medium">Análisis</span>
        </button>

        <button
          onClick={() => handleButtonClick('sala')}
          className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow h-32 border border-gray-200"
        >
          <span className="text-gray-700 text-3xl mb-2">🪑</span>
          <span className="text-gray-700 font-medium">Sala de espera</span>
        </button>

        <button
          onClick={() => handleButtonClick('entrada')}
          className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow h-32 border border-gray-200"
        >
          <span className="text-gray-700 text-3xl mb-2">🚪</span>
          <span className="text-gray-700 font-medium">Pantalla entrada</span>
        </button>

        <div className="col-span-2 flex justify-center mt-4">
          <button
            onClick={() => handleButtonClick('consultar')}
            className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow h-32 w-full max-w-xs border border-gray-200"
          >
            <span className="text-gray-700 text-3xl mb-2">🔍</span>
            <span className="text-gray-700 font-medium">Contenido visual</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurnosMenu;
