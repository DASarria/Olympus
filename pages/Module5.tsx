import { useRouter } from "next/router";
import { useEffect } from "react";
import { NavBtn } from "@/components/NavBtn";
import { ServiceContainer } from "@/components/ServiceContainer";
import Reseva from "@/assets/images/gym-module/SCHEDULE.svg";
import Progreso from "@/assets/images/gym-module/PROGRESOFISICO.svg";
import Rutina from "@/assets/images/gym-module/RUTINA.svg";
import Analisis from "@/assets/images/gym-module/ANALISIS.svg";
import iconUser from "@/assets/images/CrearUser.jpg";

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
        <>
            <ServiceContainer
                title="Gestión de Usuarios"
                text="Este modulo permite gestionar usuarios, asignar roles y configurar horarios para el uso de espacios y servicios de bienestar, asegurando orden y eficiencia en su operación."
            />
            <div className="flex flex-wrap items-start justify-center gap-[10px_10px] relative">

                {(role === "TRAINER") && (
                    <NavBtn
                        image={{ src: iconUser.src }}
                        texto="Gestión de Usuarios"
                        navigate="/gym-module/Routines"
                    />
                )}
            </div>
        </>
    );
};

export default Module5;