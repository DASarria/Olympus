
import MenuAdminButtons from "@/components/MenuAdminButtons";
import prestamosImage from "../../assets/images/juegoslogo.png";
import elementosImage from "../../assets/images/juegos de mesa logo.png";
import reservasImage from "../../assets/images/reservaslogo.png";
import { useRouter } from "next/router";
import { useEffect } from "react";

const InicioSalasCreaADMIN = () => {
    const router = useRouter();

    const renderComponent = (componentKey:string) => {
        switch (componentKey) {
            case "SCRAdmin":
                router.push("/salasCrea/SCRAdmin");
                break;
            case "SCPAdmin":
                router.push("/salasCrea/SCPAdmin");
                break;
            case "SCERAdmin":
                router.push("/salasCrea/SCERAdmin");
                break;
            default:
                break;
        }
    };
                return (
                    <div className="flex justify-center min-h-[60vh] flex-col">
                        <div className="flex flex-col bg-[#990000] text-white mb-10 max-w-[70vw] rounded-[16px] h-[20vh]">
                            <div className="flex items-center justify-center">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">Salas Crea/Descanso</h1>
                            </div>
                            <p className="text-lg sm:text-xl md:text-2xl pl-10">Introducción a salas crea</p>
                        </div>

                        <div className="flex flex-wrap gap-6 ">
                            <MenuAdminButtons 
                            label="Reservas" 
                            componentKey="SCRAdmin" 
                            onClick={renderComponent} 
                            image ={reservasImage}
                            />

                            <MenuAdminButtons 
                            label="Prestamos" 
                            componentKey="SCPAdmin" 
                            onClick={renderComponent} 
                            image ={prestamosImage}
                            />

                            <MenuAdminButtons 
                            label="Elementos Recreativos" 
                            componentKey="SCERAdmin" 
                            onClick={renderComponent} 
                            image ={elementosImage}
                            />
                        </div>
                    </div>
                );
        }

export default InicioSalasCreaADMIN;
