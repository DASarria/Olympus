import Link from 'next/link';
import { motion } from "framer-motion";

interface Props {
    image: { src: string };
    configurationName: string;
    intervalo:string;
    navigate: string;
}

export const ConfigBtn = ({ image, configurationName,intervalo, navigate }: Props) => {
    return (
        <Link href={navigate} passHref>
            <motion.div 
                key={navigate}
                className="max-w-[50vw]  flex flex-col items-center gap-2.5 px-4 py-5 max-h-[50vh]  overflow-hidden rounded-[15px] justify-center bg-red-50 relative hover:shadow-[0px_5px_27px_4px_#99000040] cursor-pointer"
                whileHover={{
                    scale: 1.005,
                    transition: { duration: 0.15 },
                }}
            >
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

            </motion.div>
        </Link>
    )
}
