"use client";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import api from "@/services/api";

interface Alert {
    id: string;
    relatedEntity?: string;
    description?: string;
    message: string;
    timestamp: string;
}

interface AlertasArticulosResponse {
    id: string;
    relatedEntity: string;
    message: string;
    timestamp: string;
}

interface AlertasPrestamosResponse {
    totalAlertas: number;
    page: number;
    size: number;
    alertas: Array<{
        id: string;
        description: string;
        message: string;
        timestamp: string;
    }>;
}

interface Notification extends Alert {
    type: 'articulo' | 'prestamo';
    title: string;
    priority: 'low' | 'medium' | 'high';
    isPersonal: boolean;
    category: 'personal' | 'students' | 'equipment' | 'system';
}

export default function NotificacionesPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filtro, setFiltro] = useState<'todos' | 'personales' | 'estudiantes' | 'equipos' | 'sistema'>('todos');
    const [prioridadFiltro, setPrioridadFiltro] = useState<'todas' | 'high' | 'medium' | 'low'>('todas');
    const [diasFiltro, setDiasFiltro] = useState<number>(7);

    // Información del usuario actual - Profesor
    const [currentUser] = useState('Juan-cely-l');
    const [userRole] = useState<'student' | 'teacher'>('teacher');
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    useEffect(() => {
        cargarNotificaciones();
        // Auto-actualizar cada 5 minutos para profesores
        const interval = setInterval(cargarNotificaciones, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [diasFiltro]);

    const cargarNotificaciones = async () => {
        setLoading(true);
        setError(null);

        try {
            // Para profesores, cargamos alertas más amplias que para estudiantes
            const alertasPrestamosPromise = api.get(
                `/LoanArticle/alerts?userId=${currentUser}&days=${diasFiltro}&size=100`
            );

            // También alertas generales del sistema para gestión de clases
            const alertasArticulosPromise = api.get('/Article/alerts');

            // Alertas adicionales de estudiantes bajo supervisión (simulado)
            const alertasEstudiantesPromise = api.get(
                `/LoanArticle/alerts?days=${diasFiltro}&size=50`
            );

            const [alertasPrestamosResponse, alertasArticulosResponse, alertasEstudiantesResponse] = await Promise.allSettled([
                alertasPrestamosPromise,
                alertasArticulosPromise,
                alertasEstudiantesPromise
            ]);

            const notificacionesConvertidas: Notification[] = [];

            // Procesar alertas personales del profesor
            if (alertasPrestamosResponse.status === 'fulfilled') {
                const alertasPrestamos: AlertasPrestamosResponse = alertasPrestamosResponse.value.data;

                alertasPrestamos.alertas.forEach(alerta => {
                    notificacionesConvertidas.push({
                        ...alerta,
                        type: 'prestamo',
                        title: determinarTituloPrestamo(alerta.message),
                        priority: determinarPrioridadPrestamo(alerta.message),
                        relatedEntity: alerta.description,
                        isPersonal: esAlertaPersonal(alerta.message, alerta.description),
                        category: esAlertaPersonal(alerta.message, alerta.description) ? 'personal' : 'students'
                    });
                });
            }

            // Procesar alertas de equipos (importantes para planificación de clases)
            if (alertasArticulosResponse.status === 'fulfilled') {
                const alertasArticulos: AlertasArticulosResponse[] = alertasArticulosResponse.value.data;

                alertasArticulos.forEach(alerta => {
                    notificacionesConvertidas.push({
                        ...alerta,
                        type: 'articulo',
                        title: `📦 Inventario: ${alerta.relatedEntity}`,
                        priority: determinarPrioridadArticuloProfesor(alerta.message),
                        description: alerta.relatedEntity,
                        isPersonal: false,
                        category: 'equipment'
                    });
                });
            }

            // Procesar alertas de estudiantes (para supervisión pedagógica)
            if (alertasEstudiantesResponse.status === 'fulfilled') {
                const alertasEstudiantes: AlertasPrestamosResponse = alertasEstudiantesResponse.value.data;

                // Filtrar alertas de estudiantes relevantes para el profesor
                const alertasEstudiantesRelevantes = alertasEstudiantes.alertas.filter(alerta =>
                    !esAlertaPersonal(alerta.message, alerta.description) &&
                    esAlertaRelevanteProfesora(alerta.message)
                );

                alertasEstudiantesRelevantes.forEach(alerta => {
                    notificacionesConvertidas.push({
                        ...alerta,
                        type: 'prestamo',
                        title: `👥 ${determinarTituloEstudiante(alerta.message)}`,
                        priority: determinarPrioridadEstudiante(alerta.message),
                        relatedEntity: alerta.description,
                        isPersonal: false,
                        category: 'students'
                    });
                });
            }

            // Ordenar por categoría y prioridad específica para profesores
            notificacionesConvertidas.sort((a, b) => {
                // Primero alertas personales
                if (a.category === 'personal' && b.category !== 'personal') return -1;
                if (a.category !== 'personal' && b.category === 'personal') return 1;

                // Luego alertas de estudiantes (importantes para profesores)
                if (a.category === 'students' && b.category !== 'students' && b.category !== 'personal') return -1;
                if (a.category !== 'students' && b.category === 'students' && a.category !== 'personal') return 1;

                // Luego por prioridad
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
                if (priorityDiff !== 0) return priorityDiff;

                // Finalmente por fecha
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            });

            setNotifications(notificacionesConvertidas);
            setLastUpdate(new Date());

        } catch (err: any) {
            console.error('Error al cargar notificaciones:', err);
            setError('Error al cargar las notificaciones. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const esAlertaPersonal = (mensaje: string, descripcion: string): boolean => {
        const mensajeLower = mensaje.toLowerCase();
        const descripcionLower = descripcion.toLowerCase();
        const userLower = currentUser.toLowerCase();

        return mensajeLower.includes(userLower) ||
               descripcionLower.includes(userLower) ||
               mensajeLower.includes('profesor') ||
               mensajeLower.includes('docente');
    };

    const esAlertaRelevanteProfesora = (mensaje: string): boolean => {
        const mensajeLower = mensaje.toLowerCase();
        // Alertas relevantes para seguimiento de estudiantes
        return mensajeLower.includes('vencido') ||
               mensajeLower.includes('retrasado') ||
               mensajeLower.includes('dañado') ||
               mensajeLower.includes('perdido') ||
               mensajeLower.includes('estudiante');
    };

    const determinarPrioridadArticuloProfesor = (mensaje: string): 'low' | 'medium' | 'high' => {
        const mensajeLower = mensaje.toLowerCase();
        // Para profesores, la falta de equipos es más crítica (afecta clases)
        if (mensajeLower.includes('0 disponibles') || mensajeLower.includes('agotado')) {
            return 'high';
        } else if (mensajeLower.includes('1 disponible') || mensajeLower.includes('2 disponibles')) {
            return 'medium';
        }
        return 'low';
    };

    const determinarPrioridadPrestamo = (mensaje: string): 'low' | 'medium' | 'high' => {
        const mensajeLower = mensaje.toLowerCase();
        if (mensajeLower.includes('vencido') || mensajeLower.includes('retrasado')) {
            return 'high';
        } else if (mensajeLower.includes('recordatorio') || mensajeLower.includes('devolución pendiente')) {
            return 'medium';
        }
        return 'low';
    };

    const determinarPrioridadEstudiante = (mensaje: string): 'low' | 'medium' | 'high' => {
        const mensajeLower = mensaje.toLowerCase();
        if (mensajeLower.includes('vencido') || mensajeLower.includes('dañado') || mensajeLower.includes('perdido')) {
            return 'high';
        } else if (mensajeLower.includes('retrasado') || mensajeLower.includes('recordatorio')) {
            return 'medium';
        }
        return 'low';
    };

    const determinarTituloPrestamo = (mensaje: string): string => {
        const mensajeLower = mensaje.toLowerCase();
        if (mensajeLower.includes('vencido')) {
            return '⚠️ Mi Préstamo Vencido';
        } else if (mensajeLower.includes('recordatorio')) {
            return '📅 Recordatorio Personal';
        } else if (mensajeLower.includes('nuevo préstamo')) {
            return '📋 Mi Nuevo Préstamo';
        } else if (mensajeLower.includes('actualizado')) {
            return '✏️ Préstamo Actualizado';
        } else if (mensajeLower.includes('devuelto')) {
            return '✅ Préstamo Devuelto';
        }
        return '📋 Notificación Personal';
    };

    const determinarTituloEstudiante = (mensaje: string): string => {
        const mensajeLower = mensaje.toLowerCase();
        if (mensajeLower.includes('vencido')) {
            return 'Estudiante con Préstamo Vencido';
        } else if (mensajeLower.includes('dañado')) {
            return 'Equipo Reportado como Dañado';
        } else if (mensajeLower.includes('perdido')) {
            return 'Equipo Reportado como Perdido';
        } else if (mensajeLower.includes('recordatorio')) {
            return 'Recordatorio a Estudiante';
        }
        return 'Actividad de Estudiante';
    };

    const formatearFecha = (timestamp: string): string => {
        try {
            const fecha = new Date(timestamp);
            const ahora = new Date();
            const diferencia = ahora.getTime() - fecha.getTime();
            const minutos = Math.floor(diferencia / (1000 * 60));
            const horas = Math.floor(diferencia / (1000 * 60 * 60));
            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

            if (minutos < 1) {
                return 'Hace un momento';
            } else if (minutos < 60) {
                return `Hace ${minutos} min`;
            } else if (horas < 24) {
                return `Hace ${horas}h`;
            } else if (dias < 7) {
                return `Hace ${dias}d`;
            } else {
                return fecha.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        } catch {
            return timestamp;
        }
    };

    const obtenerIconoPrioridad = (priority: 'low' | 'medium' | 'high'): string => {
        switch (priority) {
            case 'high': return '🔴';
            case 'medium': return '🟡';
            case 'low': return '🟢';
            default: return '⚪';
        }
    };

    const obtenerColorCategoria = (category: 'personal' | 'students' | 'equipment' | 'system', priority: 'low' | 'medium' | 'high'): string => {
        let baseClasses = '';

        switch (category) {
            case 'personal':
                baseClasses = 'ring-2 ring-blue-200 ';
                break;
            case 'students':
                baseClasses = 'ring-2 ring-green-200 ';
                break;
            case 'equipment':
                baseClasses = 'ring-2 ring-purple-200 ';
                break;
            default:
                baseClasses = '';
        }

        switch (priority) {
            case 'high': return baseClasses + 'border-l-red-500 bg-red-50';
            case 'medium': return baseClasses + 'border-l-yellow-500 bg-yellow-50';
            case 'low': return baseClasses + 'border-l-green-500 bg-green-50';
            default: return baseClasses + 'border-l-gray-500 bg-gray-50';
        }
    };

    const obtenerIconoCategoria = (category: 'personal' | 'students' | 'equipment' | 'system'): string => {
        switch (category) {
            case 'personal': return '👤';
            case 'students': return '👥';
            case 'equipment': return '📦';
            case 'system': return '⚙️';
            default: return '📋';
        }
    };

    const notificacionesFiltradas = notifications.filter(notification => {
        // Filtro por categoría
        if (filtro === 'personales' && notification.category !== 'personal') return false;
        if (filtro === 'estudiantes' && notification.category !== 'students') return false;
        if (filtro === 'equipos' && notification.category !== 'equipment') return false;
        if (filtro === 'sistema' && notification.category !== 'system') return false;

        // Filtro por prioridad
        if (prioridadFiltro !== 'todas' && notification.priority !== prioridadFiltro) return false;

        return true;
    });

    const contarPorCategoria = (categoria: 'personal' | 'students' | 'equipment' | 'system') => {
        return notifications.filter(n => n.category === categoria).length;
    };

    const contarPorPrioridad = (prioridad: 'high' | 'medium' | 'low') => {
        return notificacionesFiltradas.filter(n => n.priority === prioridad).length;
    };

    return (
        <Layout>
            <div className="flex min-h-screen">
                <div className="flex flex-col flex-grow">
                    <main className="flex-grow p-8">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold mb-2">🎓 Centro de Notificaciones - Profesor</h1>
                            <p className="text-gray-600">
                                Panel de control docente - Profesor: <span className="font-semibold">{currentUser}</span>
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Última actualización: {lastUpdate.toLocaleString('es-ES')}
                                </div>
                                <div className="text-xs text-gray-400">
                                    🔄 Auto-actualización cada 5 minutos
                                </div>
                            </div>
                        </div>

                        {/* Mensaje de error */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
                                <button
                                    className="absolute top-1 right-1 text-red-500"
                                    onClick={() => setError(null)}
                                >
                                    &times;
                                </button>
                                <strong>Error:</strong> {error}
                            </div>
                        )}

                        {/* Panel de estadísticas para profesores */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg shadow border ring-2 ring-blue-200">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-2">👤</span>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-800">{contarPorCategoria('personal')}</p>
                                        <p className="text-sm text-blue-600">Personales</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg shadow border ring-2 ring-green-200">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-2">👥</span>
                                    <div>
                                        <p className="text-2xl font-bold text-green-800">{contarPorCategoria('students')}</p>
                                        <p className="text-sm text-green-600">Estudiantes</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg shadow border ring-2 ring-purple-200">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-2">📦</span>
                                    <div>
                                        <p className="text-2xl font-bold text-purple-800">{contarPorCategoria('equipment')}</p>
                                        <p className="text-sm text-purple-600">Equipos</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg shadow border">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-2">🔴</span>
                                    <div>
                                        <p className="text-2xl font-bold text-red-800">{contarPorPrioridad('high')}</p>
                                        <p className="text-sm text-red-600">Urgentes</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controles de filtrado especializados para profesores */}
                        <div className="bg-white p-4 rounded-lg shadow border mb-6">
                            <div className="flex flex-wrap gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Vista:</label>
                                    <select
                                        value={filtro}
                                        onChange={(e) => setFiltro(e.target.value as any)}
                                        className="border p-2 rounded"
                                    >
                                        <option value="todos">🌍 Todas las notificaciones</option>
                                        <option value="personales">👤 Mis notificaciones</option>
                                        <option value="estudiantes">👥 Actividad de estudiantes</option>
                                        <option value="equipos">📦 Estado de equipos</option>
                                        <option value="sistema">⚙️ Sistema</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Prioridad:</label>
                                    <select
                                        value={prioridadFiltro}
                                        onChange={(e) => setPrioridadFiltro(e.target.value as any)}
                                        className="border p-2 rounded"
                                    >
                                        <option value="todas">Todas</option>
                                        <option value="high">🔴 Críticas</option>
                                        <option value="medium">🟡 Importantes</option>
                                        <option value="low">🟢 Informativas</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Período:</label>
                                    <select
                                        value={diasFiltro}
                                        onChange={(e) => setDiasFiltro(Number(e.target.value))}
                                        className="border p-2 rounded"
                                    >
                                        <option value={1}>Hoy</option>
                                        <option value={3}>Últimos 3 días</option>
                                        <option value={7}>Esta semana</option>
                                        <option value={15}>Últimas 2 semanas</option>
                                        <option value={30}>Este mes</option>
                                    </select>
                                </div>

                                <button
                                    onClick={cargarNotificaciones}
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                            Actualizando...
                                        </>
                                    ) : (
                                        <>
                                            🔄 Actualizar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Indicador de carga */}
                        {loading && (
                            <div className="mb-4 flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                                <span>Cargando notificaciones del centro educativo...</span>
                            </div>
                        )}

                        {/* Lista de notificaciones optimizada para profesores */}
                        <div className="space-y-3">
                            {notificacionesFiltradas.length > 0 ? (
                                notificacionesFiltradas.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`bg-white border-l-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${obtenerColorCategoria(notification.category, notification.priority)}`}
                                    >
                                        <div className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3 flex-grow">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <span className="text-xl">
                                                            {obtenerIconoCategoria(notification.category)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex items-center space-x-2 mb-1 flex-wrap">
                                                            <h3 className="font-semibold text-gray-900">
                                                                {notification.title}
                                                            </h3>
                                                            <span className="text-sm">
                                                                {obtenerIconoPrioridad(notification.priority)}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                notification.category === 'personal' ? 'bg-blue-100 text-blue-800' :
                                                                notification.category === 'students' ? 'bg-green-100 text-green-800' :
                                                                notification.category === 'equipment' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {notification.category === 'personal' ? 'Personal' :
                                                                 notification.category === 'students' ? 'Estudiantes' :
                                                                 notification.category === 'equipment' ? 'Equipos' : 'Sistema'}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                notification.type === 'articulo'
                                                                    ? 'bg-gray-100 text-gray-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                                {notification.type === 'articulo' ? 'Inventario' : 'Préstamo'}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 mb-2">
                                                            {notification.message}
                                                        </p>
                                                        {notification.relatedEntity && (
                                                            <p className="text-sm text-gray-500">
                                                                📍 <span className="font-medium">{notification.relatedEntity}</span>
                                                            </p>
                                                        )}

                                                        {/* Acciones rápidas para profesores */}
                                                        {notification.category === 'students' && notification.priority === 'high' && (
                                                            <div className="mt-2 flex gap-2">
                                                                <button className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200">
                                                                    📞 Contactar estudiante
                                                                </button>
                                                                <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200">
                                                                    📝 Ver historial
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0 text-right ml-4">
                                                    <p className="text-sm text-gray-500">
                                                        {formatearFecha(notification.timestamp)}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        ID: {notification.id.substring(0, 8)}...
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg shadow border">
                                    <div className="text-6xl mb-4">
                                        {filtro === 'personales' ? '👤' :
                                         filtro === 'estudiantes' ? '👥' :
                                         filtro === 'equipos' ? '📦' : '🎓'}
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {filtro === 'personales' ? 'No tienes notificaciones personales' :
                                         filtro === 'estudiantes' ? 'No hay actividad de estudiantes' :
                                         filtro === 'equipos' ? 'No hay alertas de equipos' :
                                         'No hay notificaciones'}
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        {filtro === 'personales' ? 'No hay alertas específicas para ti en este momento.' :
                                         filtro === 'estudiantes' ? 'Todos los estudiantes están al día con sus préstamos.' :
                                         filtro === 'equipos' ? 'Todos los equipos están en buen estado.' :
                                         'No hay notificaciones en el período seleccionado.'}
                                    </p>
                                    <button
                                        onClick={cargarNotificaciones}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        🔄 Comprobar notificaciones
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Panel informativo para profesores */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h4 className="font-medium mb-2 text-green-800">👥 Supervisión de Estudiantes</h4>
                                <p className="text-sm text-green-700">
                                    Monitorea préstamos vencidos, equipos dañados y actividades de estudiantes bajo tu supervisión.
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <h4 className="font-medium mb-2 text-purple-800">📦 Gestión de Equipos</h4>
                                <p className="text-sm text-purple-700">
                                    Alertas sobre disponibilidad de equipos deportivos para planificar tus clases efectivamente.
                                </p>
                            </div>
                        </div>

                        {/* Leyenda específica para profesores */}
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-medium mb-3">📋 Guía de Notificaciones para Profesores:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h5 className="font-medium mb-2">Prioridades:</h5>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span>🔴</span>
                                            <span><strong>Críticas:</strong> Equipos agotados, préstamos muy vencidos</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span>🟡</span>
                                            <span><strong>Importantes:</strong> Stock bajo, recordatorios</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span>🟢</span>
                                            <span><strong>Informativas:</strong> Actualizaciones generales</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-medium mb-2">Categorías:</h5>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span>👤</span>
                                            <span><strong>Personal:</strong> Tus préstamos y actividades</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span>👥</span>
                                            <span><strong>Estudiantes:</strong> Actividad de tus estudiantes</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span>📦</span>
                                            <span><strong>Equipos:</strong> Estado del inventario</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </Layout>
    );
}