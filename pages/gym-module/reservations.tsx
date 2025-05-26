import { useState, useEffect } from 'react';
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { Calendar, Views, View } from 'react-big-calendar';
import { useRouter } from 'next/router';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import localizer from '@/lib/Localizer';
import { getSessionsByDate, ReservationStatus, getUserReservations, Reservation } from '@/api/gymServicesIndex';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';

export interface CalendarEvent {
    id: string;
    type: "reserved" | "available" | "trainer";
    // Reservation attributes
    reservationId?: string;
    userId?: string;
    status?: ReservationStatus;
    notes?:string;
    // Session attributes
    start: Date,
    end: Date,
    capacity: number;
    reservedSpots: number;
    trainerId?: string;
    description?: string;
}

/**
 * Main component of the reservation page, which displays the calendar and manages the creation of reservations.
 * 
 * @component
 * @example
 * return <Reservations />;
 */
const Reservations = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<View>(Views.MONTH);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedId = sessionStorage.getItem("gymId");
            const storedRole = sessionStorage.getItem("role");

            if (!storedId || !storedRole) {
                router.push("/");
                return;
            }

            setUserId(storedId);
            setRole(storedRole);
        }
    }, []);

    /**
     * Effect that fetches the reservation events and simulates event creation to display them in the calendar.
     * 
     * This effect runs only once when the component mounts.
     */
    useEffect(() => {
        const fetchEvents = async () => {
            if (!userId || !role) return;

            try {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();

                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const dateStrings = Array.from({ length: daysInMonth }, (_, i) => {
                    const day = new Date(year, month, i + 1);
                    return day.toISOString().split('T')[0];
                });

                const sessionPromises = dateStrings.map(date => getSessionsByDate(date));
                const sessionResults = await Promise.all(sessionPromises);
                const allSessions = sessionResults.flat();

                let combinedEvents: CalendarEvent[] = [];

                if (role === "STUDENT") {
                    const reservations = await getUserReservations(userId);
                    const reservationMap = new Map(reservations.map(res => [res.sessionId, res]));

                    combinedEvents = allSessions.map(session => {
                        const reservation = reservationMap.get(session.id);
                        return {
                            id: session.id,
                            type: reservation ? "reserved" : "available",
                            reservationId: reservation?.id,
                            userId: reservation?.userId,
                            status: reservation?.status,
                            notes: reservation?.notes,
                            start: new Date(`${session.date}T${session.startTime}`),
                            end: new Date(`${session.date}T${session.endTime}`),
                            capacity: session.capacity,
                            reservedSpots: session.reservedSpots,
                            trainerId: session.trainerId,
                            description: session.description
                        };
                    });
                } else if (role === "TRAINER") {
                    combinedEvents = allSessions.map(session => ({
                        id: session.id,
                        type: "trainer",
                        start: new Date(`${session.date}T${session.startTime}`),
                        end: new Date(`${session.date}T${session.endTime}`),
                        capacity: session.capacity,
                        reservedSpots: session.reservedSpots,
                        trainerId: session.trainerId,
                        description: session.description
                    }));
                }

                setEvents(combinedEvents);
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
    const CustomEvent = ({ event }: { event: CalendarEvent }) => {
        return (
            <div className='flex flex-col'>
                <strong>Sesión</strong>
                <div>
                    {event.type === 'reserved' && (
                    <small style={{ fontStyle: 'italic'}}>
                        Reservado - {event.status}
                    </small>
                    )}
                    {event.type === 'available' && (
                        <small style={{ fontStyle: 'italic'}}>
                            Disponible
                        </small>
                    )}
                </div>
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
    const handleSelectEvent = (event: CalendarEvent) => {
        sessionStorage.setItem("GymEvent", JSON.stringify(event));
        
        if (role === "TRAINER") {
            router.push('/gym-module/reservations/session-details');
        } else if (role === "STUDENT") {
            if (event.type === "available") {
                router.push('/gym-module/reservations/book-session');
            } else if (event.type === "reserved") {
                router.push('/gym-module/reservations/book-detail');
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