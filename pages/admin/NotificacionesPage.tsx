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
}

export default function NotificacionesPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filtro, setFiltro] = useState<'todos' | 'articulos' | 'prestamos'>('todos');
    const [diasFiltro, setDiasFiltro] = useState<number>(7);
    const [currentUser] = useState('Juan-cely-l'); // Usuario actual

    useEffect(() => {
        cargarNotificaciones();
    }, [diasFiltro]);

    const cargarNotificaciones = async () => {
        setLoading(true);
        setError(null);

        try {
            // Obtener alertas de ambos endpoints de forma paralela
            const [alertasArticulosResponse, alertasPrestamosResponse] = await Promise.allSettled([
                api.get('/Article/alerts'),
                api.get(`/LoanArticle/alerts?userId=${currentUser}&days=${diasFiltro}&size=50`)
            ]);

            const notificacionesConvertidas: Notification[] = [];

            // Procesar alertas de artículos
            if (alertasArticulosResponse.status === 'fulfilled') {
                const alertasArticulos: AlertasArticulosResponse[] = alertasArticulosResponse.value.data;
               
                alertasArticulos.forEach(alerta => {
                    notificacionesConvertidas.push({
                        ...alerta,
                        type: 'articulo',
                        title: `Stock: ${alerta.relatedEntity}`,
                        priority: determinarPrioridadArticulo(alerta.message),
                        description: alerta.relatedEntity
                    });
                });
            } else {
                console.error('Error al cargar alertas de artículos:', alertasArticulosResponse.reason);
            }

            // Procesar alertas de préstamos
            if (alertasPrestamosResponse.status === 'fulfilled') {
                const alertasPrestamos: AlertasPrestamosResponse = alertasPrestamosResponse.value.data;
               
                alertasPrestamos.alertas.forEach(alerta => {
                    notificacionesConvertidas.push({
                        ...alerta,
                        type: 'prestamo',
                        title: determinarTituloPrestamo(alerta.message),
                        priority: determinarPrioridadPrestamo(alerta.message),
                        relatedEntity: alerta.description
                    });
                });
            } else {
                console.error('Error al cargar alertas de préstamos:', alertasPrestamosResponse.reason);
            }

            // Ordenar por fecha más reciente primero
            notificacionesConvertidas.sort((a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            setNotifications(notificacionesConvertidas);

        } catch (err: any) {
            console.error('Error al cargar notificaciones:', err);
            setError('Error al cargar las notificaciones. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const determinarPrioridadArticulo = (mensaje: string): 'low' | 'medium' | 'high' => {
        const mensajeLower = mensaje.toLowerCase();
        if (mensajeLower.includes('0 disponibles') || mensajeLower.includes('agotado')) {
            return 'high';
        } else if (mensajeLower.includes('1 disponible') || mensajeLower.includes('pocos')) {
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

    const determinarTituloPrestamo = (mensaje: string): string => {
        const mensajeLower = mensaje.toLowerCase();
        if (mensajeLower.includes('vencido')) {
            return 'Préstamo Vencido';
        } else if (mensajeLower.includes('recordatorio')) {
            return 'Recordatorio de Devolución';
        } else if (mensajeLower.includes('nuevo préstamo')) {
            return 'Nuevo Préstamo';
        } else if (mensajeLower.includes('actualizado')) {
            return 'Préstamo Actualizado';
        } else if (mensajeLower.includes('dañado')) {
            return 'Artículo Reportado como Dañado';
        } else if (mensajeLower.includes('devuelto')) {
            return 'Préstamo Devuelto';
        }
        return 'Notificación de Préstamo';
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

    const obtenerColorPrioridad = (priority: 'low' | 'medium' | 'high'): string => {
        switch (priority) {
            case 'high': return 'border-l-red-500 bg-red-50';
            case 'medium': return 'border-l-yellow-500 bg-yellow-50';
            case 'low': return 'border-l-green-500 bg-green-50';
            default: return 'border-l-gray-500 bg-gray-50';
        }
    };

    const obtenerIconoTipo = (type: 'articulo' | 'prestamo'): string => {
        return type === 'articulo' ? '📦' : '📋';
    };

    const notificacionesFiltradas = notifications.filter(notification => {
        if (filtro === 'todos') return true;
        if (filtro === 'articulos') return notification.type === 'articulo';
        if (filtro === 'prestamos') return notification.type === 'prestamo';
        return true;
    });

    const contarPorTipo = (tipo: 'articulo' | 'prestamo') => {
        return notifications.filter(n => n.type === tipo).length;
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
                            <h1 className="text-3xl font-bold mb-2">Centro de Notificaciones</h1>
                            <p className="text-gray-600">
                                Alertas y notificaciones del sistema - Usuario: <span className="font-semibold">{currentUser}</span>
                            </p>
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

                        {/* Estadísticas rápidas */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-lg shadow border">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-2">📊</span>
                                    <div>
                                        <p className="text-2xl font-bold">{notifications.length}</p>
                                        <p className="text-sm text-gray-600">Total</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow border">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-2">📦</span>
                                    <div>
                                        <p className="text-2xl font-bold">{contarPorTipo('articulo')}</p>
                                        <p className="text-sm text-gray-600">Artículos</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow border">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-2">📋</span>
                                    <div>
                                        <p className="text-2xl font-bold">{contarPorTipo('prestamo')}</p>
                                        <p className="text-sm text-gray-600">Préstamos</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow border">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-2">🔴</span>
                                    <div>
                                        <p className="text-2xl font-bold">{contarPorPrioridad('high')}</p>
                                        <p className="text-sm text-gray-600">Urgentes</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controles de filtrado */}
                        <div className="bg-white p-4 rounded-lg shadow border mb-6">
                            <div className="flex flex-wrap gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Filtrar por tipo:</label>
                                    <select
                                        value={filtro}
                                        onChange={(e) => setFiltro(e.target.value as any)}
                                        className="border p-2 rounded"
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="articulos">Artículos</option>
                                        <option value="prestamos">Préstamos</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Últimos días:</label>
                                    <select
                                        value={diasFiltro}
                                        onChange={(e) => setDiasFiltro(Number(e.target.value))}
                                        className="border p-2 rounded"
                                    >
                                        <option value={1}>1 día</option>
                                        <option value={3}>3 días</option>
                                        <option value={7}>7 días</option>
                                        <option value={15}>15 días</option>
                                        <option value={30}>30 días</option>
                                    </select>
                                </div>

                                <button
                                    onClick={cargarNotificaciones}
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Actualizando...' : 'Actualizar'}
                                </button>
                            </div>
                        </div>

                        {/* Indicador de carga */}
                        {loading && (
                            <div className="mb-4 flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                                <span>Cargando notificaciones...</span>
                            </div>
                        )}

                        {/* Lista de notificaciones */}
                        <div className="space-y-3">
                            {notificacionesFiltradas.length > 0 ? (
                                notificacionesFiltradas.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`bg-white border-l-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ${obtenerColorPrioridad(notification.priority)}`}
                                    >
                                        <div className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3 flex-grow">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <span className="text-xl">
                                                            {obtenerIconoTipo(notification.type)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <h3 className="font-semibold text-gray-900">
                                                                {notification.title}
                                                            </h3>
                                                            <span className="text-sm">
                                                                {obtenerIconoPrioridad(notification.priority)}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                notification.type === 'articulo'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-purple-100 text-purple-800'
                                                            }`}>
                                                                {notification.type === 'articulo' ? 'Artículo' : 'Préstamo'}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 mb-2">
                                                            {notification.message}
                                                        </p>
                                                        {notification.relatedEntity && (
                                                            <p className="text-sm text-gray-500">
                                                                Entidad relacionada: <span className="font-medium">{notification.relatedEntity}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0 text-right">
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
                                    <div className="text-6xl mb-4">📭</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No hay notificaciones
                                    </h3>
                                    <p className="text-gray-500">
                                        {filtro === 'todos'
                                            ? 'No tienes notificaciones en el período seleccionado.'
                                            : `No hay notificaciones de ${filtro} en el período seleccionado.`
                                        }
                                    </p>
                                    <button
                                        onClick={cargarNotificaciones}
                                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Actualizar notificaciones
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Leyenda de prioridades */}
                        <div className="mt-8 bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-medium mb-3">Leyenda de Prioridades:</h4>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <span>🔴</span>
                                    <span>Alta - Requiere atención inmediata</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span>🟡</span>
                                    <span>Media - Requiere atención pronto</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span>🟢</span>
                                    <span>Baja - Informativa</span>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </Layout>
    );
}
