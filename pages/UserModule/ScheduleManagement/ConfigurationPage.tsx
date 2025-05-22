import { useRouter } from "next/router";
import { useEffect } from "react";
import React,{useState} from "react";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import Configuracion from "@/assets/images/UserModule/configuraciones.webp"
import { ConfigBtn } from "@/components/ConfigBtn";
import getConfigurations from "@/pages/api/UserManagement/ConfigurationService";
import {getConfigurationByName} from "@/pages/api/UserManagement/ConfigurationService";
import {deleteConfiguration} from "@/pages/api/UserManagement/ConfigurationService";
import ErrorMessage from "@/components/gestionUsuario/ErrorMessage";

import { motion } from "framer-motion";
import RectanguloConTexto from "@/components/gestionUsuario/RectanguloConTextoConfiguration";
import CampoTextoConfiguration from "@/components/gestionUsuario/CampoTextoConfiguration";
import FloatingConfigurationView from "@/components/gestionUsuario/FloatingConfigurationView";
import ConfigurationContainer from "@/components/gestionUsuario/ConfigurationContainer";
import { Return } from "@/components/Return";

const ConfigurationPage = () => {

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const role: string = "ADMIN";
    interface ConfigurationDTO {
        id: number;               
        name: string;             
        startTime: string;        
        endTime: string;          
    }
    const [configurations,setConfigurations] = useState<ConfigurationDTO[]>([]);
    const [name,setName] = useState("");
    const [configuration,setConfiguration]= useState<Configuration | null >(null);
    const [showWindow, setShowWindow] = useState(false);
    const router = useRouter();

    interface response{
    status:string;
    message:string;
    data:ConfigurationDTO[];
    }
    
    const loadInitialConfigurations = async () => {
        const response:response = await getConfigurations();
        if(response.status == "200"){
            setConfigurations(response.data)
            setShowWindow(true);
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
        reason:string;
    }
    interface Configuration{
        id: string|null;               
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
            setConfiguration(response.data);
            setShowWindow(true);
        }
        if(response.status == "400"){
            setErrorMessage(response.message)
        }
        if(response.status == "500"){
            setErrorMessage(response.message)
        }
    } 

    interface responseDelete{
        status:string;
        message:string;
        data:null;
    }
    const deleteName = async () =>{
        const response:responseDelete = await deleteConfiguration(name);
        if(response.status == "200"){
            loadInitialConfigurations()
            setErrorMessage(response.message)
        }
        if(response.status == "400"){
            setErrorMessage(response.message)
        }
        if(response.status == "500"){
            setErrorMessage(response.message)
        }
    }

    const queryGivingTheName = async (configurationName:string) =>{
        const response:ResponseName = await getConfigurationByName(configurationName);
        if(response.status == "200"){
            setConfiguration(response.data);
            setShowWindow(true);
        }
        if(response.status == "400"){
            setErrorMessage(response.message)
        }
        if(response.status == "500"){
            setErrorMessage(response.message)
        }
    }   

    function createConfiguration () {
        router.push("/UserModule/ScheduleManagement/CreateConfigurationPage")
    }    
    const closeWindow = async () =>{
        setShowWindow(false);
        setConfiguration(null);
    }

    useEffect(() => {
        loadInitialConfigurations();
    }, []);

    return (
        <>
            <PageTransitionWrapper>
                <Return text="" returnPoint=" /UserModule/ScheduleManagement/SchedulePage"/>
                <div className="max-w-[90vw] max-h-[80vh] overflow-y-auto p-2 bg-gray-40 rounded-md shadow-md ml-0">
                    <div className="flex flex-wrap items-start gap-2">
                        {/* Botones config */}
                        {role === "ADMIN" && configurations.map((config, index) => (
                            <ConfigBtn
                                key={index}
                                image={{ src: Configuracion.src }}
                                configurationName={config.name}
                                intervalo={`${config.startTime} - ${config.endTime}`}
                                onClick={() =>queryGivingTheName(config.name)}
                            />
                        ))}
                    </div>
                </div>

                <RectanguloConTexto texto="Administrar" ancho="60%" alto="60%">
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "5px 40px",
                            width: "100%",
                            boxSizing: "border-box",
                            maxWidth: "1450px",
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
                    <div
                        style ={{
                             display: "flex", flexDirection: "row", gap: "20px" 
                        }}   
                    >
                        <motion.div
                            whileHover={{
                                scale: 1.005,
                                transition: { duration: 0.15 },
                            }}
                        >
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
                                fontSize: "20px",
                                whiteSpace: "nowrap",
                                }}
                            >
                                Buscar
                            </button>
                        </motion.div>
                        <motion.div
                            whileHover={{
                                    scale: 1.005,
                                    transition: { duration: 0.15 },
                                }}
                        >
                            <button
                                onClick={deleteName} // Ajusta esta ruta
                                style={{
                                backgroundColor: "#990000",
                                color: "#ffffff",
                                fontFamily: "'Open Sans', sans-serif",
                                borderRadius: "16px",
                                padding: "10px 20px",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "20px",
                                whiteSpace: "nowrap",
                                }}
                            >
                                Eliminar
                            </button>

                        </motion.div>
                    </div>
                        <div
                            style={{marginTop:"20px"}}
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.005,
                                    transition: { duration: 0.15 },
                                }}
                            >
                                <button
                                    onClick = {createConfiguration}
                                    style={{
                                    backgroundColor: "#990000",
                                    color: "#ffffff",
                                    fontFamily: "'Open Sans', sans-serif",
                                    borderRadius: "16px",
                                    padding: "10px 20px",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "20px",
                                    whiteSpace: "nowrap",
                                    }}
                                >
                                    Crear una configuracion
                                </button>
                            </motion.div>
                        </div>
                          
                </RectanguloConTexto>
                {errorMessage && (
                    <div style={{ marginTop: "30px" }}>
                        <ErrorMessage message={errorMessage} onClose={()=>{setErrorMessage(null)}} />
                    </div>
                )}
                {configuration &&(
                    <FloatingConfigurationView visible={showWindow} onClose={() => closeWindow()}>
                        <ConfigurationContainer name = {configuration.name} startTime={configuration.startTime} endTime={configuration.endTime} 
                        attentionIntervals={configuration.attentionIntervals} breakIntervals={configuration.breakIntervals}>
                        </ConfigurationContainer>
                    </FloatingConfigurationView>
                )}
                

                
            </PageTransitionWrapper>

            
        </>
    );
};

export default ConfigurationPage;
