import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const Layout = dynamic(() => import('../components/Layout'), { 
  ssr: false,
  loading: () => <div>Cargando...</div>
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Rutas donde NO mostrar Layout (actualizado)
  const noLayoutRoutes = ['/', '/login', '/Turnos']; // Ahora usa '/Turnos' directo
  
  // Verificación más flexible para subrutas
  const hideLayout = noLayoutRoutes.some(route => 
    router.pathname === route || router.pathname.startsWith(route + '/')
  );

  return hideLayout ? (
    <Component {...pageProps} />
  ) : (
    <Layout userName="Nombre de Usuario" notificationsCount={0}>
      <Component {...pageProps} />
    </Layout>
  );
}