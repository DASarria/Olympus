import modulo1 from "@/assets/images/1imagen.jpg";
import modulo2 from "@/assets/images/2imagen.jpg";
import modulo3 from "@/assets/images/3imagen.jpg";
import modulo4 from "@/assets/images/4imagen.jpg";
import modulo5 from "@/assets/images/5imagen.jpg";
import modulo6 from "@/assets/images/6imagen.jpg";
import logotransparente from "@/assets/images/logotransparente.png";
import Module from "./Module";

const modules = [
    {
        moduleName: "module 1",
        roleCanUse: ["admin", "usuario"],
        urlToNavigate: "/Module1",
        image: modulo1,
    },
    {
        moduleName: "module 2",
        roleCanUse: ["admin"],
        urlToNavigate: "/Module2",
        image: modulo2,
    },
    {
        moduleName: "module 3",
        roleCanUse: ["admin", "usuario"],
        urlToNavigate: "/Module3",
        image: modulo3,
    },
    {
        moduleName: "module 4",
        roleCanUse: ["admin"],
        urlToNavigate: "/Module4",
        image: modulo4,
    },
    {
        moduleName: "module 5",
        roleCanUse: ["admin"],
        urlToNavigate: "/gym-module",
        image: modulo5,
    },
    {
        moduleName: "module 6",
        roleCanUse: ["admin"],
        urlToNavigate: "/Module6",
        image: modulo6,
    }
];

const ResponsiveMenu = () => {
    const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;

    return (
        <>
            {/* Vista de escritorio, le quité el logo para que se viera bien el body*/}
            <aside className="hidden md:inline-flex flex-col w-[7rem] items-start gap-[5px] relative bg-neutrallightgray h-full fixed left-0 top-0 z-50">
                <div className="flex flex-col items-center justify-center px-0 py-2.5 relative self-stretch w-full flex-[0_0_auto] bg-[var(--primary-red)]">
                    <img 
                        alt="logo"
                        src={logotransparente.src}
                    >
                    </img>
                </div>
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
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
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
            </nav>
        </>
    );
};

export default ResponsiveMenu;