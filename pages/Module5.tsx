import { useRouter } from "next/router";
import { useEffect } from "react";
import { NavBtn } from "@/components/NavBtn";
import { ServiceContainer } from "@/components/ServiceContainer";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import Reseva from "@/assets/images/gym-module/SCHEDULE.svg";
import Progreso from "@/assets/images/gym-module/PROGRESOFISICO.svg";
import Rutina from "@/assets/images/gym-module/RUTINA.svg";
import Analisis from "@/assets/images/gym-module/ANALISIS.svg";

const Module5 = () => {
    const router = useRouter();
    // const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string = "TRAINER";

    useEffect(() => {
        if (role === "ADMIN" && router.pathname !== "/gym-module/Analysis") {
            router.push("/gym-module/Analysis");
        }
    }, [role, router]);

    return (
        <PageTransitionWrapper>
            <ServiceContainer
                title="MODULO DE SEGUIMIENTO FISICO"
                text="Reserva tus sesiones de entrenamiento, registra tu progreso físico y consulta el análisis de tus rutinas desde un solo lugar. Gestiona tu actividad en el gimnasio de forma sencilla y enfocada en tus objetivos."
            />
            <div className="flex flex-wrap items-start justify-center gap-[10px_10px] relative">
                {(role === "USER" || role === "TRAINER") && (
                    <>
                        <NavBtn
                            image={{ src: Reseva.src }}
                            texto="Reserva de salon"
                            navigate="/gym-module/Reservations"
                        />
                        <NavBtn
                            image={{ src: Progreso.src }}
                            texto="Progreso fisico"
                            navigate="/gym-module/PhysicalProgress"
                        />
                        <NavBtn
                            image={{ src: Rutina.src }}
                            texto="Rutinas"
                            navigate="/gym-module/Routines"
                        />
                    </>
                )}

                {(role === "TRAINER") && (
                    <NavBtn
                        image={{ src: Analisis.src }}
                        texto="Análisis"
                        navigate="/gym-module/Analysis"
                    />
                )}
            </div>
        </PageTransitionWrapper>
    );
};

export default Module5;