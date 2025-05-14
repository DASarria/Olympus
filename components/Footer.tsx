import cvdsLogo from '@/assets/icons/cvds.svg';

// Footer solo en escritorio
export const Footer = () => {
    return (
        <footer className="fixed flex flex-col w-full items-center justify-center gap-2.5 px-20 py-5 relative bg-[#333333]">
            <p className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Regular', Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal]">
            © 2025 - Escuela Colombiana de Ingeniería Julio Garavito. Todos los derechos reservados.
            </p>
            <p className="relative w-fit [font-family: 'Montserrat-Regular', Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal]">
            <span className="[font-family: 'Montserrat-Regular', Helvetica] font-normal text-white text-sm tracking-[0]">
                UX, Diseño y Desarrollo por{" "}
            </span>
            <span className="[font-family: 'Montserrat-Regular', Helvetica] font-bold">
                CVDS Company
            </span>
            <span className="[font-family: 'Montserrat-Regular', Helvetica] font-normal text-white text-sm tracking-[0]">
                .
            </span>
            </p>
            <img
            className='relative w-7 h-[18px] object-cover'
            alt="cvdsLogo"
            src={cvdsLogo.src}
            />
        </footer>
    )
}