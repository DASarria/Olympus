import { useState, useEffect } from 'react';
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { Calendar, Views, View } from 'react-big-calendar';
import { useRouter } from 'next/router';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import localizer from '@/lib/Localizer';
import { getSessionsByDate, ReservationStatus, getUserReservations, ReservationDTO, GymSessionDTO } from '@/api/gymServicesIndex';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';

/**
 * Main component of the reservation page, which displays the calendar and manages the creation of reservations.
 * 
 * @component
 * @example
 * return <Reservations />;
 */
const Reservations = () => {
    const userId = typeof window !== 'undefined' ? sessionStorage.getItem("id") : null;
    //const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const [role, setRole] = useState('');
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<View>(Views.MONTH);
    const router = useRouter();

    /**
     * Effect that fetches the reservation events and simulates event creation to display them in the calendar.
     * 
     * This effect runs only once when the component mounts.
     */
    useEffect(() => {
        const fetchEvents = async () => {
            //if (!userId) return console.error("No userId found");
            const userId = "user123";
            setRole("STUDENT");
            try {
                if (role === "STUDENT") {
                    // const reservations = await getUserReservations(userId);
                    // const sessionIds = reservations.map(r => r.sessionId);
                    // const allSessions = await getSessionsByDate(currentDate.toISOString().split('T')[0]);
                    // const combinedEvents = allSessions.map(session => {
                    //     const reservation = reservations.find(r => r.sessionId === session.id);
                    //     const isReserved = Boolean(reservation);
                    //     return {
                    //         id: isReserved ? reservation.id : session.id,
                    //         title: session.description,
                    //         start: new Date(`${session.date}T${session.startTime}`),
                    //         end: new Date(`${session.date}T${session.endTime}`),
                    //         notes: reservation?.notes || "",
                    //         status: reservation?.status || "",
                    //         sessionId: session.id,
                    //         type: isReserved ? "reserved" : "available"
                    //     };
                    // });

                    // setEvents(combinedEvents);

                    const simulatedReservations: ReservationDTO[] = [
                        {
                            id: '1',
                            userId,
                            sessionId: 'session123',
                            status: ReservationStatus.PENDING,
                            reservationDate: '2025-05-01T10:00:00',
                            checkInTime: '',
                            cancellationDate: '',
                            equipmentIds: [],
                            notes: 'Entrenamiento funcional',
                        }
                    ];

                    // 2. Simular todas las sesiones del día
                    const simulatedSessions: GymSessionDTO[] = [
                        {
                            id: 'session123',
                            date: '2025-05-01',
                            startTime: '10:00:00',
                            endTime: '11:00:00',
                            capacity: 20,
                            reservedSpots: 18,
                            trainerId: 'trainer1',
                            description: 'Entrenamiento funcional'
                        },
                        {
                            id: 'session124',
                            date: '2025-05-01',
                            startTime: '11:00:00',
                            endTime: '12:00:00',
                            capacity: 15,
                            reservedSpots: 10,
                            trainerId: 'trainer2',
                            description: 'Clase de yoga'
                        }
                    ];

                    const sessionIdsReserved = simulatedReservations.map(r => r.sessionId);

                    const combinedEvents = simulatedSessions.map(session => {
                        const reservation = simulatedReservations.find(r => r.sessionId === session.id);
                        const isReserved = Boolean(reservation);

                        return {
                            id: isReserved ? reservation!.id : session.id,
                            title: session.description,
                            start: new Date(`${session.date}T${session.startTime}`),
                            end: new Date(`${session.date}T${session.endTime}`),
                            notes: reservation?.notes || "",
                            status: reservation?.status || "",
                            sessionId: session.id,
                            type: isReserved ? "reserved" : "available"
                        };
                    });

                    setEvents(combinedEvents);
                } else if (role === "TRAINER") {
                    // const sessions = await getSessionsByDate(currentDate.toISOString().split('T')[0]);
                    // const sessionEvents = sessions.map(session => ({
                    //     id: session.id,
                    //     title: session.description,
                    //     start: new Date(`${session.date}T${session.startTime}`),
                    //     end: new Date(`${session.date}T${session.endTime}`),
                    //     sessionId: session.id
                    // }));
                    // setEvents(sessionEvents);

                    const simulatedTrainerSessions: GymSessionDTO[] = [
                        {
                            id: 'session125',
                            date: '2025-05-03',
                            startTime: '09:00:00',
                            endTime: '10:00:00',
                            capacity: 25,
                            reservedSpots: 20,
                            trainerId: userId,
                            description: 'Clase HIIT'
                        }
                    ];

                    const sessionEvents = simulatedTrainerSessions.map(session => ({
                        id: session.id,
                        title: session.description,
                        start: new Date(`${session.date}T${session.startTime}`),
                        end: new Date(`${session.date}T${session.endTime}`),
                        sessionId: session.id,
                        type: "trainer"
                    }));

                    setEvents(sessionEvents);
                }
            } catch (error) {
                console.error('Error fetching sessions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [userId, role, currentDate]);

    /**
     * Custom component that renders a custom event in the calendar.
     * 
     * @param {Object} props - The component's props.
     * @param {Object} props.event - The event to display.
     * @returns {JSX.Element} The rendered event component.
     */
    const CustomEvent = ({ event }: { event: any }) => {
        return (
            <div className='flex flex-col'>
                <strong>Sesión</strong>
                {event.type === 'reserved' && (
                    <small style={{ fontStyle: 'italic'}}>
                        Reservado
                    </small>
                )}
                {event.type === 'available' && (
                    <small style={{ fontStyle: 'italic'}}>
                        Disponible
                    </small>
                )}
                <small className="text-sm overflow-hidden text-ellipsis max-w-full line-clamp-2">
                    {event.description}
                </small>
            </div>
        );
    };

    /**
     * Function that handles navigation to a new date in the calendar.
     * 
     * @param {Date} newDate - The new date to navigate to.
     */
    const handleNavigate = (newDate: Date) => {
        setCurrentDate(newDate);
    };

    /**
     * Function that handles changing the view in the calendar (month, week, day).
     * 
     * @param {View} view - The selected view.
     */
    const handleViewChange = (view: View) => {
        setCurrentView(view);
    };

    /**
     * Function that handles selecting a slot in the calendar.
     * If the current view is "month", it switches to the "day" view and selects the slot.
     * If already in "day" view, it redirects to the "create routine" page with the selected start and end dates.
     * 
     * @param {Object} slotInfo - The information about the selected slot.
     * @param {Date} slotInfo.start - The start date of the selected slot.
     * @param {Date} slotInfo.end - The end date of the selected slot.
     */
    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        if (currentView === Views.MONTH) {
            setCurrentView(Views.DAY);
            setCurrentDate(slotInfo.start);
        } else {
            router.push({
                pathname: '/gym-module/reservations/create-session',
                query: {
                    startDate: slotInfo.start.toISOString(),
                    endDate: slotInfo.end.toISOString()
                }
            });
        }
    };

    /**
     * Function that handles selecting an event in the calendar.
     * 
     * @param {Object} event - The selected event.
     */
    const handleSelectEvent = (event: any) => {
        if (role === "TRAINER") {
            router.push({
                pathname: '/gym-module/reservations/session-details',
                query: { id: event.id }
            });
        } else if (role === "STUDENT") {
            if (event.type === "available") {
                router.push({
                    pathname: '/gym-module/reservations/book-session',
                    query: {
                        id: event.sessionId,
                        startDate: event.start.toISOString(),
                        endDate: event.end.toISOString(),
                        description: event.description,
                    }
                });
            } else if (event.type === "reserved") {
                router.push({
                    pathname: '/gym-module/reservations/book-detail',
                    query: { id: event.id }
                });
            }
        }
    };

    /**
     * Custom messages for the calendar buttons (month, week, day, etc.).
     * 
     * @type {Object}
     */
    const messages = {
        allDay: 'Todo el día',
        previous: 'Anterior',
        next: 'Siguiente',
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
        date: 'Fecha',
        time: 'Hora',
        event: 'Evento',
    };

    /**
     * Renders the calendar component with the loaded events.
     * If events are still loading, a loading spinner is shown.
     * 
     * @returns {JSX.Element} The rendered calendar component.
     */
    return (
        <PageTransitionWrapper>
            <div className='flex flex-col gap-6'>
                <Return 
                    className="!self-stretch !flex-[0_0_auto] !w-full"
                    text="Reserva de salon"
                    returnPoint="/gym-module"
                />

                <div>
                    {loading ? (
                        <div className="flex justify-center items-center h-screen">
                            <div className="w-16 h-16 border-4 border-t-4 border-gray-500 border-solid rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <Calendar
                            className={currentView === Views.DAY ? 'day-view-calendar' : ''}
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 600 }}
                            selectable={role === "TRAINER"}
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}
                            views={[Views.MONTH, Views.WEEK, Views.DAY]}
                            defaultView={Views.MONTH}
                            defaultDate={new Date()}
                            view={currentView}
                            onView={handleViewChange}
                            date={currentDate}
                            onNavigate={handleNavigate}
                            culture="es"
                            messages={messages}
                            components={{
                                event: CustomEvent
                            }}
                            eventPropGetter={() => ({
                                style: {
                                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-red').trim()
                                }
                            })}
                        />
                    )}
                    <style jsx global>{`
                        .day-view-calendar .rbc-time-slot {
                            cursor: pointer !important;
                        }
                    `}</style>
                </div>
            </div>
        </PageTransitionWrapper>
    )
}


export default withRoleProtection(["STUDENT", "TRAINER"], "/gym-module")(Reservations);