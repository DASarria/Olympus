"use client";
import Link from "next/link";
import Image from "next/image";

interface OpcionesProps {
    title: string;
    imgSrc: string;
    href: string;
}

export default function Opciones({ title, imgSrc, href }: Readonly<OpcionesProps>) {
    if (!href) {
        console.warn("Opciones: 'href' está vacío o no definido");
        return null;
    }

    return (
        <Link href={href} className="inline-block w-[210px] h-[160px]">
            <div className="w-full h-full rounded-[20px] overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow cursor-pointer flex flex-col items-center justify-center">
                <Image src={imgSrc} alt={title} width={90} height={50} />
                <div className="font-semibold text-lg mt-1 text-center">{title}</div>
            </div>
        </Link>

    );
}
