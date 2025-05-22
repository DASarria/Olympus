import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { FilterBtn } from "@/components/gym-module/FilterBtn";
import UserIcon from '@/assets/icons/user-filter.svg';
import { useState, useEffect } from "react";
import { ProgressMetrics } from '@/api/gymServicesIndex';
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement } from 'chart.js';

// Register chart elements for Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

/**
 * Classifies a given BMI value into different categories and assigns a color.
 * 
 * @param {number} bmi - The BMI value to classify.
 * @returns {{ label: string, color: string }} - The classification label and associated color.
 * 
 * @example
 * const bmi = 24;
 * const classification = classifyBMI(bmi);
 * console.log(classification); // { label: "Healthy weight", color: "#008000" }
 */
const classifyBMI = (bmi: number) => {
    if (bmi < 18.5) return { label: "Bajo peso", color: "#FFA500" };
    if (bmi < 25) return { label: "Peso saludable", color: "#008000" };
    if (bmi < 30) return { label: "Sobrepeso", color: "#FFD700" };
    return { label: "Obesidad", color: "#FF0000" };
};

/**
 * PhysicalProgress component to display a user's physical progress such as weight, height, BMI, and goals.
 * Fetches and displays data, including BMI chart history.
 * 
 * @component
 * @returns {JSX.Element} - The rendered PhysicalProgress component.
 */
