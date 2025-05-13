import { NavBtn } from "@/components/NavBtn";
import { ServiceContainer } from "@/components/ServiceContainer";
import Reseva from "@/assets/images/gym-module/SCHEDULE.svg";
import Progreso from "@/assets/images/gym-module/PROGRESOFISICO.svg";
import Rutina from "@/assets/images/gym-module/RUTINA.svg";
import Analisis from "@/assets/images/gym-module/ANALISIS.svg";

const Module5 = () => {
  return (
    <>
        <ServiceContainer
            title="MODULO DE SEGUIMIENTO FISICO"
            text="Reserva tus sesiones de entrenamiento, registra tu progreso físico y consulta el análisis de tus rutinas desde un solo lugar. Gestiona tu actividad en el gimnasio de forma sencilla y enfocada en tus objetivos."
        />
        <div className="flex flex-wrap items-start gap-[10px_10px] relative">
            <NavBtn
                image={{ src: Reseva.src }}
                texto="Reserva de salon"
                navigate="/gym-module/PhysicalProgress"
            />
            <NavBtn
                image={{ src: Progreso.src }}
                texto="Progreso fisico"
                navigate="/gym-module/PhysicalProgress"
            />
            <NavBtn
                image={{ src: Rutina.src }}
                texto="Rutinas"
                navigate="/gym-module/PhysicalProgress"
            />
            <NavBtn
                image={{ src: Analisis.src }}
                texto="Análisis"
                navigate="/gym-module/PhysicalProgress"
            />
        </div>
    </>
  );
};

export default Module5;