import { useRouter } from "next/router";
import { useEffect } from "react";
import React,{useState} from "react";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import Configuracion from "@/assets/images/UserModule/configuraciones.webp"
import { ConfigBtn } from "@/components/ConfigBtn";
import getConfigurations from "@/pages/api/UserManagement/ConfigurationService";
import {getConfigurationByName} from "@/pages/api/UserManagement/ConfigurationService";
import ErrorMessage from "@/components/gestionUsuario/ErrorMessage";
import CampoSelect from "@/components/gestionUsuario/CampoSelect";

import RectanguloConTexto from "@/components/gestionUsuario/RectanguloConTexto";
import CampoTextoConfiguration from "@/components/gestionUsuario/CampoTextoConfiguration";

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
    const [name,setName] = useState("");



    interface response{
    status:string;
    message:string;
    data:ConfigurationDTO[];
    }
    
    const loadInitialConfigurations = async () => {
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

    interface Interval{
        startTime: string;        
        endTime: string; 
        reazon:string;
    }
    interface Configuration{
        id: number;               
        name: string;             
        startTime: string;        
        endTime: string;
        breakIntervals: Interval[];
        attentionIntervals: Interval[];
    }
    interface ResponseName{
        status:string;
        message:string;
        data:Configuration;
    }
    const queryName = async () =>{
        const response:ResponseName = await getConfigurationByName(name);
        if(response.status == "200"){
            setErrorMessage(response.message)
        }
        if(response.status == "400"){
            setErrorMessage(response.message)
        }
        if(response.status == "500"){
            setErrorMessage(response.message)
        }
    } 

    useEffect(() => {
        loadInitialConfigurations();
    }, []);
    return (
        <>
            <PageTransitionWrapper>
                <div className="max-w-[90vw] max-h-[80vh] overflow-y-auto p-2 bg-gray-40 rounded-md shadow-md ml-0">
                    <div className="flex flex-wrap items-start gap-2">
                        {/* Botones config */}
                        {role === "ADMIN" && configurations.map((config, index) => (
                            <ConfigBtn
                                key={index}
                                image={{ src: Configuracion.src }}
                                configurationName={config.name}
                                intervalo={`${config.startTime} - ${config.endTime}`}
                                navigate="/"
                            />
                        ))}
                    </div>
                </div>

                <RectanguloConTexto texto="Consulta" ancho="" alto="">
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "5px 40px",
                            width: "100%",
                            boxSizing: "border-box",
                            maxWidth: "1460px",
                        }}
                    >
                        <div style={{ width: "calc(50% - 20px)" }}>
                            <CampoTextoConfiguration
                                etiqueta="Nombre"
                                marcador="Digite el nombre de la configuración"
                                value = {name}
                                onChange= {(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>
                          <button
                            onClick={queryName} // Ajusta esta ruta
                            style={{
                            backgroundColor: "#990000",
                            color: "#ffffff",
                            fontFamily: "'Open Sans', sans-serif",
                            borderRadius: "16px",
                            padding: "10px 20px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "20px"
                            }}
                        >
                            Abrir
                        </button>
                </RectanguloConTexto>
                {errorMessage && (
                    <div style={{ marginTop: "30px" }}>
                        <ErrorMessage message={errorMessage} onClose={()=>{setErrorMessage(null)}} />
                    </div>
                )}
            </PageTransitionWrapper>

            
        </>
    );
};

export default ConfigurationPage;
