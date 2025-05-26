import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Return } from "@/components/Return";
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';
import { createSession, createRecurringSessions, CreateSessionDTO, RecurringSessionDTO } from "@/api/gymServicesIndex";

/**
 * Component for creating a new session or recurring sessions.
 * Allows trainers to schedule sessions with configurable details.
 *
 * @component
 * @returns {JSX.Element} The session creation form.
 */
const CreateSessionForm = () => {
    const router = useRouter();

    // State hooks for handling form data, success/error messages, and recurrence flag
    const [isRecurring, setIsRecurring] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Retrieve trainer ID from sessionStorage
    const trainerId = typeof window !== 'undefined' ? sessionStorage.getItem("gymId") : null;

    // State for form fields
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        capacity: '',
        description: '',
        dayOfWeek: '',
        startDate: '',
        endDate: ''
    });

    /**
     * Effect hook for handling query parameters (startDate and endDate) from the URL.
     * Sets form data if dates are provided in the query string.
     */
    useEffect(() => {
        if (!router.isReady) return;
        
        const { startDate, endDate } = router.query;

        // If startDate and endDate are provided in query parameters, set them in the form state
        if (typeof startDate === 'string' && typeof endDate === 'string') {
            const start = new Date(startDate);
            const end = new Date(endDate);

            setFormData(prev => ({
                ...prev,
                date: start.toISOString().split('T')[0],
                startTime: start.toTimeString().slice(0, 5),
                endTime: end.toTimeString().slice(0, 5)
            }));
        }
    }, [router.isReady, router.query]);

    /**
     * Handles form input changes by updating the corresponding field in the state.
     * 
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e - The change event.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * Handles form submission to create a session or recurring sessions.
     * Validates input and makes API calls to create sessions.
     * 
     * @param {React.FormEvent} e - The submit event.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!trainerId) {
            setErrorMessage("No se encontró el ID del entrenador.");
            return;
        }

        try {
            if (isRecurring) {
                const recurringData: RecurringSessionDTO = {
                    dayOfWeek: parseInt(formData.dayOfWeek),
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    capacity: parseInt(formData.capacity),
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    trainerId,
                    description: formData.description
                };

                await createRecurringSessions(recurringData);
                setSuccessMessage("Sesiones recurrentes creadas exitosamente.");
            } else {
                const sessionData: CreateSessionDTO = {
                    date: formData.date,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    capacity: parseInt(formData.capacity),
                    trainerId,
                    description: formData.description
                };

                await createSession(sessionData);
                setSuccessMessage("Sesión creada exitosamente.");
            }

            setErrorMessage('');
            setFormData({
                date: '',
                startTime: '',
                endTime: '',
                capacity: '',
                description: '',
                dayOfWeek: '',
                startDate: '',
                endDate: ''
            });
        } catch (error) {
            console.error('Error al crear la sesión:', error);
            setErrorMessage("Ocurrió un error al crear la sesión.");
            setSuccessMessage('');
        }
    };

    return (
        <PageTransitionWrapper>
            <div className="flex flex-col gap-6">
                <Return
                    className="!self-stretch !flex-[0_0_auto] !w-full"
                    text="Crear nueva sesión"
                    returnPoint="/gym-module/reservations"
                />

                <div>

                    <div className="mb-4">
                        <label className="mr-2 font-medium">¿Es recurrente?</label>
                        <input
                            type="checkbox"
                            checked={isRecurring}
                            onChange={() => setIsRecurring(prev => !prev)}
                        />
                    </div>

                    {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
                    {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {!isRecurring && (
                            <div>
                                <label className="block font-medium mb-1">Fecha</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded p-2"
                                />
                            </div>
                        )}

                        {isRecurring && (
                            <>
                                <div>
                                    <label className="block font-medium mb-1">Día de la semana (0=Domingo, 6=Sábado)</label>
                                    <input
                                        type="number"
                                        name="dayOfWeek"
                                        value={formData.dayOfWeek}
                                        onChange={handleChange}
                                        min="0"
                                        max="6"
                                        required
                                        className="w-full border rounded p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Fecha de inicio</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full border rounded p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Fecha de fin</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block font-medium mb-1">Hora de inicio</label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                                className="w-full border rounded p-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Hora de fin</label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                required
                                className="w-full border rounded p-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Capacidad</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                                className="w-full border rounded p-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="w-full border rounded p-2"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-[var(--primary-red)] text-white px-4 py-2 rounded cursor-pointer"
                        >
                            Crear sesión
                        </button>
                    </form>
                </div>
            </div>
        </PageTransitionWrapper>
    );
};

export default withRoleProtection(["TRAINER"], "/gym-module/reservations")(CreateSessionForm);
