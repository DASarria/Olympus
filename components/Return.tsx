import Link from "next/link";
import arrowLeft from "@/assets/icons/ArrowLeft.svg";

interface Props {
    className: any;
    text: string;
    returnPoint: string;
}

export const Return = ({ className, text = "Titulo", returnPoint}: Props) => {
    return (
        <div className={`flex w-full items-center gap-10 relative ${className}`}>
            <Link href={returnPoint}>
                <img
                    src={arrowLeft.src}
                    alt="Flecha de regreso"
                    className="!relative !w-[55px] !h-11 cursor-pointer"
                />
            </Link>
            <div className="relative w-fit font-titulo font-[number:var(--titulo-font-weight)] text-variable-collection-texto-parrafo text-[length:var(--titulo-font-size)] tracking-[var(--titulo-letter-spacing)] leading-[var(--titulo-line-height)] whitespace-nowrap [font-style:var(--titulo-font-style)]">
                {text}
            </div>
        </div>
    );
};