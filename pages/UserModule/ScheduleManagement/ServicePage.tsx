import { useRouter } from "next/router";
import { useEffect } from "react";
import React,{useState} from "react";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import servicio1 from "@/assets/images/UserModule/salaCrea.png"
import servicio2 from "@/assets/images/UserModule/medico.png"
import servicio3 from "@/assets/images/UserModule/gym.png"
import { ConfigBtn } from "@/components/ConfigBtn";
import { NavBtn } from "@/components/NavBtn";

const ServicePage = () => {
    const router = useRouter();
    // const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string = "ADMIN";
    const [configurations,setConfigurations] = useState('');
    
    useEffect(() => {
    
    }, [role, router]);

    const handleNavigate = (serviceName: string) => {
        router.push(`/UserModule/ScheduleManagement/ScheduleViewer?serviceName=${encodeURIComponent(serviceName)}`);
    };

    return (
        <>
            <PageTransitionWrapper>
                <div className="max-w-[40vw]     /* Ancho máximo 28rem (~448px), ancho full */
                                max-h-[80vh]         /* Máximo alto 80% de viewport height */
                                overflow-y-auto
                                p-2
                                bg-gray-50
                                rounded-md
                                shadow-md
                                ml-0
                                ">
                    <div className="flex flex-wrap items-start gap-2 relative">
                        {role === "ADMIN" && (
                        <>
                            <NavBtn
                            image={{ src: servicio1.src }}
                            texto="Salas CREA"
                            navigate="/UserModule/ScheduleManagement/ScheduleViewer?serviceName=Salas CREA"
                            />
                            
                            <NavBtn
                            image={{ src: servicio2.src }}
                            texto="Medicos"
                            navigate="/UserModule/ScheduleManagement/ScheduleViewer?serviceName=Medicos"
                            />

                            <NavBtn
                            image={{ src: servicio3.src }}
                            texto="Gimnasio"
                            navigate="/UserModule/ScheduleManagement/ScheduleViewer?serviceName=Gimnasio"
                            />
                        </>
                        )}
                    </div>
                </div>

            </PageTransitionWrapper>
        </>
    );
};

export default ServicePage;
