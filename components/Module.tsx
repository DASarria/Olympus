
import Image, { StaticImageData} from "next/image";
import { useRouter } from "next/router";

interface ModuleProps {
  moduleName: string;
  roleCanUse: string[];
  urlToNavigate: string;
  image: StaticImageData;
}

const Module = (props:ModuleProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(props.urlToNavigate);
  }
  return (
    <div className="group relative flex items-center justify-center p-2 cursor-pointer"
         onClick={handleClick}>
      <div 
      className="absolute w-[12vw] h-[12vw] 
                   md:w-[6vw] md:h-[6vw] rounded-full group-hover:bg-[#990000]  
                  transition-colors duration-300 z-0">

      </div>
      <Image src={props.image} alt="modulo"
              className="rounded-full w-[9vw] z-10"/>
      
    </div>
    
  );
};

export default Module;