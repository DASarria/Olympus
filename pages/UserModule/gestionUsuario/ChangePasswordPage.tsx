import RectanguloConTextoConfiguration from "@/components/gestionUsuario/RectanguloConTextoConfiguration"
import CampoTextoConfiguration from "@/components/gestionUsuario/CampoTextoConfiguration"
import { useState } from "react";
import { motion } from "framer-motion";
import ErrorMessage from "@/components/gestionUsuario/ErrorMessage";
import { Return } from "@/components/Return";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import { changePassword } from "@/pages/api/UserManagement/UserService";

const ChangePassword = () =>{
    const [password,setPassword] = useState<string>("");
    const [newPassword,setNewPassword] = useState<string>("");
    const [newPasswordConfirm,setNewPasswordConfirm] = useState<string>("");
    const [errorMessage,setErrorMessage] = useState<string|null>("");

    interface changePasswordDTO{
        password:string;
        newPassword:string;
        newPasswordConfirm:string;
    }
    interface Response{
        status:string;
        message:string;
        data:null;
    }
    const changePasswordAction = async () =>{
        const changePasswordDTO:changePasswordDTO ={
            password : password,
            newPassword: newPassword,
            newPasswordConfirm:newPasswordConfirm
        }
        const response:Response = await changePassword(changePasswordDTO);
        setErrorMessage(response.message)
        if(response.status == "401"){
            sessionStorage.clear();
        }
    }
    return(
        <div style={{ padding: "20px", fontFamily: "'Open Sans', sans-serif" }}>
            <PageTransitionWrapper>
                <Return text="" returnPoint="/UserModule/gestionUsuario/VerPerfil"/>
                <RectanguloConTextoConfiguration texto="Cambio de contraseña">
                    <div
                        style={{display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box",}}
                    >
                        <div style={{ width: "calc(30% - 20px)" }}>
                                <CampoTextoConfiguration
                                    etiqueta="Contraseña actual"
                                    marcador="Digite la contraseña actual"
                                    value = {password}
                                    onChange= {(e) => setPassword(e.target.value)}
                                />
                                
                        </div>
                    </div>
                    <div
                        style={{display: "flex", flexWrap: "wrap", gap: "5px 40px", width: "100%", boxSizing: "border-box",}}
                    >
                        
                        <div style={{ width: "calc(30% - 20px)" }}>
                                <CampoTextoConfiguration
                                    etiqueta="Contraseña nueva"
                                    marcador="Digite la nueva contraseña"
                                    value = {newPassword}
                                    onChange= {(e) => setNewPassword(e.target.value)}
                                />
                                
                        </div>
                        <div style={{ width: "calc(30% - 20px)" }}>
                                <CampoTextoConfiguration
                                    etiqueta="confirme la contraseña nueva"
                                    marcador="Digite la nueva contraseña"
                                    value = {newPasswordConfirm}
                                    onChange= {(e) => setNewPasswordConfirm(e.target.value)}
                                />
                                
                        </div>
                    </div>
                    
                    
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
                                onClick={changePasswordAction} // Ajusta esta ruta
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
                                Cambiar
                            </button>
                        </motion.div>
                    </div>
                </RectanguloConTextoConfiguration>
                {errorMessage && (
                    <div style={{ marginTop: "30px" }}>
                        <ErrorMessage message={errorMessage} onClose={()=>{setErrorMessage(null)}} />
                    </div>
                )}
            </PageTransitionWrapper>
        </div>
    )
}
export default ChangePassword;