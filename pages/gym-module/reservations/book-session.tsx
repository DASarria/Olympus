import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { ReservationDTO, createReservation } from '@/api/gymServicesIndex';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';
import { CalendarEvent } from '../reservations';

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

    const [userId, setUserId] = useState<string | null>(null);
    const [event, setEvent] = useState<CalendarEvent | null>(null);
    const [formData, setFormData] = useState({ notes: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedId = sessionStorage.getItem("id");
            const storedEvent = sessionStorage.getItem("selectedCalendarEvent");

            if (!storedId) {
                router.push("/");
                return;
            }

            if (storedEvent) {
                setEvent(JSON.parse(storedEvent));
                sessionStorage.removeItem('selectedCalendarEvent');
            } else {
                router.push('/gym-module/reservations');
                return;
            }

            setUserId(storedId);
        }
    }, []);

    /**
     * Handles form input changes and updates the corresponding field in formData.
     *
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e - The event object triggered by form field changes.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

        if (!userId || !event?.id || !event.start) {
            setErrorMessage("Faltan datos para crear la reserva.");
            return;
        }

        try {
            const reservation: ReservationDTO = {
                userId,
                sessionId: event.id,
                notes: formData.notes
            };

            await createReservation(userId, reservation);
            setSuccessMessage("Reserva creada exitosamente.");
            setErrorMessage('');
            setFormData({ notes: '' });
        } catch (error) {
            console.error('Error al crear la reserva:', error);
            setErrorMessage("Ocurrió un error al crear la reserva.");
            setSuccessMessage('');
        }
    };

    const formatToInputDateTime = (date: Date) => {
        return date.toISOString().slice(0, 16);
    };
    
    if (!event) return null;
    return (
        <PageTransitionWrapper>
            <div className='flex flex-col gap-6'>
                <Return 
                    className="!self-stretch !flex-[0_0_auto] !w-full"
                    text="Crear nueva reserva"
                    returnPoint="/gym-module/reservations"
                />
                <div>

                    {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
                    {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">ID de Sesión</label>
                            <input
                                type="text"
                                value={event.id}
                                disabled
                                className="w-full border rounded p-2 bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Descripción</label>
                            <input
                                type="text"
                                value={event.description ?? ''}
                                disabled
                                className="w-full border rounded p-2 bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Fecha de Reserva</label>
                            <input
                                type="text"
                                value={formatToInputDateTime(new Date(event.start))}
                                disabled
                                className="w-full border rounded p-2 bg-gray-100"
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

                        <button
                            type="submit"
                            className="bg-[var(--primary-red)] text-white px-4 py-2 rounded cursor-pointer"
                        >
                            Crear Reserva
                        </button>
                    </form>
                </div>
            </div>
        </PageTransitionWrapper>
    )
}

export default withRoleProtection(["STUDENT"], "/gym-module/reservations")(ReservationForm);