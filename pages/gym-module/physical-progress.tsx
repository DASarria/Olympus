import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { FilterBtn } from "@/components/gym-module/FilterBtn";
import UserIcon from '@/assets/icons/user-filter.svg';
import { useState, useEffect } from "react";
import { getLatestPhysicalMeasurement, getUserGoals, getPhysicalMeasurementHistory, getPhysicalProgressMetrics } from '@/api/gymServicesIndex';
import { PhysicalProgress as PhysicalProgressType, ProgressMetrics, Student } from '@/types/gym/physicalTracking';
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { useRouter } from "next/router";
import StudentSelectionModal from "@/components/gym-module/StudentSelectionModal";
import { getAllStudents } from '@/api/gym-module/userService';
import ProgressHistory from "@/components/gym-module/ProgressHistory";
import BMIIndicator from "@/components/gym-module/BMIIndicator";
import { classifyBMI, formatDate } from '@/utils/physicalTrackingUtils';

// Register chart elements for Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

const PhysicalProgress = () => {
    const router = useRouter();
    const { studentId } = router.query;
    
    // Obtener información del usuario actual
    const currentUserId = typeof window !== 'undefined' ? sessionStorage.getItem("id") : null;
    const [role, setRole] = useState<string | null>(null);
    
    // Estados para filtrado y selección
    const [searchTerm, setSearchTerm] = useState("");
    const [showStudentSelector, setShowStudentSelector] = useState(false);
    
    // Estados para datos de entrenador
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [studentsProgress, setStudentsProgress] = useState<{[key: string]: PhysicalProgressType | null}>({});
    
    // Estados para datos de progreso
    const [latestMeasurement, setLatestMeasurement] = useState<PhysicalProgressType | null>(null);
    const [userGoals, setUserGoals] = useState<string[]>([]);
    const [bmiData, setBmiData] = useState<{ date: string, bmi: number }[]>([]);
    const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics | null>(null);
    const [measurementHistory, setMeasurementHistory] = useState<PhysicalProgressType[]>([]);
    
    // Estados para UI
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'dashboard' | 'detail'>('detail');
    const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

    useEffect(() => {
        // Obtener rol del usuario de la sesión
        const userRole = sessionStorage.getItem("role");
        setRole(userRole);
        
        // Determinar modo de vista (dashboard para entrenadores, detalle para estudiantes)
        if (userRole === "TRAINER" && !studentId) {
            setViewMode('dashboard');
            loadTrainerDashboard();
        } else {
            setViewMode('detail');
            const targetUserId = studentId ? studentId as string : currentUserId;
            if (targetUserId) {
                loadUserData(targetUserId);
            }
        }
    }, [currentUserId, studentId]);

    // Cargar dashboard del entrenador con estudiantes y su último progreso
    const loadTrainerDashboard = async () => {
        try {
            setLoading(true);
            
            if (!currentUserId) {
                console.error("No se encontró ID del entrenador");
                return;
            }
            
            // Obtener estudiantes asignados al entrenador
            const trainerStudents = await getAllStudents();
            setStudents(trainerStudents);
            setFilteredStudents(trainerStudents);
            
            // Obtener el último progreso de cada estudiante
            const progressData: {[key: string]: PhysicalProgressType | null} = {};
            
            await Promise.all(
                trainerStudents.map(async (student) => {
                    try {
                        const latestProgress = await getLatestPhysicalMeasurement(student.id);
                        progressData[student.id] = latestProgress;
                    } catch (error) {
                        console.warn(`Error al obtener progreso para ${student.name}:`, error);
                        progressData[student.id] = null;
                    }
                })
            );
            
            setStudentsProgress(progressData);
        } catch (error) {
            console.error("Error al cargar dashboard del entrenador:", error);
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos detallados para un usuario específico
    const loadUserData = async (userId: string) => {
        try {
            setLoading(true);
            
            // Cargar datos del usuario seleccionado
            if (role === "TRAINER" && userId !== currentUserId) {
                // Si es un entrenador viendo a un estudiante, obtener datos del estudiante
                const studentsList = await getAllStudents();
                const student = studentsList.find(s => s.id === userId);
                if (student) {
                    setSelectedStudent(student);
                }
            }
            
            // Cargar progreso físico en paralelo
            const [measurement, goals, progress, metrics] = await Promise.all([
                getLatestPhysicalMeasurement(userId),
                getUserGoals(userId),
                getPhysicalMeasurementHistory(userId),
                getPhysicalProgressMetrics(userId)
            ]);
            
            setLatestMeasurement(measurement);
            setUserGoals(goals);
            setMeasurementHistory(progress);
            setProgressMetrics(metrics);
            
            // Calcular datos históricos de IMC para el gráfico
            const bmiHistory = progress
                .map((entry) => {
                    const weight = entry.weight?.value;
                    const height = entry.measurements?.height;
                    if (!weight || !height) return null;
                    
                    return {
                        date: entry.recordDate || '',
                        bmi: entry.bmi || parseFloat((weight / (height * height)).toFixed(2))
                    };
                })
                .filter((item): item is { date: string, bmi: number } => item !== null)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            setBmiData(bmiHistory);
        } catch (error) {
            console.error("Error al cargar datos del usuario:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar estudiantes según término de búsqueda
    useEffect(() => {
        if (students.length > 0) {
            const filtered = students.filter(student => 
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (student.institutionalId && student.institutionalId.includes(searchTerm))
            );
            setFilteredStudents(filtered);
        }
    }, [searchTerm, students]);

    // Manejar selección de estudiante desde el modal
    const handleStudentSelect = (student: Student) => {
        setShowStudentSelector(false);
        router.push(`/gym-module/physical-progress?studentId=${student.id}`);
    };

    // Manejar clic en tarjeta de estudiante
    const handleStudentCardClick = (studentId: string) => {
        router.push(`/gym-module/physical-progress?studentId=${studentId}`);
    };

    // Preparar datos para el gráfico de IMC
    const chartData = {
        labels: bmiData.map(item => formatDate(item.date, 'short')),
        datasets: [
            {
                label: 'IMC (BMI)',
                data: bmiData.map(item => item.bmi),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3
            }
        ]
    };

    // Obtener la clasificación de IMC para el último registro
    const bmiClass = latestMeasurement?.bmi 
        ? classifyBMI(latestMeasurement.bmi) 
        : { label: "Desconocido", color: "#CCCCCC" };

    return (
        <PageTransitionWrapper>
            <div className="flex flex-col w-full items-center gap-5 pt-0 pb-20 px-4 max-w-7xl mx-auto">
                <Return 
                    className="!self-stretch !flex-[0_0_auto] !w-full"
                    text="Módulo de Gimnasio"
                    returnPoint="/gym-module"
                />
                
                {loading ? (
                    <div className="flex w-full justify-center items-center h-64">
                        <div className="w-16 h-16 border-4 border-t-4 border-gray-500 border-solid rounded-full animate-spin"></div>
                    </div>
                ) : viewMode === 'dashboard' ? (
                    // VISTA DE DASHBOARD PARA ENTRENADORES
                    <div className="flex flex-col w-full">
                        <div className="flex flex-wrap justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard de Estudiantes</h1>
                            
                            <div className="flex items-center gap-4">
                                <FilterBtn
                                    icon={UserIcon}
                                    text="Buscar estudiante"
                                    type="search"
                                    action={(term: string) => setSearchTerm(term)}
                                />
                                
                                <button
                                    onClick={() => setShowStudentSelector(true)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    Registrar medición
                                </button>
                            </div>
                        </div>
                        
                        {filteredStudents.length === 0 ? (
                            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md text-center">
                                No se encontraron estudiantes. {searchTerm && "Intenta con otra búsqueda."}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredStudents.map((student) => {
                                    const progress = studentsProgress[student.id];
                                    return (
                                        <div 
                                            key={student.id}
                                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                            onClick={() => handleStudentCardClick(student.id)}
                                        >
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                                                        <p className="text-gray-500">ID: {student.institutionalId}</p>
                                                    </div>
                                                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                        Estudiante
                                                    </div>
                                                </div>
                                                
                                                {progress ? (
                                                    <div className="mt-4">
                                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <p className="text-xs text-gray-500">Peso</p>
                                                                <p className="text-xl font-semibold">
                                                                    {progress.weight?.value ?? 'N/A'} {progress.weight?.unit || 'KG'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500">IMC</p>
                                                                <p className="text-xl font-semibold">
                                                                    {progress.bmi?.toFixed(1) ?? 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        {progress.recordDate && (
                                                            <p className="text-sm text-gray-500 mt-2">
                                                                Última medición: {formatDate(progress.recordDate, 'medium')}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="mt-4 text-center py-4 bg-gray-50 rounded-md">
                                                        <p className="text-gray-500">Sin mediciones registradas</p>
                                                    </div>
                                                )}
                                                
                                                <div className="mt-4 text-right">
                                                    <span className="text-blue-600 text-sm">Ver progreso →</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    // VISTA DETALLADA PARA ESTUDIANTES O ENTRENADOR VIENDO UN ESTUDIANTE
                    <div className="flex flex-col w-full">
                        <div className="flex flex-wrap justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {selectedStudent ? `Progreso de ${selectedStudent.name}` : 'Mi Progreso Físico'}
                                </h1>
                                {latestMeasurement?.recordDate && (
                                    <p className="text-gray-500">
                                        Última medición: {formatDate(latestMeasurement.recordDate, 'long')}
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {role === "TRAINER" && (
                                    <>
                                        <button
                                            onClick={() => router.push('/gym-module/physical-progress')}
                                            className="text-blue-600 border border-blue-600 px-4 py-1.5 rounded-md hover:bg-blue-50"
                                        >
                                            Volver al dashboard
                                        </button>
                                        
                                        <button
                                            onClick={() => router.push(`/gym-module/record-measurement?studentId=${studentId}`)}
                                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                            Registrar medición
                                        </button>
                                    </>
                                )}
                                
                                {role === "USER" && (
                                    <button
                                        onClick={() => router.push('/gym-module/record-measurement')}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                        Registrar nueva medición
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Pestañas para alternar entre resumen e historial */}
                        <div className="mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8">
                                    <button
                                        className={`${activeTab === 'overview' 
                                            ? 'border-blue-500 text-blue-600' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                        onClick={() => setActiveTab('overview')}
                                    >
                                        Resumen
                                    </button>
                                    <button
                                        className={`${activeTab === 'history' 
                                            ? 'border-blue-500 text-blue-600' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                        onClick={() => setActiveTab('history')}
                                    >
                                        Historial
                                    </button>
                                </nav>
                            </div>
                        </div>
                        
                        {activeTab === 'overview' ? (
                            // VISTA DE RESUMEN
                            <>
                                {latestMeasurement ? (
                                    <div className="space-y-6">
                                        {/* Métricas principales */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Peso */}
                                            <div className="bg-white rounded-lg shadow-md p-6">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Peso Actual</h3>
                                                {latestMeasurement.weight ? (
                                                    <div className="flex items-end">
                                                        <span className="text-4xl font-bold text-gray-800">
                                                            {latestMeasurement.weight.value}
                                                        </span>
                                                        <span className="text-2xl text-gray-600 ml-2 mb-1">
                                                            {latestMeasurement.weight.unit}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-500">No hay datos de peso disponibles</div>
                                                )}
                                                
                                                {progressMetrics?.weightChange && (
                                                    <div className={`mt-3 text-sm ${
                                                        progressMetrics.weightChange < 0 
                                                            ? 'text-green-600' 
                                                            : progressMetrics.weightChange > 0 
                                                                ? 'text-red-600' 
                                                                : 'text-gray-500'
                                                    }`}>
                                                        {progressMetrics.weightChange < 0 ? '↓' : '↑'} {Math.abs(progressMetrics.weightChange).toFixed(1)} kg en el último mes
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* IMC */}
                                            <div className="bg-white rounded-lg shadow-md p-6">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Índice de Masa Corporal</h3>
                                                <BMIIndicator bmi={latestMeasurement.bmi || null} />
                                            </div>
                                            
                                            {/* Medidas */}
                                            <div className="bg-white rounded-lg shadow-md p-6">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Medidas Corporales</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {latestMeasurement.measurements?.height && (
                                                        <div>
                                                            <p className="text-sm text-gray-500">Altura</p>
                                                            <p className="text-xl font-semibold">{latestMeasurement.measurements.height} m</p>
                                                        </div>
                                                    )}
                                                    {latestMeasurement.measurements?.waistCircumference && (
                                                        <div>
                                                            <p className="text-sm text-gray-500">Cintura</p>
                                                            <p className="text-xl font-semibold">{latestMeasurement.measurements.waistCircumference} cm</p>
                                                        </div>
                                                    )}
                                                    {latestMeasurement.measurements?.chestCircumference && (
                                                        <div>
                                                            <p className="text-sm text-gray-500">Pecho</p>
                                                            <p className="text-xl font-semibold">{latestMeasurement.measurements.chestCircumference} cm</p>
                                                        </div>
                                                    )}
                                                    {latestMeasurement.measurements?.hipCircumference && (
                                                        <div>
                                                            <p className="text-sm text-gray-500">Cadera</p>
                                                            <p className="text-xl font-semibold">{latestMeasurement.measurements.hipCircumference} cm</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Gráfico de IMC */}
                                        <div className="bg-white rounded-lg shadow-md p-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolución del IMC</h3>
                                            <div className="h-80">
                                                <Line
                                                    data={chartData}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: {
                                                                display: true,
                                                                position: 'top',
                                                            },
                                                            title: {
                                                                display: false,
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
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Metas físicas */}
                                        {userGoals.length > 0 && (
                                            <div className="bg-white rounded-lg shadow-md p-6">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Metas Personales</h3>
                                                <ul className="space-y-2">
                                                    {userGoals.map((goal, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <span className="text-blue-500 mr-2">•</span>
                                                            <span>{goal}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {/* Otras medidas */}
                                        {latestMeasurement.measurements && (
                                            <div className="bg-white rounded-lg shadow-md p-6">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Medidas Corporales Detalladas</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-8">
                                                    {latestMeasurement.measurements.bicepsCircumference && (
                                                        <span>Bíceps: {latestMeasurement.measurements.bicepsCircumference} cm</span>
                                                    )}
                                                    {latestMeasurement.measurements.thighCircumference && (
                                                        <span>Muslo: {latestMeasurement.measurements.thighCircumference} cm</span>
                                                    )}
                                                    {latestMeasurement.measurements.additionalMeasures?.calves && (
                                                        <span>Pantorrilla: {latestMeasurement.measurements.additionalMeasures.calves} cm</span>
                                                    )}
                                                    {latestMeasurement.measurements.additionalMeasures?.shoulders && (
                                                        <span>Hombros: {latestMeasurement.measurements.additionalMeasures.shoulders} cm</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-md text-center">
                                        <p className="text-lg font-medium mb-2">No hay mediciones registradas</p>
                                        <p>Registra tu primera medición para comenzar a hacer seguimiento de tu progreso físico.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            // VISTA DE HISTORIAL
                            <ProgressHistory 
                                measurements={measurementHistory} 
                                onSelectMeasurement={(measurement) => {
                                    router.push(`/gym-module/measurement-details?id=${measurement.id}`);
                                }} 
                            />
                        )}
                    </div>
                )}
                
                {/* Modal de selección de estudiante para entrenadores */}
                {showStudentSelector && (
                    <StudentSelectionModal
                        isOpen={showStudentSelector}
                        onClose={() => setShowStudentSelector(false)}
                        onSelectStudent={handleStudentSelect}
                    />
                )}
            </div>
        </PageTransitionWrapper>
    );
};

export default withRoleProtection(["USER", "TRAINER"], "/gym-module")(PhysicalProgress);