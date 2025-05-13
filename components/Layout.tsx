import { ReactNode } from 'react';
import ResponsiveMenu from './ResponsiveMenu';
import Header from './Header';
import cvdsLogo from '@/assets/icons/cvds.svg';

interface LayoutProps {
  children?: ReactNode;
  userName?: string;
  notificationsCount?: number;
}

const Layout = ({
  children,
  userName = 'Nombre de Usuario',
  notificationsCount = 0
}: LayoutProps) => {
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
      <footer className="flex flex-col w-full items-center justify-center gap-2.5 px-20 py-5 relative bg-[#333333]">
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
    </div>
  );
};

export default Layout;