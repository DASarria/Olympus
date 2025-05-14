import Image, { StaticImageData } from "next/image";

interface MenuAdminButtonsProps {
    label: string;
    componentKey: string;
    onClick: (componentKey:string) => void;
    image: StaticImageData;
}

const MenuAdminButtons = ({label,componentKey,onClick,image}:MenuAdminButtonsProps) => {

  return (
    
    <button className="bg-white rounded-[20px] w-[250px] h-[250px] drop-shadow-xl 
                       flex items-center justify-center gap-2 flex-col hover:bg-[#990000] hover:text-white"
        onClick={() => onClick(componentKey)}
        >
            <div>
                <Image
                    src={image}
                    alt={label}
                    className="rounded-[10px] w-[7vw]"
                />
            </div>
        <span>
            {label}
        </span>
    </button>
    
  );
};

export default MenuAdminButtons;