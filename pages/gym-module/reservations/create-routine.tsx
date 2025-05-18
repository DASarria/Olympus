import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { ReservationDTO, ReservationStatus, createReservation } from '@/api/gymServicesIndex';

/**
 * ReservationForm component is used to create a new reservation by the user or trainer.
 * It includes a form for entering session details such as session ID, reservation date, 
 * equipment IDs, notes, and reservation status. The form sends the reservation data to 
 * the backend API when submitted.
 *
 * @component
 * @example
 * return (
 *   <ReservationForm />
 * )
 */
const ReservationForm = () => {
    const router = useRouter();
    const { startDate } = router.query;

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
         * Effect to set the reservation date if a startDate query param is provided.
         * It formats the date and sets it in the formData state.
         */
        if (typeof startDate === 'string') {
            const localDate = new Date(startDate);
            const formatted = localDate.toISOString().slice(0, 16);
            setFormData(prev => ({
                ...prev,
                reservationDate: formatted
            }));
        }
    }, [startDate]);

    /**
     * Handles form input changes and updates the corresponding field in formData.
     *
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e - The event object triggered by form field changes.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Handles form submission, validates the userId, and sends the reservation data to the backend.
     * If the reservation is created successfully, successMessage is shown, otherwise, errorMessage is displayed.
     *
     * @param {React.FormEvent} e - The form submission event.
     * @returns {Promise<void>} - Returns a promise that resolves once the reservation is created or an error occurs.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            setErrorMessage("No se encontró el ID de usuario.");
            return;
        }

        try {
            const reservation: ReservationDTO = {
                userId,
                sessionId: formData.sessionId,
                status: formData.status as ReservationStatus,
                reservationDate: formData.reservationDate,
                equipmentIds: formData.equipmentIds.split(',').map(id => id.trim()),
                notes: formData.notes
            };

            await createReservation(userId, reservation);
            setSuccessMessage("Reserva creada exitosamente.");
            setErrorMessage('');
            setFormData({
                sessionId: '',
                status: ReservationStatus.PENDING,
                reservationDate: '',
                equipmentIds: '',
                notes: ''
            });
        } catch (error) {
            console.error('Error al crear la reserva:', error);
            setErrorMessage("Ocurrió un error al crear la reserva.");
            setSuccessMessage('');
        }
    };
    
    return (
        <div className='flex flex-col gap-6'>
            <Return 
                className="!self-stretch !flex-[0_0_auto] !w-full"
                text="Reserva de salon"
                returnPoint="/gym-module/reservations"
            />
            <div>
                <h2 className="text-xl font-semibold mb-4">Crear nueva reserva</h2>

                {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
                {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">ID de Sesión</label>
                        <input
                            type="text"
                            name="sessionId"
                            value={formData.sessionId}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Fecha de Reserva</label>
                        <input
                            type="datetime-local"
                            name="reservationDate"
                            value={formData.reservationDate}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Equipos (IDs separados por coma)</label>
                        <input
                            type="text"
                            name="equipmentIds"
                            value={formData.equipmentIds}
                            onChange={handleChange}
                            placeholder="equipment1,equipment2"
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Notas</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Estado</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        >
                            <option value={ReservationStatus.PENDING}>Pendiente</option>
                            <option value={ReservationStatus.CONFIRMED}>Confirmada</option>
                            <option value={ReservationStatus.CANCELLED}>Cancelada</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-[var(--primary-red)] text-white px-4 py-2 rounded cursor-pointer"
                    >
                        Crear Reserva
                    </button>
                </form>
            </div>
        </div>
    )
}

export default withRoleProtection(["USER", "TRAINER"], "/gym-module/reservations")(ReservationForm);