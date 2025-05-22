import { useRouter } from "next/router";
import { NavBtn } from "@/components/NavBtn";
import { ServiceContainer } from "@/components/ServiceContainer";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import Horario from "@/assets/images/UserModule/horario.png"
import Configuracion from "@/assets/images/UserModule/configuraciones.webp"


const SchedulePage = () => {
    const router = useRouter();
    // const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string|null = sessionStorage.getItem("role");
    
    

    return (
        <>
            <PageTransitionWrapper>
                <ServiceContainer
                    title="GESTION DE HORARIOS"
                    text="Realiza el manejo de configuraciones de horarios para los distintos servicios."
                />
                <div className="flex flex-wrap items-start gap-[10px_10px] relative">
                    {(role === "ADMIN") && (
                        <>
                            <NavBtn
                                image={{src:Horario.src}}
                                texto="Servicios"
                                navigate="/UserModule/ScheduleManagement/ServicePage"
                            />
                            <NavBtn
                                image={{ src: Configuracion.src }}
                                texto="Configuraciones"
                                navigate="/UserModule/ScheduleManagement/ConfigurationPage"
                            />
                            
                        </>
                    )}

                </div>
            </PageTransitionWrapper>
        </>
    );
};

export default SchedulePage;