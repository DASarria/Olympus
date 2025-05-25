import Image from 'next/image';
import Link from 'next/link';
import logotransparente from "../assets/images/logotransparente.png";
import { useEffect, useState } from 'react';

interface HeaderProps {
  notificationsCount?: number;
}

const Header = ({ notificationsCount = 0 }: HeaderProps) => {
  const [userName, setUserName] = useState<string>('Nombre de Usuario');
  const [userRole, setUserRole] = useState<string | null>(null);

  // Función para decodificar el token
  const decodeToken = (token: string): any => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  useEffect(() => {
    const rawToken = sessionStorage.getItem("token");
    if (rawToken && rawToken.startsWith("Bearer ")) {
      const token = rawToken.split(" ")[1]; // Quitar "Bearer "
      const decoded = decodeToken(token);
      if (decoded) {
        setUserName(decoded.name || 'Nombre de Usuario');
        setUserRole(decoded.role || null);
      }
    }
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex w-full justify-between items-center h-14">
      <div className="w-[14vw] md:w-[6vw] h-14 bg-eci flex items-center justify-center">
        <Image
          src={logotransparente}
          alt="ECI logo"
          className="h-auto w-full object-contain"
        />
      </div>

      <div className="flex items-center space-x-4 px-4">
        <span className="hidden md:block text-gray-700">
          {userName}
        </span>

        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-400 text-white">
          {getInitials(userName)}
        </div>

        {(userRole === "STUDENT" || userRole === "TEACHER") && (
          <div className="relative">
            <Link href="/prestamosDeportivos/Notificaciones" aria-label="Notificaciones" className="p-2 rounded-full hover:bg-gray-100 inline-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notificationsCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-600 rounded-full flex items-center justify-center text-white text-xs">
                  {notificationsCount > 9 ? '9+' : notificationsCount}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
