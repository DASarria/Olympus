import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/gym-module/Button";
import ExportIcon from "@/assets/icons/export-svgrepo-com 1.svg";
import Image from "next/image";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from "chart.js";

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
    const userId = typeof window !== 'undefined' ? sessionStorage.getItem("id") : null;
    const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
    const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsage | null>(null);
    const [loading, setLoading] = useState(true);

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
    useEffect(() => {
        // const fetchData = async () => {
        //     if (!userId) return console.error("No userId found");

        //     try {
        //         const today = new Date();
        //         const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        //         .toISOString()
        //         .slice(0, 10);
        //         const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        //         .toISOString()
        //         .slice(0, 10);

        //         const stats = await getAttendanceStatistics(userId, startOfMonth, endOfMonth);
        //         setAttendanceStats(stats);

        //         setMonthlyUsage({
        //         labels: Object.keys(stats.usageByMonth || {}),
        //         datasets: [
        //             {
        //             label: "Uso gimnasio (número de sesiones)",
        //             data: Object.values(stats.usageByMonth || {}),
        //             backgroundColor: "rgba(75, 192, 192, 0.6)",
        //             },
        //         ],
        //         });
        //     } catch (error) {
        //         console.error("Error fetching data:", error);
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        // fetchData();

        const fakeStats = {
            usageByMonth: {
                "2025-01": 12,
                "2025-02": 15,
                "2025-03": 10,
                "2025-04": 18,
                "2025-05": 22,
            },
            attendanceBySession: {
                "Mañana": 20,
                "Tarde": 14,
                "Noche": 9,
            },
        };

        setAttendanceStats(fakeStats);

        setMonthlyUsage({
            labels: Object.keys(fakeStats.usageByMonth),
            datasets: [
            {
                label: "Uso gimnasio (número de sesiones)",
                data: Object.values(fakeStats.usageByMonth),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            ],
        });

        setLoading(false);
    }, [userId]);


    /**
     * Line chart data for attendance by session.
     * 
     * @type {object}
     * @default { labels: [], datasets: [] }
     */
    const lineData = attendanceStats && attendanceStats.attendanceBySession ? {
        labels: Object.keys(attendanceStats.attendanceBySession),
        datasets: [
        {
            label: "Asistencia por sesión",
            data: Object.values(attendanceStats.attendanceBySession),
            borderColor: "rgba(53, 162, 235, 0.8)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            fill: true,
            tension: 0.3,
        },
        ],
    } : {
        labels: [],
        datasets: [],
    };

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
                    {role !== "ADMIN" && (
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
                        <div className="w-full justify-between">
                            {role === "TRAINER" && (
                                <div className="flex-1">
                                    
                                </div>
                            )}
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
                                            legend: {
                                            display: true,
                                            position: 'top',
                                            },
                                            title: {
                                            display: true,
                                            text: 'Uso del gimnasio por meses',
                                            },
                                        },
                                        }}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                    </div>
                                </div>
                            )}

                            {lineData?.datasets?.length > 0 && (
                                <div className="flex flex-col w-full h-[460px] items-center justify-center gap-5 px-20 py-[30px] relative flex-1 bg-[#eaeaea] rounded-[20px] overflow-hidden border-box">
                                    <div className="flex-1 w-full max-w-5xl mx-auto">
                                    <Line
                                        data={lineData}
                                        options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        indexAxis: "y",
                                        plugins: {
                                            legend: {
                                            display: true,
                                            position: 'top',
                                            },
                                            title: {
                                            display: true,
                                            text: 'Asistencia por sesión (mes actual)',
                                            },
                                        },
                                        }}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                    </div>
                                </div>
                            )}

                            {role === "ADMIN" && (
                                <div className="inline-flex flex-col items-center justify-center gap-5 px-20 py-[30px] relative flex-1 bg-[#eaeaea] rounded-[20px] overflow-hidden border-box chart-container">

                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </PageTransitionWrapper>
    )
}


export default withRoleProtection(["TRAINER", "ADMIN"], "/gym-module")(Analysis);