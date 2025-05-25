import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Return } from "@/components/Return";
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { ReservationStatus, cancelReservation } from '@/api/gymServicesIndex';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';
import { CalendarEvent } from '../reservations';

/**
 * ReservationDetails component displays detailed information about a reservation.
 * It fetches the reservation details by ID, including session ID, reservation date, 
 * equipment IDs, notes, and status. It also allows the user to cancel the reservation 
 * if it's not already cancelled.
 *
 * @component
 * @example
 * return (
 *   <ReservationDetails />
 * )
 */
const ReservationDetails = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [event, setEvent] = useState<CalendarEvent | null>(null);
    const checkedStorageRef = useRef(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (checkedStorageRef.current) return;
        checkedStorageRef.current = true;

        const storedId = sessionStorage.getItem("gymId");
        const storedEvent = sessionStorage.getItem("GymEvent");

        if (!storedId) {
            router.push("/");
            return;
        }

        if (storedEvent) {
            setEvent(JSON.parse(storedEvent));
            sessionStorage.removeItem('GymEvent');
        } else {
            router.push('/gym-module/reservations');
            return;
        }

        setUserId(storedId);
    }, []);


    /**
     * Cancels the current reservation by calling the cancelReservation API function.
     * If the cancellation is successful, the status is updated to "Cancelled".
     * 
     * @async
     * @function handleCancelReservation
     * @returns {Promise<void>} - Returns nothing.
     */
    const handleCancelReservation = async () => {
        if (!userId || !event?.reservationId) {
            setErrorMessage("Faltan datos para cancelar la reserva.");
            return;
        }
        try {
            await cancelReservation(userId, event.reservationId);
            setEvent(prev => prev ? { ...prev, status: ReservationStatus.CANCELLED } : null);
            setSuccessMessage("Reserva cancelada exitosamente.");
            setErrorMessage('');
        } catch (error) {
            console.error('Error al cancelar la reserva:', error);
            setErrorMessage("Ocurrió un error al cancelar la reserva.");
            setSuccessMessage('');
        }
    };

    const formatToInputDateTime = (date: Date) => {
        return date.toISOString().slice(0, 16);
    };

    if (!event) {
        return (
            <PageTransitionWrapper>
                <div className="text-center py-8 text-gray-500">Cargando detalles de la reserva...</div>
            </PageTransitionWrapper>
        );
    }
    return (
        <PageTransitionWrapper>
            <div className='flex flex-col gap-6'>
                <Return 
                    className="!self-stretch !flex-[0_0_auto] !w-full"
                    text="Detalles de reserva"
                    returnPoint="/gym-module/reservations"
                />
                <div>

                    {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
                    {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}

                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">ID de Sesión</label>
                            <input
                                type="text"
                                name="sessionId"
                                value={event.id}
                                disabled
                                className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Fecha de Reserva</label>
                            <input
                                type="datetime-local"
                                name="reservationDate"
                                value={formatToInputDateTime(new Date(event.start))}
                                disabled
                                className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Descripción</label>
                            <input
                                type="text"
                                name="description"
                                value={event.description}
                                disabled
                                className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Notas</label>
                            <textarea
                                name="notes"
                                value={event.notes || ''}
                                disabled
                                className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Estado</label>
                            <input
                                type="text"
                                name="status"
                                value={event.status}
                                disabled
                                className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        {event?.status !== ReservationStatus.CANCELLED && (
                            <button
                                onClick={handleCancelReservation}
                                className="bg-[var(--primary-red)] text-white px-4 py-2 rounded cursor-pointer"
                            >
                                Cancelar Reserva
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </PageTransitionWrapper>
    );
};

export default withRoleProtection(["STUDENT"], "/gym-module/reservations")(ReservationDetails);
