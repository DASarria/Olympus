"use client";
import Link from "next/link";
import Image from "next/image";

interface OpcionesProps {
    title: string;
    imgSrc: string;
    href: string;
}

export default function Opciones({ title, imgSrc, href }: OpcionesProps) {
    if (!href) {
        console.warn("Opciones: 'href' está vacío o no definido");
        return null;
    }

    return (
        <Link href={href}>
            <div className="max-w-[230px] w-[230px] max-h-[180px] h-[160px] rounded-[20px] overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex justify-center mt-4">
                    <Image src={imgSrc} alt={title} width={100} height={60} />
                </div>
                <div className="text-center mt-4 font-semibold text-lg">{title}</div>
            </div>
        </Link>
    );
}
