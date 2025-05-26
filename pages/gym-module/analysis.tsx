import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getUserProgressReport, getGymUsageReport, getAttendanceReport, ReportFormat } from "@/api/gymServicesIndex";
import Button from "@/components/gym-module/Button";
import ExportIcon from "@/assets/icons/export-svgrepo-com 1.svg";
import Image from "next/image";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ChartData, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from "chart.js";

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

// Tipos para los estados
interface AttendanceStats {
  usageByMonth: Record<string, number>;
  attendanceBySession: Record<string, number>;
}

interface MonthlyUsage {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

async function blobToJson<T>(blob: Blob): Promise<T> {
  const text = await blob.text();
  return JSON.parse(text);
}

function getDefaultDateRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
  return { startDate: firstDay, endDate: lastDay };
}

export function useGymDashboardData(userId: string, startDate: string, endDate: string) {
    const [progressData, setProgressData] = useState<any[]>([]);
    const [gymUsageData, setGymUsageData] = useState<any>(null);
    const [attendanceData, setAttendanceData] = useState<{ date: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
        setLoading(true);
        try {
            const [progressBlob, gymBlob, attendanceBlob] = await Promise.all([
                getUserProgressReport(userId, ReportFormat.JSON),
                getGymUsageReport(startDate, endDate, ReportFormat.JSON),
                getAttendanceReport(startDate, endDate, ReportFormat.JSON),
            ]);

            const progressJson = await blobToJson<any[]>(progressBlob);
            const gymJson = await blobToJson<any[]>(gymBlob);
            const attendanceJson = await blobToJson<Record<string, number>[]>(attendanceBlob);
            setProgressData(progressJson);
            setGymUsageData(gymJson[0]);
            const attendanceArray = Object.entries(attendanceJson[0]).map(([date, count]) => ({ date, count }));
            setAttendanceData(attendanceArray);
        } catch (error) {
            console.error("Error cargando reportes", error);
        } finally {
            setLoading(false);
        }
        }

        fetchData();
    }, [userId, startDate, endDate]);

    return { progressData, gymUsageData, attendanceData, loading };
}

/**
 * Analysis Component
 * 
 * @component
 * @description
 * This component displays gym usage statistics, including attendance by session and monthly gym usage, using charts.
 * It is protected based on roles (TRAINER or ADMIN), and handles loading states during data fetching.
 * 
 * - Displays bar and line charts for gym usage by month and attendance by session.
 * - Allows for exporting the data.
 * - Simulates fetching attendance data (though in the current implementation, it uses mock data).
 * 
 * @example
 * <Analysis />
 * 
 * @returns {JSX.Element} The Analysis component
 */
const Analysis = () => {
    const router = useRouter();
    const userId = typeof window !== 'undefined' ? sessionStorage.getItem("gymId") : null;
    const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const [dateRange, setDateRange] = useState(getDefaultDateRange());
    
    const gymData = userId 
        ? useGymDashboardData(userId, dateRange.startDate, dateRange.endDate)
        : { progressData: [], gymUsageData: null, attendanceData: [], loading: false };

    const { progressData, gymUsageData, attendanceData, loading } = gymData;

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDateRange({ ...dateRange, [event.target.name]: event.target.value });
    };

    /**
     * Fetches attendance and usage statistics for the gym, with API calls, and updates the component's state.
     * 
     * @useEffect
     * @description
     * This `useEffect` hook fetches attendance and usage data with API calls.
     * 
     * It:
     * - Sets attendance statistics such as monthly gym usage and attendance by session (e.g., morning, afternoon, night).
     * - Updates the state with the fetched data and prepares it for visualization using charts.
     * - Handles loading state during data fetching.
     * 
     * The following states are updated:
     * - `attendanceStats`: Stores statistics about gym attendance.
     * - `monthlyUsage`: Stores monthly gym usage data used to render a bar chart.
     * - `loading`: Tracks whether data is being fetched.
     */
    const monthlyUsage = gymUsageData
    ? {
        labels: ["Total sesiones", "Capacidad total", "Reservas", "Uso promedio"],
        datasets: [
            {
            label: "Estadísticas del gimnasio",
            data: [
                gymUsageData.totalSessions,
                gymUsageData.totalCapacity,
                gymUsageData.totalReservedSpots,
                parseFloat(gymUsageData.averageUtilizationPerSession),
            ],
            backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
            },
        ],
        }
    : null;


    /**
     * Line chart data for attendance by session.
     * 
     * @type {object}
     * @default { labels: [], datasets: [] }
     */
    const lineData: ChartData<"line", number[], string> = attendanceData.length > 0
    ? {
        labels: Object.keys(attendanceData[0]), // Extrae las fechas como etiquetas
        datasets: [
            {
            label: "Asistencia por día",
            data: Object.values(attendanceData[0]).map(value => Math.max(0, Number(value))), // Solo valores >= 0
            borderColor: "rgba(255, 99, 132, 0.8)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            fill: true,
            tension: 0.3,
            },
        ],
        }
    : { labels: [], datasets: [] };


    /** 
     * Radar chart for user progress 
     */
    const progressChart = progressData.length > 0
    ? {
        labels: progressData.map(item => item.metric),
        datasets: [
            {
                label: "Progreso del usuario",
                data: progressData.map(item => item.value),
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
            },
        ],
      }
    : null;

    /**
     * Handles the export button click event.
     * Redirects the user to the "reports" page for exporting data.
     * 
     * @function handleExportClick
     */
    const handleExportClick = () => {
        router.push("/gym-module/analysis/reports");
    };

    return (
        <PageTransitionWrapper>
            <div className="flex flex-col p-4 gap-6">
                <div className="flex justify-between items-center">
                    {role === "TRAINER" && (
                        <Return 
                            className="!self-stretch !flex-[0_0_auto] !w-full"
                            text="Analisis"
                            returnPoint="/gym-module"
                        />
                    )}
                </div>
                {loading ? (
                    <div className="flex w-full justify-center items-center h-screen">
                        <div className="w-16 h-16 border-4 border-t-4 border-gray-500 border-solid rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-row w-full justify-between">
                            <div className="flex flex-1 gap-6">
                                <h2>Filtrar por fecha:</h2>
                                <label>Desde: <input type="date" name="startDate" value={dateRange.startDate} onChange={handleDateChange} /></label>
                                <label>Hasta: <input type="date" name="endDate" value={dateRange.endDate} onChange={handleDateChange} /></label>
                            </div>
                            <Button 
                                className="inline-flex w-fit items-center gap-2.5 px-10 py-2.5 relative bg-[var(--lavender)] rounded-[15px] overflow-hidden border-box"
                                onClick={handleExportClick}
                            >
                                <Image
                                    className="relative"
                                    src={ExportIcon}
                                    width={18}
                                    height={18}
                                    alt="Export icon"
                                />
                                <span className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Regular',Helvetica] text-white tracking-[0] leading-[16px] whitespace-nowrap">Exportar</span>
                            </Button>
                        </div>
                        <div className="flex gap-2.5 items-center">
                            {monthlyUsage && (
                                <div className="flex flex-col w-full h-[460px] items-center justify-center gap-5 px-20 py-[30px] relative flex-1 bg-[#eaeaea] rounded-[20px] overflow-hidden border-box">
                                    <div className="flex-1 w-full max-w-5xl mx-auto">
                                    <Bar
                                        data={monthlyUsage}
                                        options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: true, position: "top" },
                                            title: { display: true, text: "Uso del gimnasio (Total sesiones, Capacidad, Reservas, Utilización)" },
                                        },
                                        }}
                                        style={{ width: "100%", height: "100%" }}
                                    />
                                    </div>
                                </div>
                            )}

                            {lineData && lineData.datasets?.length > 0 && (
                                <div className="flex flex-col w-full h-[460px] items-center justify-center gap-5 px-20 py-[30px] relative flex-1 bg-[#eaeaea] rounded-[20px] overflow-hidden border-box">
                                    <div className="flex-1 w-full max-w-5xl mx-auto">
                                        <Line
                                            data={lineData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                scales: {
                                                    x: {
                                                        type: "category",
                                                        title: { display: true, text: "Fecha" },
                                                    },
                                                    y: {
                                                        beginAtZero: true,
                                                        title: { display: true, text: "Número de asistentes" },
                                                    },
                                                },
                                                plugins: {
                                                    legend: { display: true, position: "top" },
                                                    title: { display: true, text: "Asistencia por día" },
                                                },
                                            }}
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2.5 items-center">

                        </div>
                    </>
                )}
            </div>
        </PageTransitionWrapper>
    )
}


export default withRoleProtection(["TRAINER", "ADMIN"], "/gym-module")(Analysis);