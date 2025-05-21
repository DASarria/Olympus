import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { UserProvider } from '../context/UserContext';

// Esta línea es para importar Layout dinámicamente sin SSR, esto evita el error de sessionStorage
const Layout = dynamic(() => import('../components/Layout'), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuthPage = ['/', '/login'].includes(router.pathname);

  return isAuthPage ? (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  ) : (
    <UserProvider>
      <Layout userName="Nombre de Usuario" notificationsCount={0}>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}