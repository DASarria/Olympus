
import { NavBtn } from "@/components/NavBtn";
import { ServiceContainer } from "@/components/ServiceContainer";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import Horario from "@/assets/images/UserModule/horario.png"
import Configuracion from "@/assets/images/UserModule/configuraciones.webp"
import { Return } from "@/components/Return";

const SchedulePage = () => {
    // const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string|null = sessionStorage.getItem("role");
    
    return (
        <>
            <PageTransitionWrapper>
                <ServiceContainer
                    title="GESTIÓN DE HORARIOS"
                    text="Realiza el manejo de configuraciones de horarios para los distintos servicios."
                />
                <div style={{ padding: "20px", fontFamily: "'Open Sans', sans-serif" }}>
                    <Return
                        className="!self-stretch !flex-[0_0_auto] !w-full mb-6"
                        text=""
                        returnPoint="/Module6" 
                    />
                </div>
                <div className="flex flex-wrap items-start gap-[10px_10px] relative">
                    {(role === "ADMIN") && (
                        <>
                            <NavBtn
                                image={{src:Horario.src}}
                                texto="Horarios"
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