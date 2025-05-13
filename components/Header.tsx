import Image from 'next/image';
import logotransparente from "../assets/images/logotransparente.png";

interface HeaderProps {
  userName?: string;
  notificationsCount?: number;
}

const Header = ({ userName = 'Nombre de Usuario', notificationsCount = 0 }: HeaderProps) => {
  // Esta parte extrae iniciales para el avatar
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

      {/* Controles de usuario a la derecha, nombre y notificaciones */}
      <div className="flex items-center space-x-4 px-4">
        {/* Nombre de usuario (solo visible en escritorio) */}
        <span className="hidden md:block text-gray-700">
          {userName}
        </span>

        {/* Iniciales del usuario */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-400 text-white">
          {getInitials(userName)}
        </div>

        {/* Campanita de notificaciones */}
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Notificaciones"
          >
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

            {/* Solo muestro el contador si hay notificaciones y si hay más de 9, muestro "9+" para que no ocupe tanto espacio */}
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-600 rounded-full flex items-center justify-center text-white text-xs">
                {notificationsCount > 9 ? '9+' : notificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;