const PhysicalProgress = () => {
    const userId = typeof window !== 'undefined' ? sessionStorage.getItem("id") : null;
        // Role information used for UI rendering
    const _role: string = "TRAINER"; // Prefixed with underscore to mark as intentionally unused

    const [searchTerm, setSearchTerm] = useState("");
    const [students] = useState(["Ana González", "Carlos Pérez", "María Rodríguez", "Juan Martínez"]); // Dummy list
    
    // Define proper types instead of any
    interface Measurement {
        weight: number;
        height: number;
        date: string;
        bodyFatPercentage: number;
        muscleMass: number;
    }
    
    const [latestMeasurement, setLatestMeasurement] = useState<Measurement | null>(null);
    const [userGoals, setUserGoals] = useState<string[]>([]);
    const [bmiData, setBmiData] = useState<{ date: string, bmi: number }[]>([]);
    const [_progressMetrics, setProgressMetrics] = useState<ProgressMetrics | null>(null); // Prefixed with underscore to mark as intentionally unused
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /**
         * Asynchronously fetches user data, including the latest physical measurements,
         * personal goals, progress history, and physical progress metrics.
         * This function does API calls to fetch data and updates the component's state accordingly.
         *
         * @async
         * @function fetchData
         * @returns {Promise<void>} - Resolves when all data has been fetched and the component state is updated.
         * 
         * @description
         * 1. Fetches the latest physical measurement (weight, height, BMI).
         * 2. Fetches the user's personal fitness goals.
         * 3. Fetches historical physical measurements (e.g., BMI over the last 6 months).
         * 4. Fetches physical progress metrics (e.g., changes in weight, waist, and chest measurements).
         */
        const fetchData = async () => {
            // if (!userId) return console.error("No userId found");
            
            // try {
            //     const measurement = await getLatestPhysicalMeasurement(userId);
            //     setLatestMeasurement(measurement);

            //     const goals = await getUserGoals(userId);
            //     setUserGoals(goals);

            //     const progress = await getPhysicalMeasurementHistory(userId);
            //     const bmiHistory = progress
            //         .map((entry: any) => {
            //             const weight = entry.weight?.value;
            //             const height = entry.measurements?.height;
            //             if (!weight || !height) return null;
            //             const bmi = weight / (height * height);
            //             return {
            //                 date: entry.recordDate,
            //                 bmi: parseFloat(bmi.toFixed(2)),
            //             };
            //         })
            //         .filter(item => item !== null);
            //         setBmiData(bmiHistory);

            //         const metrics = await getPhysicalProgressMetrics(userId);
            //         setProgressMetrics(metrics);
            // } catch (error) {
            //     console.error("Error fetching data:", error);
            // } finally {
            //     setLoading(false);
            // }


            // Simulate latest measurement
            const measurement = {
                weight: { value: 72.5, unit: "KG" },
                measurements: {
                    height: 1.75,
                    chestCircumference: 95,
                    waistCircumference: 80,
                    hipCircumference: 100,
                    bicepsCircumference: 32,
                    thighCircumference: 55,
                    additionalMeasures: {
                        calves: 38,
                        shoulders: 110,
                    },
                },
                physicalGoal: "Aumentar masa muscular y reducir 2kg de grasa",
                bmi: parseFloat((72.5 / (1.75 * 1.75)).toFixed(2)),
            };
            setLatestMeasurement(measurement);

            // Simulate personal goals
            const goals = [
                "Reducir porcentaje de grasa corporal al 15%",
                "Aumentar masa muscular en brazos y piernas",
                "Mantener consistencia con rutina de ejercicios"
            ];
            setUserGoals(goals);

            // Simulate progress history (e.g., last 6 months)
            const progress = [
                { recordDate: "2024-12-01", weight: { value: 78 }, measurements: { height: 1.75 } },
                { recordDate: "2025-01-01", weight: { value: 76.5 }, measurements: { height: 1.75 } },
                { recordDate: "2025-02-01", weight: { value: 75 }, measurements: { height: 1.75 } },
                { recordDate: "2025-03-01", weight: { value: 73.8 }, measurements: { height: 1.75 } },
                { recordDate: "2025-04-01", weight: { value: 72.9 }, measurements: { height: 1.75 } },
                { recordDate: "2025-05-01", weight: { value: 72.5 }, measurements: { height: 1.75 } },
            ];

            const bmiHistory = progress.map((entry: { date: string; bmi: number }) => {
                const weight = entry.weight?.value;
                const height = entry.measurements?.height;
                if (!weight || !height) return null;
                const bmi = weight / (height * height);
                return {
                    date: entry.recordDate,
                    bmi: parseFloat(bmi.toFixed(2)),
                };
            }).filter(item => item !== null);
            setBmiData(bmiHistory);

            const metrics = {
                weightChange: -5.5,
                waistCircumferenceChange: -4,
                chestCircumferenceChange: +2,
            };
            setProgressMetrics(metrics);
            setLoading(false);
        }

        fetchData();
    }, [userId]);

    const filteredStudents = students.filter(student =>
        student.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const latestBMI = latestMeasurement?.weight?.value && latestMeasurement?.measurements?.height
        ? parseFloat((latestMeasurement.weight.value / (latestMeasurement.measurements.height ** 2)).toFixed(2))
        : null;

    const bmiClass = latestBMI ? classifyBMI(latestBMI) : { label: "Desconocido", color: "#CCCCCC" };

    const chartData = {
        labels: bmiData.map(item => item.date),
        datasets: [
        {
            label: 'IMC (BMI)',
            data: bmiData.map(item => item.bmi),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }
        ]
    };

    return (
        <PageTransitionWrapper>
            <div className="flex flex-col w-full items-center gap-5 pt-0 pb-20 px-0 relative">
                <Return 
                    className="!self-stretch !flex-[0_0_auto] !w-full"
                    text="Progreso fisico"
                    returnPoint="/gym-module"
                />
                {loading ? (
                    <div className="flex w-full justify-center items-center h-screen">
                        <div className="w-16 h-16 border-4 border-t-4 border-gray-500 border-solid rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col w-full items-center gap-5 pt-0 pb-20 px-0 relative flex-[0_0_auto]">
                            {/* Filter Input */}
                            <div className="flex items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
                                <FilterBtn
                                    icon={UserIcon}
                                    text="Estudiante"
                                    type="search"
                                    action={(term: string) => setSearchTerm(term)}
                                />
                            </div>
                            {/* Metrics blocks */}
                            <div className="flex w-full items-start gap-5 relative border-box">

                                {/* Weight */}
                                <div className="inline-flex flex-col h-[232px] items-start justify-center gap-5 px-20 py-[30px] relative flex-1 bg-[#eaeaea] rounded-[20px] overflow-hidden border-box">
                                    <div className="relative w-fit mt-[-1.00px] font-subtitulo-font-size font-[number:var(--titulo-font-weight)] text-black text-[length:var(--subtitulo-font-size)] tracking-[var:(--titulo-letter-spacing)] leading-[var(--titulo-line-heihgt)]">
                                        Peso
                                    </div>
                                    <div className="inline-flex items-end gap-2.5 relative flex-[0_0_auto]">
                                        <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-[42px] tracking-[0] leading-[normal]">
                                            {latestMeasurement?.weight?.value || 'N/A'}
                                        </div>
                                        <div className="relative w-fit [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal]">
                                            {latestMeasurement?.weight?.unit || 'KG'}
                                        </div>
                                    </div>
                                    <div className="relative w-fit [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-base tracking-[0] leading-[normal]">
                                        Últimos 30 días
                                    </div>
                                </div>

                                {/* Height */}
                                <div className="inline-flex flex-col h-[232px] items-start justify-center gap-5 px-20 py-[30px] relative flex-1 bg-[#eaeaea] rounded-[20px] overflow-hidden border-box">
                                    <div className="relative w-fit mt-[-1.00px] font-subtitulo-font-size font-[number:var(--titulo-font-weight)] text-black text-[length:var(--subtitulo-font-size)] tracking-[var:(--titulo-letter-spacing)] leading-[var(--titulo-line-heihgt)]">
                                        Altura
                                    </div>
                                    <div className="inline-flex items-end gap-2.5 relative flex-[0_0_auto]">
                                        <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-[42px] tracking-[0] leading-[normal]">
                                            {latestMeasurement?.measurements?.height || 'N/A'}
                                        </div>
                                        <div className="relative w-fit [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal]">
                                            cm
                                        </div>
                                    </div>
                                </div>

                                {/* BMI */}
                                <div className="inline-flex flex-col h-[232px] items-start justify-center gap-5 px-20 py-[30px] relative flex-[0_0_auto] bg-[#eaeaea] rounded-[20px] overflow-hidden border-box">
                                    <div className="inline-flex items-center gap-5 relative flex-[0_0_auto]">
                                        <div className="relative w-fit mt-[-1.00px] font-subtitulo-font-size font-[number:var(--titulo-font-weight)] text-black text-[length:var(--subtitulo-font-size)] tracking-[var:(--titulo-letter-spacing)] leading-[var(--titulo-line-heihgt)]">
                                            IMC
                                        </div>
                                        <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-[42px] tracking-[0] leading-[normal]">
                                            {latestMeasurement?.bmi || 'N/A'}
                                        </div>
                                        <div className="inline-flex items-center gap-2.5 p-2.5 relative flex-[0_0_auto]">
                                            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: bmiClass.color }} />
                                            <div className="relative w-fit [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal]">
                                                {bmiClass.label}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative self-stretch w-full h-0.5 bg-[#dadada] rounded-[50px]"/>
                                    <div className="relative w-fit [font-family: 'Montserrat-Bold', Helvetica] font-bold text-black text-base tracking-[0] leading-[normal]">
                                        Últimos 30 días
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full items-stretch gap-5 relative">
                                {/* Personal Goals */}
                                <div className="flex flex-col flex-1 items-start justify-center gap-2.5 px-20 py-[30px] relative bg-[#eaeaea] rounded-[20px] overflow-hidden border-box">
                                    <div className="relative w-fit mt-[-1.00px] mb-[1.00px] font-subtitulo-font-size font-[number:var(--titulo-font-weight)] text-black text-[length:var(--subtitulo-font-size)] tracking-[var:(--titulo-letter-spacing)] leading-[var(--titulo-line-heihgt)]">
                                        Metas personales
                                    </div>
                                    <div className="flex flex-col items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
                                        {userGoals.map((goal, index) => (
                                            <div key={index} className="relative self-stretch [font-family: 'Montserrat-Medium',Helvetica] font-medium text-black text-lg tracking-[0] leading-[normal]">
                                                {goal}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Extra Measurements */}
                                <div className="flex flex-col flex-1 items-start justify-center gap-2.5 px-20 py-[30px] relative bg-[#eaeaea] rounded-[20px] overflow-hidden border-box">
                                    <div className="relative w-fit mt-[-1.00px] mb-[1.00px] font-subtitulo-font-size font-[number:var(--titulo-font-weight)] text-black text-[length:var(--subtitulo-font-size)] tracking-[var:(--titulo-letter-spacing)] leading-[var(--titulo-line-heihgt)]">
                                        Medidas Corporales Detalladas
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-black text-lg">
                                        <span>Pecho: {latestMeasurement?.measurements?.chestCircumference || 'N/A'} cm</span>
                                        <span>Cintura: {latestMeasurement?.measurements?.waistCircumference || 'N/A'} cm</span>
                                        <span>Cadera: {latestMeasurement?.measurements?.hipCircumference || 'N/A'} cm</span>
                                        <span>Bíceps: {latestMeasurement?.measurements?.bicepsCircumference || 'N/A'} cm</span>
                                        <span>Muslo: {latestMeasurement?.measurements?.thighCircumference || 'N/A'} cm</span>
                                        <span>Pantorrilla: {latestMeasurement?.measurements?.additionalMeasures?.calves || 'N/A'} cm</span>
                                        <span>Hombros: {latestMeasurement?.measurements?.additionalMeasures?.shoulders || 'N/A'} cm</span>
                                    </div>
                                </div>
                            </div>

                            {/* Line Chart for BMI */}
                            <div className="flex flex-col w-full h-[622px] items-start justify-center gap-2.5 px-20 py-[30px] relative bg-[#eaeaea] rounded-[20px] overflow-hidden border-box">
                                <div className="flex flex-col flex-1 max-w-5xl mx-auto">
                                     <Line
                                        data={chartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false, // Cambié esto a false para que el gráfico ocupe todo el contenedor
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                    position: 'top',
                                                },
                                                title: {
                                                    display: true,
                                                    text: 'Progreso del IMC',
                                                },
                                            },
                                            scales: {
                                                x: {
                                                    title: {
                                                        display: true,
                                                        text: 'Fecha',
                                                    },
                                                },
                                                y: {
                                                    title: {
                                                        display: true,
                                                        text: 'IMC',
                                                    },
                                                    min: 15,
                                                    max: 40,
                                                },
                                            },
                                        }}
                                        style={{ width: "100%", height: "100%" }} // Asegura que la gráfica ocupe todo el contenedor
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </PageTransitionWrapper>
    )
}


export default withRoleProtection(["USER", "TRAINER"], "/gym-module")(PhysicalProgress);