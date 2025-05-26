import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { getSessionById, updateSession, cancelSession } from "@/api/gymServicesIndex";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import { Return } from "@/components/Return";
import { withRoleProtection } from "@/hoc/withRoleProtection";

/**
 * Component for displaying and managing session details.
 * Allows trainers to update or cancel a session.
 *
 * @component
 * @returns {JSX.Element} The session details form with update and cancel options.
 */
const SessionDetails = () => {
    const router = useRouter();
    const sessionId = Array.isArray(router.query.sessionId)
        ? router.query.sessionId[0]
        : router.query.sessionId;

    const trainerId = typeof window !== "undefined" ? sessionStorage.getItem("id") : null;
    const [formData, setFormData] = useState({
        date: "",
        startTime: "",
        endTime: "",
        capacity: 0,
        trainerId: ""
    });
    const [cancelReason, setCancelReason] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Effect hook that fetches session data when the component mounts.
     * It loads session details from the API based on the session ID from the URL.
     * 
     * @async
     */
    useEffect(() => {
        if (!sessionId || typeof sessionId !== "string") return;

        const fetchSession = async () => {
        try {
            const session = await getSessionById(sessionId);
            setFormData({
                date: session.date,
                startTime: session.startTime,
                endTime: session.endTime,
                capacity: session.capacity,
                trainerId: session.trainerId
            });
            } catch (error) {
                console.error("Error fetching session:", error);
                setErrorMessage("No se pudo cargar la sesión.");
            }
        };

        fetchSession();
    }, [sessionId]);

    /**
     * Handles input changes in the form.
     * Updates the corresponding form field in the state.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - The change event triggered by user input.
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "capacity" ? parseInt(value) : value
        }));
    };

    /**
     * Handles form submission to update the session.
     * Sends the updated session data to the API.
     * 
     * @param {FormEvent} e - The form submission event.
     * @async
     */
    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!trainerId || !sessionId || typeof sessionId !== "string") {
            return setErrorMessage("ID de entrenador o sesión no válido.");
        }

        try {
            await updateSession(sessionId, { ...formData, trainerId });
            setSuccessMessage("Sesión actualizada exitosamente.");
            setErrorMessage("");
        } catch (error) {
            console.error("Error al actualizar:", error);
            setErrorMessage("Ocurrió un error al actualizar la sesión.");
        }
    };

    /**
     * Handles session cancellation.
     * Sends the cancellation reason to the API to cancel the session.
     * 
     * @async
     */
    const handleCancel = async () => {
        if (!trainerId || !sessionId || typeof sessionId !== "string") {
            return setErrorMessage("ID de entrenador o sesión no válido.");
        }

        try {
            await cancelSession(sessionId, { reason: cancelReason, trainerId });
            setSuccessMessage("Sesión cancelada exitosamente.");
            setErrorMessage("");
        } catch (error) {
            console.error("Error al cancelar:", error);
            setErrorMessage("Ocurrió un error al cancelar la sesión.");
        }
    };

    return (
        <PageTransitionWrapper>
            <div className="flex flex-col gap-6">
                <Return
                    className="!self-stretch !flex-[0_0_auto] !w-full"
                    text="Detalles de la sesión"
                    returnPoint="/gym-module/reservations"
                />

                {successMessage && <div className="text-green-600">{successMessage}</div>}
                {errorMessage && <div className="text-red-600">{errorMessage}</div>}

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Fecha</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border rounded p-2" required />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Hora de inicio</label>
                        <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full border rounded p-2" required />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Hora de fin</label>
                        <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full border rounded p-2" required />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Capacidad</label>
                        <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full border rounded p-2" required />
                    </div>

                    <button type="submit" className="bg-[var(--primary-red)] text-white px-4 py-2 rounded cursor-pointer">Actualizar sesión</button>
                    </form>

                    <div className="mt-6 border-t pt-4">
                    <label className="block font-medium mb-1">Motivo de cancelación (opcional)</label>
                    <textarea
                        value={cancelReason}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCancelReason(e.target.value)}
                        className="w-full border rounded p-2 mb-2"
                        placeholder="Ej: el entrenador no estará disponible"
                    />
                    <button onClick={handleCancel} className="bg-[var(--primary-red)] text-white px-4 py-2 rounded cursor-pointer">Cancelar sesión</button>
                </div>
            </div>
        </PageTransitionWrapper>
    );
};

export default withRoleProtection(["TRAINER"], "/gym-module/reservations")(SessionDetails);
