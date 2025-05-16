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
            <div className="w-[90%] sm:w-[300px] md:w-[350px] lg:w-[400px] h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] overflow-y-auto p-2 bg-gray-100 rounded-lg shadow-md mx-auto">
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
                        {/* Más botones si los necesitas */}
                    </>
                    )}
                </div>
            </div>

        </>
    );
};

export default ConfigurationPage;
