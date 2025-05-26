import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import clasesCE from "../../assets/images/clasesExtracurriculares/clasesCE.png";
import estadisticasCE from "../../assets/images/clasesExtracurriculares/estadisticasCE.png";
import horariosCE from "../../assets/images/clasesExtracurriculares/horariosCE.png";

const ClasesExtracurriculares = () => {
  const userRole = "administrador";
  
  const router = useRouter();
  const navegarA = (ruta) => {
    router.push(ruta);
  };

  const isAdmin = userRole === "administrador" || userRole === "profesor";
  
  return (
    <div className="flex flex-col h-full bg-white-50">
      <div className="bg-red-800 text-white p-4 m-4 rounded-lg shadow-md">
        <h2 className="font-montserrat font-bold text-2xl mb-1">Clases Extracurriculares</h2>
        <p className="font-open-sans text-1xl font-normal">
          Consulta tu asistencia a actividades deportivas, culturales, de relajación o desarrollo personal, que aporten con tu desarrollo personal y físico.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-5 p-1">
        <div
          className="bg-white rounded-lg shadow-md p-5 h-50 flex flex-col items-center justify-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100"
          onClick={() => navegarA('/clasesExtracurriculares/CEAdminClases')}
        >
          <div className="bg-white-50 p-2 rounded-full mb-6 shadow-inner">
            <Image
              src={clasesCE}
              width={64}
              height={64}
              alt="Clases"
            />
          </div>
          <h3 className="font-montserrat font-bold text-1xl text-center">
            {isAdmin ? "Clases y asistencias" : "Mis Clases"}
          </h3>
        </div>
        
        {isAdmin && (
          <div
            className="bg-white rounded-lg shadow-md p-8 h-50 flex flex-col items-center justify-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100"
            onClick={() => navegarA('/clasesExtracurriculares/CEProfeEstudianteClases')}
          >
            <div className="bg-white-50 p-2 rounded-full mb-6 shadow-inner">
              <Image
                src={estadisticasCE}
                alt="Estadísticas de Clases"
                width={64}
                height={64}
              />
            </div>
            <h3 className="font-montserrat font-bold text-1xl text-center">Estadísticas Clases</h3>
          </div>
        )}
        
        {isAdmin && (
          <div
            className="bg-white rounded-lg shadow-md p-8 h-50 flex flex-col items-center justify-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100"
            onClick={() => navegarA('/clasesExtracurriculares/CEAdminEstadisticas')}
          >
            <div className="bg-white-50 p-2 rounded-full mb-6 shadow-inner">
              <Image
                src={horariosCE}
                alt="Gestión de Clases"
                width={64}
                height={64}
              />
            </div>
            <h3 className="font-montserrat font-bold text-1xl text-center">Gestión Clases</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClasesExtracurriculares;