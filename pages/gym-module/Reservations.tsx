import { useState, useEffect } from 'react';
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { Calendar, Views, View } from 'react-big-calendar';
import { useRouter } from 'next/router';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import localizer from '@/lib/Localizer';
import { ReservationStatus } from '@/api/gymServicesIndex';

// Define proper types for events
interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'reservation' | 'session';
    status: ReservationStatus;
    sessionId?: string;
}
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';

/**
 * Main component of the reservation page, which displays the calendar and manages the creation of reservations.
 * 
 * @component
 * @example
 * return <Reservations />;
 */
const Reservations = () => {
    const userId = typeof window !== 'undefined' ? sessionStorage.getItem("id") : null;    // Role information removed as it wasn't being used
    const [events, setEvents] = useState<CalendarEvent[]>([]);
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
            // if (userId) {
            //     try {
            //         const userReservations = await getUserReservations(userId);
            //         setEvents(userReservations);
            //     } catch (error) {
            //         console.error('Error fetching user reservations:', error);
            //     } finally {
            //         setLoading(false);
            //     }
            // } else {
            //     console.error('No userId found in sessionStorage');
            // }

            const simulatedEvents = [
                {
                    id: '1',
                    userId: userId || "user123",
                    sessionId: 'session123',
                    status: ReservationStatus.PENDING,
                    reservationDate: '2025-05-01T10:00:00',
                    checkInTime: '',
                    cancellationDate: '',
                    equipmentIds: ['equipment1', 'equipment2'],
                    notes: 'Reserva para sesión de entrenamiento.',
                },
                {
                    id: '2',
                    userId: userId || "user123",
                    sessionId: 'session124',
                    status: ReservationStatus.CONFIRMED,
                    reservationDate: '2025-05-02T11:00:00',
                    checkInTime: '2025-05-02T10:45:00',
                    cancellationDate: '',
                    equipmentIds: ['equipment3'],
                    notes: 'Sesión de yoga.',
                }
            ];

            const eventsWithDates = simulatedEvents.map(event => ({
                ...event,
                start: new Date(event.reservationDate),
                end: new Date(new Date(event.reservationDate).getTime() + 60 * 60 * 1000)
            }));

            setEvents(eventsWithDates);
            setLoading(false);

        };

        fetchEvents();
    }, [userId]);

    /**
     * Custom component that renders a custom event in the calendar.
     * 
     * @param {Object} props - The component's props.
     * @param {Object} props.event - The event to display.
     * @returns {JSX.Element} The rendered event component.
     */
    const CustomEvent = ({ event }: { event: CalendarEvent }) => {
        return (
            <div>
                <strong>{event.status}</strong>
                <div style={{ fontSize: '0.8em' }}>{event.notes}</div>
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
                pathname: '/gym-module/reservations/create-routine',
                query: { startDate: slotInfo.start.toISOString(), endDate: slotInfo.end.toISOString() }
            });
        }
    };

    /**
     * Function that handles selecting an event in the calendar.
     * 
     * @param {Object} event - The selected event.
     */
    const handleSelectEvent = (event: CalendarEvent) => {
        router.push({
            pathname: '/gym-module/reservations/event-details',
            query: event.id
        });
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
                            selectable
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


export default withRoleProtection(["USER", "TRAINER"], "/gym-module")(Reservations);