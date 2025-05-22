import RectanguloConTextoConfiguration from "@/components/gestionUsuario/RectanguloConTextoConfiguration"
import CampoTextoConfiguration from "@/components/gestionUsuario/CampoTextoConfiguration"
import { useState } from "react";
import CampoSelectConfiguration from "@/components/gestionUsuario/CampoSelectConfiguration";
import { motion } from "framer-motion";
import FloatingConfigurationView from "@/components/gestionUsuario/FloatingConfigurationView";
import ConfigurationContainer from "@/components/gestionUsuario/ConfigurationContainer";
import { CreateConfiguration } from "@/pages/api/UserManagement/ConfigurationService";
import ErrorMessage from "@/components/gestionUsuario/ErrorMessage";
import { useRouter } from 'next/router';
import { Return } from "@/components/Return";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

const CreateConfigurationPage = () =>{
    interface Interval{
        startTime: string;        
        endTime: string; 
        reason:string;
    }
    interface Configuration{      
        id:null;        
        name: string;             
        startTime: string;        
        endTime: string;
        breakIntervals: Interval[];
        attentionIntervals: Interval[];
    }
    interface Response{
        status:string;
        message:string;
        data:null;
    }
    const router = useRouter();
    const [name,setName] = useState<string>("");
    const options:string[] = [
        "07:00","08:30","10:00","11:30","13:00","14:30","16:00","17:30","19:00"
    ]
    const [startTime,setStartTime] = useState<string>("");
    const [endTime,setEndTime] = useState<string>("");
    const [intervalStartTime,setIntervalStartTime] = useState<string>("");
    const [intervalEndTime,setIntervalEndTime] = useState<string>("");
    const [reason,setReazon] = useState<string>("");
    const [intervalBreakStartTime,setIntervalBreakStartTime] = useState<string>("");
    const [intervalBreakEndTime,setIntervalBreakEndTime] = useState<string>("");
    const [reasonBreak,setReazonBreak] = useState<string>("");
    const [breakIntervals,setBreakInterval] =useState<Interval[]>([]);
    const [attentionIntervals,setAttentionInterval] =useState<Interval[]>([]);
    const [configuration,setConfiguration] = useState<Configuration|null>(null);
    const [visible,makeVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const resetFormulario = () => {
        setName("");
        setStartTime("");
        setEndTime("");
        setIntervalStartTime("");
        setIntervalEndTime("");
        setReazon("");
        setIntervalBreakStartTime("");
        setIntervalBreakEndTime("");
        setReazonBreak("");
        setBreakInterval([]);
        setAttentionInterval([]);
        setConfiguration(null);
    };
    function closeWindow(){
        makeVisible(false);
        setConfiguration(null);
    }

    function addAttentionInterval(){
        const interval:Interval = {
            startTime : intervalStartTime,
            endTime : intervalEndTime,
            reason : reason
        }
        setAttentionInterval([...attentionIntervals,interval])
        setErrorMessage("El intervalo de atencion fue añadido")
    }
    function deleteAttentionInterval(){
        setAttentionInterval(prev => prev.slice(0, -1));
        setErrorMessage("El último intervalo de atención fue eliminado");
    }
    function addBreakInterval(){
        const interval:Interval = {
            startTime : intervalBreakStartTime,
            endTime : intervalBreakEndTime,
            reason : reasonBreak
        }
        setBreakInterval([...breakIntervals,interval])
        setErrorMessage("El intervalo de descanso fue añadido")
    }
    function deleteBreakInterval(){
        setBreakInterval(prev => prev.slice(0, -1));
        setErrorMessage("El último intervalo de atención fue eliminado");
    }
    function previewConfiguracion(){
        const config:Configuration = {
            id:null,
            name: name,
            startTime : startTime,
            endTime : endTime,
            attentionIntervals: attentionIntervals,
            breakIntervals:breakIntervals
        }
        setConfiguration(config);
        makeVisible(true);
    }
    const createConfiguracion = async () =>{
        const config:Configuration = {
            id:null,
            name: name,
            startTime : startTime,
            endTime : endTime,
            attentionIntervals: attentionIntervals,
            breakIntervals:breakIntervals
        }
        const response:Response = await CreateConfiguration(config);
        if(response.status == "201"){
            setConfiguration(config);
            resetFormulario(); 
        
        }
        setErrorMessage(response.message)
    }

    return (
        <div style={{ padding: "20px", fontFamily: "'Open Sans', sans-serif" }}>
            <PageTransitionWrapper>
                <Return text="" returnPoint=" /UserModule/ScheduleManagement/ConfigurationPage"/>
                <RectanguloConTextoConfiguration texto="Creacion de configuracion">
                    <div
                        style={{display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box",}}
                    >
                        <div style={{ width: "calc(30% - 20px)" }}>
                                <CampoTextoConfiguration
                                    etiqueta="Nombre"
                                    marcador="Digite el nombre de la configuración"
                                    value = {name}
                                    onChange= {(e) => setName(e.target.value)}
                                />
                                
                        </div>
                        <div style={{ width: "calc(30% - 20px)" }}>
                                <CampoSelectConfiguration
                                    etiqueta="Tiempo inicial"
                                    opciones={options}
                                    marcador="Elija el tiempo inicial de la configuracion"
                                    value = {startTime}
                                    onChange= {(e) => setStartTime(e.target.value)}
                                />
                                
                        </div>
                        <div style={{ width: "calc(30% - 20px)" }}>
                                <CampoSelectConfiguration
                                    etiqueta="Tiempo final"
                                    opciones={options}
                                    marcador="Elija el tiempo final de la configuracion"
                                    value = {endTime}
                                    onChange= {(e) => setEndTime(e.target.value)}
                                />
                                
                        </div>
                    </div>
                    <RectanguloConTextoConfiguration texto = "Intervalos de atencion" >
                        <div
                        style={{display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box",}}
                        >
                            <div style={{ width: "calc(30% - 20px)" }}>
                                <CampoTextoConfiguration
                                    etiqueta="Razon"
                                    marcador="Digite la razon del intervalo"
                                    value = {reason}
                                    onChange= {(e) => setReazon(e.target.value)}
                                />
                                
                            </div>
                            <div style={{ width: "calc(30% - 20px)" }}>
                                <CampoSelectConfiguration
                                    etiqueta="Tiempo inicial"
                                    opciones={options}
                                    marcador="Elija el tiempo inicial del intervalo"
                                    value = {intervalStartTime}
                                    onChange= {(e) => setIntervalStartTime(e.target.value)}
                                />
                                
                            </div>
                            <div style={{ width: "calc(30% - 20px)" }}>
                                <CampoSelectConfiguration
                                    etiqueta="Tiempo final"
                                    opciones={options}
                                    marcador="Elija el tiempo final del intervalo"
                                    value = {intervalEndTime}
                                    onChange= {(e) => setIntervalEndTime(e.target.value)}
                                />
                                
                            </div>
                        </div>
                        <div
                            style={{display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box",}}
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.005,
                                    transition: { duration: 0.15 },
                                }}
                            >
                                <button
                                    onClick={addAttentionInterval} // Ajusta esta ruta
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
                                    Añadir
                                </button>
                            </motion.div>
                            <motion.div
                                whileHover={{
                                    scale: 1.005,
                                    transition: { duration: 0.15 },
                                }}
                            >
                                <button
                                    onClick={deleteAttentionInterval} // Ajusta esta ruta
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
                                    Borrar intervalo
                                </button>
                            </motion.div>
                        </div>
                    </RectanguloConTextoConfiguration>
                    <RectanguloConTextoConfiguration texto = "Intervalos de descanso" >
                        <div
                        style={{display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box",}}
                        >
                            <div style={{ width: "calc(30% - 20px)" }}>
                                    <CampoTextoConfiguration
                                        etiqueta="Razon"
                                        marcador="Digite la razon del intervalo"
                                        value = {reasonBreak}
                                        onChange= {(e) => setReazonBreak(e.target.value)}
                                    />
                                    
                            </div>
                            <div style={{ width: "calc(30% - 20px)" }}>
                                    <CampoSelectConfiguration
                                        etiqueta="Tiempo inicial"
                                        opciones={options}
                                        marcador="Elija el tiempo inicial del intervalo"
                                        value = {intervalBreakStartTime}
                                        onChange= {(e) => setIntervalBreakStartTime(e.target.value)}
                                    />
                                    
                            </div>
                            <div style={{ width: "calc(30% - 20px)" }}>
                                    <CampoSelectConfiguration
                                        etiqueta="Tiempo final"
                                        opciones={options}
                                        marcador="Elija el tiempo final del intervalo"
                                        value = {intervalBreakEndTime}
                                        onChange= {(e) => setIntervalBreakEndTime(e.target.value)}
                                    />
                                    
                            </div>
                        </div>
                        <div
                            style={{display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box",}}
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.005,
                                    transition: { duration: 0.15 },
                                }}
                            >
                                <button
                                    onClick={addBreakInterval} // Ajusta esta ruta
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
                                    Añadir
                                </button>
                            </motion.div>
                            <motion.div
                                whileHover={{
                                    scale: 1.005,
                                    transition: { duration: 0.15 },
                                }}
                            >
                                <button
                                    onClick={deleteBreakInterval} // Ajusta esta ruta
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
                                    Borrar intervalo
                                </button>
                            </motion.div>
                        </div>
                    </RectanguloConTextoConfiguration>
                    <div
                        style={{display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box", marginTop: "20px", marginLeft: "30px" }}
                    >   
                        <motion.div
                            whileHover={{
                                scale: 1.005,
                                transition: { duration: 0.15 },
                            }}
                        >
                            <button
                                onClick={createConfiguracion} // Ajusta esta ruta
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
                                Crear
                            </button>
                        </motion.div>
                        <motion.div
                            whileHover={{
                                scale: 1.005,
                                transition: { duration: 0.15 },
                            }}
                        >
                            <button
                                onClick={previewConfiguracion} // Ajusta esta ruta
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
                                Previsualizar configuracion
                            </button>
                        </motion.div>
                    </div>
                </RectanguloConTextoConfiguration>
                    {configuration &&(
                        <FloatingConfigurationView visible={visible} onClose={() => closeWindow()}>
                                    <ConfigurationContainer name = {configuration.name} startTime={configuration.startTime} endTime={configuration.endTime} 
                                    attentionIntervals={configuration.attentionIntervals} breakIntervals={configuration.breakIntervals}>
                                    </ConfigurationContainer>
                        </FloatingConfigurationView>
                    )}
                    {errorMessage && (
                        <div style={{ marginTop: "30px" }}>
                            <ErrorMessage message={errorMessage} onClose={()=>{setErrorMessage(null)}} />
                        </div>
                    )}
            </PageTransitionWrapper>
        </div>
    )

}

export default CreateConfigurationPage
