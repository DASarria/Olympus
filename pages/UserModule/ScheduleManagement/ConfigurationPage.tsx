import { useRouter } from "next/router";
import { useEffect } from "react";
import React,{useState} from "react";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import Configuracion from "@/assets/images/UserModule/configuraciones.webp"
import { ConfigBtn } from "@/components/ConfigBtn";

const ConfigurationPage = () => {
    const router = useRouter();
    // const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string = "ADMIN";
    const [configurations,setConfigurations] = useState('');
    
    useEffect(() => {
    
    }, [role, router]);

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
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            <ConfigBtn
                            image={{ src: Configuracion.src }}
                            configurationName="configuracion 1"
                            intervalo="07:00 - 08:00"
                            navigate="/"
                            />
                            {/* Más botones si los necesitas */}
                        </>
                        )}
                    </div>
                </div>

            </PageTransitionWrapper>
        </>
    );
};

export default ConfigurationPage;
