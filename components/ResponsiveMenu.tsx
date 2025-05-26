
import modulo1 from "../assets/images/1imagen.jpg";
// import modulo2 from "../assets/images/2imagen.jpg";
import modulo3 from "../assets/images/3imagen.jpg";
import modulo4 from "../assets/images/4imagen.jpg";
import modulo5 from "../assets/images/5imagen.jpg";
import modulo6 from "../assets/images/6imagen.jpg";
import Module from "./Module";

const modules = [
    {
        moduleName: "module 1",
        roleCanUse: ["ADMIN", "usuario"],
        urlToNavigate: "/Module1",
        image: modulo1,
    },
    {
        moduleName: "module 2",
        roleCanUse: ["STUDENT"],
        urlToNavigate: "/salasCrea/InicioSalasCreaUsuario",
        image: modulo3,
    },
    {
        moduleName: "module 2_Admin",
        roleCanUse: ["SALA_ADMIN"],
        urlToNavigate: "/salasCrea/InicioSalasCreaADMIN",
        image: modulo3,
    },
    {
        moduleName: "module 4",
        roleCanUse: ["ADMIN"],
        urlToNavigate: "/Module4",
        image: modulo4,
    },
    {
        moduleName: "module 5",
        roleCanUse: ["ADMIN", "STUDENT", "TRAINER"],
        urlToNavigate: "/gym-module",
        image: modulo5,
    },
    {
        moduleName: "module 6",
        roleCanUse: ["ADMIN"],
        urlToNavigate: "/Module6",
        image: modulo6,
    }
];

const ResponsiveMenu = () => {
    const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;

    return (
        <div>
            {/* Vista de escritorio, le quité el logo para que se viera bien el body*/}
            <aside className="hidden md:block w-[6vw] bg-white rounded-r-lg">
                <div className="flex flex-col items-center justify-center py-4">
                    {modules
                        .filter((module => module.roleCanUse.some((r) => r === role)))
                        .map((module, index) => (
                        <Module
                            key={index+1}
                            moduleName={module.moduleName}
                            roleCanUse={module.roleCanUse}
                            urlToNavigate={module.urlToNavigate}
                            image={module.image}
                        />
                    ))}
                </div>
            </aside>

            {/* Vista de móvil, le quité el logo para que se viera bien el body*/}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                <div className="flex justify-center items-center p-2 space-x-2">
                    {modules
                        .filter((module) => module.roleCanUse.some((r) => r === role))
                        .map((module, index) => (
                        <Module
                            key={index + 1}
                            moduleName={module.moduleName}
                            roleCanUse={module.roleCanUse}
                            urlToNavigate={module.urlToNavigate}
                            image={module.image}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResponsiveMenu;