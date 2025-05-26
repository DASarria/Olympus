import MenuAdminButtons from "@/components/MenuAdminButtons";
import elementosImage from "../../assets/images/juegos de mesa logo.png";
import reservasImage from "../../assets/images/reservaslogo.png";
import { useRouter } from "next/router";

const InicioSalasCreaUsuario = () => {
    const router = useRouter();
    const renderComponent = (componentKey:string) => {
        switch (componentKey) {
            case "ReservUser":
                router.push("/salasCrea/ReservUser");
                break;
            case "ReservOwnUser":
                router.push("/salasCrea/ReservOwnUser");
                break;
            default:
                break;
        }
    };
                return (
                    <div className="flex justify-center min-h-[60vh] flex-col">
                        <div className="flex flex-col bg-[#990000] text-white mb-10 max-w-[70vw] rounded-[16px] h-[20vh]">
                            <div className="flex items-center justify-center">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">Salas Recreacionales</h1>
                            </div>
                            <p className="text-lg sm:text-xl md:text-2xl pl-10">Información de las salas crea para tu uso personal.</p>
                        </div>
                        <div className="flex flex-wrap gap-6 ">
                            <MenuAdminButtons 
                            label="Reservas" 
                            componentKey="ReservUser" 
                            onClick={renderComponent} 
                            image ={reservasImage}
                            />
                            <MenuAdminButtons 
                            label="Mis Reservas" 
                            componentKey="ReservOwnUser" 
                            onClick={renderComponent} 
                            image ={elementosImage}
                            />
                        </div>
                    </div>
                );
        }

export default InicioSalasCreaUsuario;