import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Return } from "@/components/Return";
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { ReservationStatus, getReservationDetails, cancelReservation } from '@/api/gymServicesIndex';

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
    const { id } = router.query;

    const userId = typeof window !== 'undefined' ? sessionStorage.getItem("id") : null;
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        sessionId: '',
        status: ReservationStatus.PENDING,
        reservationDate: '',
        equipmentIds: '',
        notes: ''
    });

    useEffect(() => {
        /**
         * Fetches reservation details when the component mounts.
         * It updates the formData state with the fetched reservation details.
         * 
         * @async
         * @function fetchData
         * @returns {Promise<void>} - Returns nothing.
         */
        const fetchData = async () => {
            if (!id || typeof id !== 'string' || !userId) return;
            try {
                const reservation = await getReservationDetails(userId, id);
                setFormData({
                    sessionId: reservation.sessionId,
                    status: reservation.status,
                    reservationDate: reservation.reservationDate.slice(0, 16),
                    equipmentIds: reservation.equipmentIds?.join(',') || '',
                    notes: reservation.notes || ''
                });
            } catch (error) {
                console.error('Error al cargar la reserva:', error);
                setErrorMessage('No se pudo cargar la reserva.');
            }
        };
        fetchData();
    }, [id]);


    /**
     * Cancels the current reservation by calling the cancelReservation API function.
     * If the cancellation is successful, the status is updated to "Cancelled".
     * 
     * @async
     * @function handleCancelReservation
     * @returns {Promise<void>} - Returns nothing.
     */
    const handleCancelReservation = async () => {
        if (!userId || !id || typeof id !== 'string') {
            setErrorMessage("Faltan datos para cancelar la reserva.");
            return;
        }
        try {
            await cancelReservation(userId, id);
            setFormData(prev => ({ ...prev, status: ReservationStatus.CANCELLED }));
            setSuccessMessage("Reserva cancelada exitosamente.");
            setErrorMessage('');
        } catch (error) {
            console.error('Error al cancelar la reserva:', error);
            setErrorMessage("Ocurrió un error al cancelar la reserva.");
            setSuccessMessage('');
        }
    };

    return (
        <div className='flex flex-col gap-6'>
            <Return 
                className="!self-stretch !flex-[0_0_auto] !w-full"
                text="Detalles de reserva"
                returnPoint="/gym-module/reservations"
            />
            <div>
                <h2 className="text-xl font-semibold mb-4">Detalles de Reserva</h2>

                {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
                {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}

                <div className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">ID de Sesión</label>
                        <input
                            type="text"
                            name="sessionId"
                            value={formData.sessionId}
                            disabled
                            className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Fecha de Reserva</label>
                        <input
                            type="datetime-local"
                            name="reservationDate"
                            value={formData.reservationDate}
                            disabled
                            className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Equipos (IDs separados por coma)</label>
                        <input
                            type="text"
                            name="equipmentIds"
                            value={formData.equipmentIds}
                            disabled
                            className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Notas</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            disabled
                            className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Estado</label>
                        <input
                            type="text"
                            name="status"
                            value={formData.status}
                            disabled
                            className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {formData.status !== ReservationStatus.CANCELLED && (
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
    );
};

export default withRoleProtection(["USER", "TRAINER"], "/gym-module/reservations")(ReservationDetails);
