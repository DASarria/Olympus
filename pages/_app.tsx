import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Esta línea es para importar Layout dinámicamente sin SSR, esto evita el error de sessionStorage
const Layout = dynamic(() => import('../components/Layout'), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Muestro el layout solo si no estamos en la página de login, se pueden poner mas rutas pero por el momento dejé esas
  const isAuthPage = ['/', '/login'].includes(router.pathname);

  return isAuthPage ? (
      <Component {...pageProps} />
  ) : (
      <Layout userName="Nombre de Usuario" notificationsCount={0}>
        <Component {...pageProps} />
      </Layout>
  );
}