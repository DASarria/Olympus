import { useState } from "react";
import SCRAdmin from "./SCRAdmin";
import SCPAdmin from "./SCPAdmin";
import SCERAdmin from "./SCERAdmin";

const InicioSalasCreaADMIN = () => {
    const [componentToShow, setComponentToShow] = useState("");

    const renderComponent = () => {
        switch (componentToShow) {
            case "SCRAdmin":
                return <SCRAdmin />;
            case "SCPAdmin":
                return <SCPAdmin />;
            case "SCERAdmin":
                return <SCERAdmin />;
            default:
                return (
                    <div>
                        <h1>Salas Crea/Descanso</h1>
                        <p>Introducción a salas crea</p>
                        <div className="flex gap-4">
                            <button onClick={() => setComponentToShow("SCRAdmin")} className="border-2">Reservas</button>
                            <button onClick={() => setComponentToShow("SCPAdmin")} className="border-2">Préstamos</button>
                            <button onClick={() => setComponentToShow("SCERAdmin")} className="border-2">Elementos Recreativos</button>
                        </div>
                    </div>
                );
        }
    };

    return <div>{renderComponent()}</div>;
};

export default InicioSalasCreaADMIN;
