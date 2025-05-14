import Link from 'next/link';

interface Props {
    image: { src: string };
    configurationName: string;
    intervalo:string;
    navigate: string;
}

export const ConfigBtn = ({ image, configurationName,intervalo, navigate }: Props) => {
    return (
        <Link href={navigate} passHref>
            <div className="w-full sm:w-80 md:w-[500px] lg:w-[600px] flex items-center gap-4 px-6 py-3 h-auto rounded-[12px] bg-gray-100 hover:bg-gray-200 cursor-pointer transition">
                
                <img
                className="w-16 h-16 object-cover rounded-md"
                alt="service"
                src={image.src}
                />
                
                <div className="text-black font-bold text-sm sm:text-base md:text-lg lg:text-xl leading-tight">
                {configurationName}
                </div>
                <div className="text-black font-bold text-sm sm:text-base md:text-lg lg:text-xl leading-tight">
                {intervalo}
                </div>

            </div>
        </Link>
    )
}
