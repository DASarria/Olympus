"use client"
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";


interface HeaderProps {
    role: string;
    initials: string;
    showBackButton?: boolean;
}

const Header = ({ role, initials, showBackButton = false }: HeaderProps) => {
    const router = useRouter();

    return (
        <header className="w-full py-4 min-h-22 pl-0 pr-8 flex items-center justify-between border-b border-gray-300 bg-white">
            <div className="flex-1 flex items-center">
                {showBackButton && (
                    <button
                        onClick={() => router.back()}
                        className="ml-4 flex items-center text-black-700 hover:text-black-900"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Atrás
                    </button>
                )}
            </div>

            <div className="flex items-center space-x-8">
        <span className="font-medium text-lg text-black dark:text-black">
          {role}
        </span>
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-800">
                    {initials}
                </div>
                {/* Mostrar el icono de notificaciones solo para Usuario */}
                {role === "Usuario" && (
                    <button className="p-2 text-black dark:text-black" aria-label="Notifications">
                        {/* Icono de campana */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;