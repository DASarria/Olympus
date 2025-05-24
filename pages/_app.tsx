import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import ProtectedRoute from "@/components/ProtectedRoute";



// Esta línea es para importar Layout dinámicamente sin SSR, esto evita el error de sessionStorage
const Layout = dynamic(() => import('../components/Layout'), { ssr: false });


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  

  // Muestro el layout solo si no estamos en la página de login, se pueden poner mas rutas pero por el momento dejé esas
  const isAuthPage = ['/', '/login'].includes(router.pathname);

  const rolesPermitidosPorRuta:Record<string,string[]> = {
    '/salasCrea/InicioSalasCreaADMIN':['SALA_ADMIN'],
    '/salasCrea/SCERAdmin':['SALA_ADMIN'],
    '/salasCrea/SCPAdmin':['SALA_ADMIN'],
    '/salasCrea/SCRAdmin':['SALA_ADMIN'],
    '/Dashboard':['SALA_ADMIN','STUDENT'],
    '/salasCrea/InicioSalasCreaUsuario':['STUDENT'],
    '/salasCrea/ReservUser':['STUDENT'],
    '/salasCrea/ReservOwnUser':['STUDENT'],
  };

  const allowedRoles = rolesPermitidosPorRuta[router.pathname];
  
  return isAuthPage ? (
      <Component {...pageProps} />
  ) : (
        <ProtectedRoute allowedRoles={allowedRoles}>
          <Layout notificationsCount={0}>
            <Component {...pageProps} />
          </Layout>
        </ProtectedRoute>
  );
}