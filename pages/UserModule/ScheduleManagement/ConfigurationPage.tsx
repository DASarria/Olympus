import { useRouter } from "next/router";
import { useEffect } from "react";
import React,{useState} from "react";

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
            <div className="w-[90%] sm:w-[500px] md:w-[600px] lg:w-[700px] h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-md ml-0">
                <div className="flex flex-wrap items-start gap-[10px_10px] relative">
                    {(role === "ADMIN") && (
                        <>
                            <ConfigBtn
                                image ={{src:Configuracion.src}}
                                configurationName = "configuracion 1"
                                intervalo = "07:00 - 08:00"
                                navigate = "/"
                            />
                            <ConfigBtn
                                image ={{src:Configuracion.src}}
                                configurationName = "configuracion 1"
                                intervalo = "07:00 - 08:00"
                                navigate = "/"
                            />
                            <ConfigBtn
                                image ={{src:Configuracion.src}}
                                configurationName = "configuracion 1"
                                intervalo = "07:00 - 08:00"
                                navigate = "/"
                            />
                            <ConfigBtn
                                image ={{src:Configuracion.src}}
                                configurationName = "configuracion 1"
                                intervalo = "07:00 - 08:00"
                                navigate = "/"
                            />
                            <ConfigBtn
                                image ={{src:Configuracion.src}}
                                configurationName = "configuracion 1"
                                intervalo = "07:00 - 08:00"
                                navigate = "/"
                            />
                            <ConfigBtn
                                image ={{src:Configuracion.src}}
                                configurationName = "configuracion 1"
                                intervalo = "07:00 - 08:00"
                                navigate = "/"
                            />
                            <ConfigBtn
                                image ={{src:Configuracion.src}}
                                configurationName = "configuracion 1"
                                intervalo = "07:00 - 08:00"
                                navigate = "/"
                            />
                            <ConfigBtn
                                image ={{src:Configuracion.src}}
                                configurationName = "configuracion 1"
                                intervalo = "07:00 - 08:00"
                                navigate = "/"
                            />
                            <ConfigBtn
                                image ={{src:Configuracion.src}}
                                configurationName = "configuracion 1"
                                intervalo = "07:00 - 08:00"
                                navigate = "/"
                            />
                            <ConfigBtn
                                image ={{src:Configuracion.src}}
                                configurationName = "configuracion 1"
                                intervalo = "07:00 - 08:00"
                                navigate = "/"
                            />
                            <ConfigBtn
                                image ={{src:Configuracion.src}}
                                configurationName = "configuracion 1"
                                intervalo = "07:00 - 08:00"
                                navigate = "/"
                            />
                            <ConfigBtn
                                image ={{src:Configuracion.src}}
                                configurationName = "configuracion 1"
                                intervalo = "07:00 - 08:00"
                                navigate = "/"
                            />

                        
                        </>
                        
                    )}

                </div>
            </div>
        </>
    );
};

export default ConfigurationPage;
