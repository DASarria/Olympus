import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface ButtonConfig {
  key: string;
  label: string;
  icon: string;
  route: string;
  requiredSection: string;
}

const ModuloSalud = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configuración de permisos por rol
  const rolePermissions = {
    'ADMIN': ['turnos', 'analisis', 'sala', 'entrada', 'contenido_visual'],
    'MEDICAL_SECRETARY': ['turnos', 'analisis', 'sala', 'entrada', 'contenido_visual'],
    'DOCTOR': ['turnos'],
  };

  // Configuración de botones
  const buttons: ButtonConfig[] = [
    {
      key: 'turnos',
      label: 'Turnos',
      icon: '📝',
      route: '/ModuloSalud/TurnosGestion',
      requiredSection: 'turnos'
    },
    {
      key: 'analisis',
      label: 'Análisis',
      icon: '📊',
      route: '/ModuloSalud/AnalisisSalud',
      requiredSection: 'analisis'
    },
    {
      key: 'sala',
      label: 'Sala de espera',
      icon: '🪑',
      route: '/ModuloSalud/SalaDeEspera',
      requiredSection: 'sala'
    },
    {
      key: 'entrada',
      label: 'Pantalla entrada',
      icon: '🚪',
      route: '/ModuloSalud/Pantalla_Entrada/Especialidad',
      requiredSection: 'entrada'
    },
    {
      key: 'contenido_visual',
      label: 'Contenido visual',
      icon: '🔍',
      route: '/ModuloSalud/Contenido_Visual',
      requiredSection: 'contenido_visual'
    }
  ];

  // Función para obtener el token
  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token');
    }
    return null;
  };

  // Función para obtener el rol del usuario
  const getUserRole = (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('role');
    }
    return null;
  };


  // Función para verificar si está autenticado
  const isAuthenticated = (): boolean => {
    const token = getToken();
    const role = getUserRole();
    return !!(token && role);
  };

  // Función para verificar si el usuario puede acceder a una sección
  const canAccess = (section: string): boolean => {
    if (!userRole) return false;
    const permissions = rolePermissions[userRole as keyof typeof rolePermissions];
    return permissions ? permissions.includes(section) : false;
  };

  // Función para obtener el nombre del rol para mostrar
  const getRoleDisplayName = (role: string | null): string => {
    const roleNames: Record<string, string> = {
      'ADMIN': 'Administrador',
      'Medical_Secretary': 'Secretario Médico',
      'DOCTOR': 'Doctor',
    };
    return role ? roleNames[role] || role : 'Usuario';
  };

  // Función para manejar clicks en botones
  const handleButtonClick = (button: ButtonConfig) => {
    // Verificar si el usuario tiene permisos para acceder a esta sección
    if (!canAccess(button.requiredSection)) {
      alert(`No tienes permisos para acceder a ${button.label}. Tu rol actual es: ${getRoleDisplayName(userRole)}`);
      return;
    }

    router.push(button.route);
  };

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    const role = getUserRole();
    setUserRole(role);
    setIsLoading(false);
  }, [router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
        <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center">
          <div className="text-lg">Verificando permisos...</div>
        </div>
    );
  }

  // Filtrar botones según los permisos del usuario
  const accessibleButtons = buttons.filter(button => canAccess(button.requiredSection));

  // Verificar si es un rol con permisos limitados
  const hasLimitedAccess = userRole && ['DOCTOR', 'Dentistry', 'Psychology', 'General_Medicine'].includes(userRole);

  return (
      <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-start bg-white-50 pt-8 pb-20 px-4">
        {/* Header con información del usuario */}
        <div className="bg-red-600 text-white text-center p-4 rounded-lg shadow-md mb-4 w-full max-w-md">
          <h2 className="text-xl font-bold mb-2">MODULO DE SALUD</h2>
          <p className="text-sm mb-3">
            Gestiona de forma óptima los turnos, teniendo espacios para revisar los turnos actuales y
            siguientes correspondientes a cada área de la salud.
          </p>
        </div>

        {/* Grid de botones - adaptativo según permisos */}
        <div className={`grid gap-4 w-full max-w-md mb-6 ${
            accessibleButtons.length <= 2 ? 'grid-cols-1' :
                accessibleButtons.length === 3 ? 'grid-cols-1' :
                    'grid-cols-2'
        }`}>
          {accessibleButtons.map((button) => (
              <button
                  key={button.key}
                  onClick={() => handleButtonClick(button)}
                  className="bg-white rounded-lg p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 h-32 border border-gray-200 hover:bg-gray-50 hover:scale-105"
              >
                <span className="text-gray-700 text-3xl mb-2">{button.icon}</span>
                <span className="text-gray-700 font-medium text-center">{button.label}</span>
              </button>
          ))}
        </div>

        {/* Note: hasLimitedAccess is defined but not used. If you need it for conditional rendering, add your logic here */}
        {hasLimitedAccess && (
            <div className="text-sm text-gray-500 text-center">
              Acceso limitado según tu rol: {getRoleDisplayName(userRole)}
            </div>
        )}
      </div>
  );
};

export default ModuloSalud;