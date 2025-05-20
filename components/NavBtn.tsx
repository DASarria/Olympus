import Link from 'next/link';

interface Props {
    image: { src: string };
    texto: string;
    navigate: string;
}

export const NavBtn = ({ image, texto, navigate }: Props) => {
    return (
        <Link href={navigate} passHref>
            <div className="w-80 flex flex-col items-center gap-2.5 px-10 py-5 h-[260px] overflow-hidden rounded-[20px] justify-center bg-white relative hover:shadow-[0px_5px_27px_4px_#99000040] cursor-pointer">
                <img
                className="w-[150px] object-cover h-[150px] relative"
                alt="service"
                src={image.src}
                />
                <div className="[font-family: 'Montserrat-Bold', Helvetica] self-stretch tracking-[0] text-2xl text-black font-bold text-center leading-[normal] relative">
                    {texto}
                </div>
            </div>
        </Link>
    )
}