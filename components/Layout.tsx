import { ReactNode } from 'react';
import ResponsiveMenu from './ResponsiveMenu';
import Header from './Header';
import {useState, useEffect} from "react"

interface LayoutProps {
  children?: ReactNode;
  userName?: string;
  notificationsCount?: number;
}

const Layout = ({
  children,
  notificationsCount = 0
}: LayoutProps) => {
    const [userName, setUserName] = useState<string>("")
  
    useEffect(()=>{
      const storedName = sessionStorage.getItem("name");
      if(storedName){
        setUserName(storedName);
      }
    },[]);
  return (
    <div className="h-screen flex flex-col">
      {/* El header siempre está fijo en la parte superior */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-gray-200">
        <Header userName={userName} notificationsCount={notificationsCount} />
      </div>

      {/* Este es el contenedor principal, con padding arriba para el header y abajo para el menú en móviles */}
      <div className="flex flex-1 pt-14 pb-16 md:pb-0 md:pl-[6vw]">
        {/* Este div maneja el scroll vertical y evita el horizontal */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full">
          <main className="p-4 min-h-full break-words">
            {/* Utilicé un div con max-width 100% para asegurar que el contenido no cause scroll horizontal */}
            <div className="max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Menú lateral fijo en escritorio y menú inferior fijo en el celiular */}
      <div className="fixed z-20 bottom-0 left-0 right-0 md:bottom-auto md:right-auto md:top-14">
        <ResponsiveMenu />
      </div>

      {/* Footer solo en escritorio */}
      <footer className="hidden md:block fixed bottom-0 right-0 left-[6vw] z-10 bg-gray-800 text-white p-4 text-center text-sm">
        <p>© 2025 - Escuela Colombiana de Ingeniería Julio Garavito. Todos los derechos reservados.</p>
        <p className="text-gray-400">UX, Diseño y Desarrollo por: CVDS Company</p>
      </footer>
    </div>
  );
};

export default Layout;