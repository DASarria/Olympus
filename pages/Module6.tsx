import { useRouter } from "next/router";
import { useEffect } from "react";
import { NavBtn } from "@/components/NavBtn";
import { ServiceContainer } from "@/components/ServiceContainer";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import Horario from "@/assets/images/UserModule/horario.png"
import Usuario from "@/assets/images/UserModule/usuarios.webp"

const Module6 = () => {
    const router = useRouter();
    // const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string = "ADMIN";

    useEffect(() => {
    
    }, [role, router]);

    return (
        <>
            <PageTransitionWrapper>
                <ServiceContainer
                    title="MODULO DE GESTION DE USUARIOS Y HORARIOS"
                    text="Realiza el registro, modificacion y eliminacion de usuarios, tambien realiza el manejo de configuraciones de horarios para los distintos servicios."
                />
                <div className="flex flex-wrap items-start gap-[10px_10px] relative">
                    {(role === "ADMIN") && (
                        <>
                            <NavBtn
                                image={{src:Usuario.src}}
                                texto="Gestion de usuarios"
                                navigate="/"
                            />
                            <NavBtn
                                image={{ src: Horario.src }}
                                texto="Gestion de horarios"
                                navigate="/UserModule/ScheduleManagement/SchedulePage"
                            />
                            
                        </>
                    )}

                </div>
            </PageTransitionWrapper>
        </>
    );
};

export default Module6;