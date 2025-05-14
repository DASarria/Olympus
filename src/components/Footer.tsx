"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Footer = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Function to check if screen width is over 640px
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isDesktop) {
    return null; // Don't render on mobile
  }

  return (
    <footer className="w-full bg-[#333333] text-white py-4 px-6">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-xs">
        <div className="mb-2 sm:mb-0 text-center sm:text-left">
          © 2025 - Escuela Colombiana de Ingeniería Julio Garavito. Todos los derechos reservados.
        </div>
        <div className="flex items-center gap-2 text-center">
          <span>UX, Diseño y Desarrollo por CVDS Company.</span>
          <Link href="https://cvds.company" aria-label="CVDS Company website">
            <div className="w-12 h-12  flex items-center justify-center ">
                <Image
                    src="/CVDScompany.png"
                    alt="CVDScompany"
                    width={20}
                    height={20}
                    priority
                />
                </div>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;