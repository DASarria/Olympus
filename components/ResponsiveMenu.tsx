
import logotransparente from "../assets/images/logotransparente.png";
import modulo1 from "../assets/images/1imagen.jpg";
import modulo2 from "../assets/images/2imagen.jpg";
import modulo3 from "../assets/images/3imagen.jpg";
import modulo4 from "../assets/images/4imagen.jpg";
import modulo5 from "../assets/images/5imagen.jpg";
import modulo6 from "../assets/images/6imagen.jpg";
import Image from "next/image";
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
        urlToNavigate: "/Module5",
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
    const role = sessionStorage.getItem("role");
  return (
    
    <div>
        {/* Esto es la vista de escritorio  */}
      <aside className="hidden md:block w-[6vw] min-h-screen bg-white rounded-r-lg "
      >
        
        <div className="space-y-0.5">
            <div className="bg-eci rounded-r-lg">
                <Image src={logotransparente} alt="ECI logo" />
            </div>
            
            <div className="flex flex-col items-center justify-center ">
                {modules.
                    filter((module => module.roleCanUse.some((r) => r === role)))
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
        </div >
      </aside>

    
    {/* Esto es la vista de movil */}
    
      <div className="md:hidden">
        <div className="bg-eci rounded-r-lg w-[14vw] ">
            <Image src={logotransparente} alt="ECI logo" />

        </div>
        <div className="flex flex-col justify-end h-[90vh] p-4 bg-white overflow-hidden">
            <div className="flex-grow" /> 
            <div className="flex space-x-4 justify-center mt-4 h-1/6">
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

    </div>
  );
};

export default ResponsiveMenu;