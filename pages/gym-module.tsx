import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NavBtn } from "@/components/NavBtn";
import { ServiceContainer } from "@/components/ServiceContainer";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import { getUserByInstitutionalId, createUser } from "@/api/gymServicesIndex";
import { getInstitutionalIdFromToken } from "@/api/general";
import Reseva from "@/assets/images/gym-module/SCHEDULE.svg";
import Progreso from "@/assets/images/gym-module/PROGRESOFISICO.svg";
import Rutina from "@/assets/images/gym-module/RUTINA.svg";
import Analisis from "@/assets/images/gym-module/ANALISIS.svg";

const Module5 = () => {
    const router = useRouter();
    const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const [loading, setLoading ] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const id = getInstitutionalIdFromToken();
                console.log(id);
                if (!id) {
                    console.error("No userId found");
                    //router.push('/');
                    return;
                };
                sessionStorage.setItem('id', id);

                try {
                    await getUserByInstitutionalId(id);
                } catch (Error) {
                    createUser();
                }

                if (role === "ADMIN" && router.pathname !== "/gym-module/analysis") {
                    router.push("/gym-module/analysis");
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    return (
        <PageTransitionWrapper>
            {loading ? (
                <div className="flex w-full justify-center items-center h-screen">
                    <div className="w-16 h-16 border-4 border-t-4 border-gray-500 border-solid rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <ServiceContainer
                        title="MODULO DE SEGUIMIENTO FISICO"
                        text="Reserva tus sesiones de entrenamiento, registra tu progreso físico y consulta el análisis de tus rutinas desde un solo lugar. Gestiona tu actividad en el gimnasio de forma sencilla y enfocada en tus objetivos."
                    />
                    <div className="flex flex-wrap items-start justify-center gap-[10px_10px] relative">
                        {(role === "STUDENT" || role === "TRAINER") && (
                            <>
                                <NavBtn
                                    image={{ src: Reseva.src }}
                                    texto="Reserva de salon"
                                    navigate="/gym-module/reservations"
                                />
                                <NavBtn
                                    image={{ src: Progreso.src }}
                                    texto="Progreso fisico"
                                    navigate="/gym-module/physical-progress"
                                />
                                <NavBtn
                                    image={{ src: Rutina.src }}
                                    texto="Rutinas"
                                    navigate="/gym-module/routines"
                                />
                            </>
                        )}

                        {(role === "TRAINER") && (
                            <NavBtn
                                image={{ src: Analisis.src }}
                                texto="Análisis"
                                navigate="/gym-module/analysis"
                            />
                        )}
                    </div>
                </>
            )}
        </PageTransitionWrapper>
    );
};

export default Module5;