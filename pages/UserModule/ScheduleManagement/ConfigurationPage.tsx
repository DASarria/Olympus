import { useRouter } from "next/router";
import { useEffect } from "react";
import React,{useState} from "react";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import Configuracion from "@/assets/images/UserModule/configuraciones.webp"
import { ConfigBtn } from "@/components/ConfigBtn";
import getConfigurations from "@/pages/api/UserManagement/ConfigurationService";
import ErrorMessage from "@/components/ErrorMessage";

const ConfigurationPage = () => {

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string = "ADMIN";
    interface ConfigurationDTO {
        id: number;               
        name: string;             
        startTime: string;        
        endTime: string;          
    }
    const [configurations,setConfigurations] = useState<ConfigurationDTO[]>([]);



    interface response{
    status:string;
    message:string;
    data:ConfigurationDTO[];
    }
    
    const loadInitialConfigurations = async () => {
        console.log("Página cargada por primera vez");
        const response:response = await getConfigurations();
        if(response.status == "200"){
            setConfigurations(response.data)
        }
        if(response.status == "400"){
            setErrorMessage(response.message)
        }
        if(response.status == "500"){
            setErrorMessage(response.message)
        }
    };

    // ✅ useEffect para ejecutar la función automáticamente al cargar
    useEffect(() => {
        loadInitialConfigurations();
    }, []);
    return (
        <>
            <PageTransitionWrapper>
                <div
                className="max-w-[90vw] max-h-[80vh] overflow-y-auto p-2 bg-gray-40 rounded-md shadow-md ml-0"
                >
                    <div className="flex flex-wrap items-start gap-2">
                        {role === "ADMIN" && (
                            <>
                                {configurations.map((config: ConfigurationDTO, index) => (
                                <ConfigBtn
                                    key={index}
                                    image={{ src: Configuracion.src }}
                                    configurationName={config.name}
                                    intervalo={`${config.startTime} - ${config.endTime}`}
                                    navigate="/"
                                />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </PageTransitionWrapper>
            {errorMessage && (
                <ErrorMessage message={errorMessage} onClose={loadInitialConfigurations} />
            )}
        </>
    );
};

export default ConfigurationPage;
