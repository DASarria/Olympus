import { ReactNode } from 'react';
import ResponsiveMenu from './ResponsiveMenu';
import Header from './Header';
import { Footer } from './Footer';

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
    <div className="h-screen flex">
      {/* Menú lateral fijo en escritorio y menú inferior fijo en el celiular */}
      <div className='hidden md:flex'>
        <ResponsiveMenu />
      </div>
      {/* Este es el contenedor principal, con padding arriba para el header y abajo para el menú en móviles */}
      <div className="flex flex-1">
        {/* Este div maneja el scroll vertical y evita el horizontal */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full">
          <main className="h-full border-box break-words flex flex-col gap-[1.25rem]">
            <Header userName={userName} notificationsCount={notificationsCount} />
            {/* Utilicé un div con max-width 100% para asegurar que el contenido no cause scroll horizontal */}
            <div className="flex flex-col flex-grow max-w-[80%] w-full mx-auto gap-[1.25rem]">
              {children}
            </div>
            <Footer />
          </main>
        </div>
        <div className="md:hidden">
          <ResponsiveMenu />
        </div>
      </div>
    </div>
  );
};

export default Layout;