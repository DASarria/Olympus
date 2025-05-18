import Link from 'next/link';
import { motion } from "framer-motion";


/**
 * Props interface for the NavBtn component.
 * 
 * @interface
 */
interface Props {
    image: { src: string };
    texto: string;
    navigate: string;
}

/**
 * NavBtn Component
 * 
 * This component renders a clickable navigation button with an image and text. It uses `motion.div` from `framer-motion` 
 * to provide hover effects and animations. The button is wrapped with a Next.js `Link` component for client-side navigation.
 * 
 * @component
 * @example
 * // Usage of NavBtn component
 * <NavBtn 
 *   image={{ src: '/path/to/image.jpg' }} 
 *   texto="Navigate to Dashboard" 
 *   navigate="/dashboard" 
 * />
 * 
 * @param {Props} props - The props for the NavBtn component.
 * @returns {JSX.Element} The rendered navigation button with hover animation and linked navigation.
 */
export const NavBtn = ({ image, texto, navigate }: Props) => {
    return (
        <Link href={navigate} passHref>
            <motion.div
                key={navigate}
                className="w-80 flex flex-col items-center gap-2.5 px-10 py-5 h-[260px] overflow-hidden rounded-[20px] justify-center bg-white relative hover:shadow-[0px_5px_27px_4px_#99000040] cursor-pointer"
                whileHover={{
                    scale: 1.005,
                    transition: { duration: 0.15 },
                }}
            >
                <img
                className="w-[150px] object-cover h-[150px] relative"
                alt="service"
                src={image.src}
                />
                <div className="[font-family: 'Montserrat-Bold', Helvetica] self-stretch tracking-[0] text-2xl text-black font-bold text-center leading-[normal] relative">
                    {texto}
                </div>
            </motion.div>
        </Link>
    )
}