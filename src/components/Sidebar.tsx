"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SidebarProps {
  role: "user" | "admin";
}

const Sidebar = ({ role }: SidebarProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 420);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const commonLinkStyle = `${isMobile ? "w-10 h-10" : "w-15 h-15"} rounded-full bg-white flex items-center justify-center`;

  return (
    <aside className={`
      ${isMobile 
        ? "h-auto w-full fixed bottom-0 flex-row justify-around py-2 border-t border-gray-200 " 
        : "h-screen w-22 flex-col items-center border-r border-gray-300 "}
      bg-[#F7F7F9] flex z-10
    `}>
      {!isMobile && (
        <div className="mb-10">
          <Link href="/">
            <div className="w-22 h-22 bg-red-800 flex items-center justify-center">
              <Image
                src="/logoECI.png"
                alt="Logo ECI"
                width={100}
                height={90}
                priority
              />
            </div>
          </Link>
        </div>
      )}

      <nav className={`flex ${isMobile ? "flex-row justify-around w-full" : "flex-col items-center space-y-8"}`}>
        {/* Deportes: siempre visible */}
        <Link href="/Deportes" className={commonLinkStyle}>
          <Image
            src="/deportes.png"
            alt="Deportes"
            width={isMobile ? 32 : 62}
            height={isMobile ? 32 : 62}
          />
        </Link>

        {/* Solo para usuario, no admin */}
        {role === "user" && (
          <>
            <Link href="/acompanamiento" className={commonLinkStyle}>
              <Image
                src="/Acompañamiento.png"
                alt="Acompañamiento"
                width={isMobile ? 32 : 62}
                height={isMobile ? 32 : 62}
              />
            </Link>

            <Link href="/cultura" className={commonLinkStyle}>
              <Image
                src="/cultura.png"
                alt="Cultura"
                width={isMobile ? 32 : 62}
                height={isMobile ? 32 : 62}
              />
            </Link>

            <Link href="/desarrollo-humano" className={commonLinkStyle}>
              <Image
                src="/desarrolloHumano.png"
                alt="Desarrollo Humano"
                width={isMobile ? 32 : 62}
                height={isMobile ? 32 : 62}
              />
            </Link>

            <Link href="/salud" className={commonLinkStyle}>
              <Image
                src="/salud.png"
                alt="Salud"
                width={isMobile ? 32 : 62}
                height={isMobile ? 32 : 62}
              />
            </Link>

            <Link href="/salud-mental" className={commonLinkStyle}>
              <Image
                src="/saludMental.png"
                alt="Salud Mental"
                width={isMobile ? 32 : 62}
                height={isMobile ? 32 : 62}
              />
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
