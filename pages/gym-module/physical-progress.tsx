import { useState, useEffect } from 'react';
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
import { withRoleProtection } from '@/hoc/withRoleProtection';
import { Return } from '@/components/Return';

// Register chart elements for Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

const PhysicalProgress = () => {
    const router = useRouter();
    const { studentId, tab } = router.query;
    
    // Obtener información del usuario actual
    const currentUserId = typeof window !== 'undefined' ? sessionStorage.getItem("gymId") : null;
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
        
        // Verificar si hay un parámetro de pestaña en la URL
        if (tab === 'history') {
            setActiveTab('history');
        }
        
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
    }, [currentUserId, studentId, tab]);

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
            console.log(`Cargando datos para usuario ${userId}`);
            
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
            try {
                console.log(`Cargando datos físicos para usuario ${userId}...`);
                const [measurement, goals, progress, metrics] = await Promise.all([
                    getLatestPhysicalMeasurement(userId),
                    getUserGoals(userId),
                    getPhysicalMeasurementHistory(userId),
                    getPhysicalProgressMetrics(userId)
                ]);
                
                console.log(`Datos cargados para usuario ${userId}:`, {
                    measurementExists: !!measurement,
                    progressCount: progress.length,
                    goalsCount: goals.length
                });
                
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
                console.error(`Error al cargar datos físicos para usuario ${userId}:`, error);
                
                // Limpiar estados en caso de error
                setLatestMeasurement(null);
                setUserGoals([]);
                setMeasurementHistory([]);
                setProgressMetrics(null);
                setBmiData([]);
            }
        } catch (error) {
            console.error("Error al cargar datos del usuario:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar estudiantes según término de búsqueda
    useEffect(() => {
        if (students.length > 0) {
            const searchTermLower = searchTerm.toLowerCase();
            const filtered = students.filter(student => 
                (student.name && student.name.toLowerCase().includes(searchTermLower)) ||
                (student.institutionalId && student.institutionalId.toLowerCase().includes(searchTermLower))
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
                                <button
                                    onClick={() => setShowStudentSelector(true)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                    Ver estudiante
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
                                                    
                                                    {progress?.bmi && (
                                                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                                                            IMC: {progress.bmi.toFixed(1)}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {progress ? (
                                                    <div>
                                                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                                            {progress.weight && (
                                                                <div className="bg-gray-50 p-2 rounded">
                                                                    <span className="text-gray-500">Peso:</span> 
                                                                    <span className="font-medium ml-1">
                                                                        {progress.weight.value} {progress.weight.unit}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            
                                                            {progress.measurements?.height && (
                                                                <div className="bg-gray-50 p-2 rounded">
                                                                    <span className="text-gray-500">Altura:</span> 
                                                                    <span className="font-medium ml-1">
                                                                        {progress.measurements.height} m
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {progress.recordDate && (
                                                            <p className="text-gray-500 text-sm">
                                                                Última medición: {formatDate(progress.recordDate, 'short')}
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
                            <>
                                {latestMeasurement ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Datos principales e IMC */}
                                        <div className="flex flex-col gap-6">
                                            <div className="bg-white rounded-lg shadow-md p-6">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Peso e IMC</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {latestMeasurement.weight && (
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Peso</p>
                                                            <p className="text-2xl font-bold">
                                                                {latestMeasurement.weight.value} {latestMeasurement.weight.unit}
                                                            </p>
                                                        </div>
                                                    )}
                                                    
                                                    {latestMeasurement.measurements?.height && (
                                                        <div>
                                                            <p className="text-gray-500 mb-1">Altura</p>
                                                            <p className="text-2xl font-bold">
                                                                {latestMeasurement.measurements.height} m
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Indicador de IMC */}
                                                {latestMeasurement.bmi && (
                                                    <div className="mt-4">
                                                        <BMIIndicator bmi={latestMeasurement.bmi} />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Métricas de progreso */}
{progressMetrics && (
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progreso en 6 Meses</h3>
        <div className="grid grid-cols-2 gap-4">
            {progressMetrics.weightChange !== undefined && (
                <div>
                    <p className="text-gray-500 mb-1">Cambio de Peso</p>
                    <p className={`text-2xl font-bold ${progressMetrics.weightChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {progressMetrics.weightChange > 0 ? '+' : ''}
                        {progressMetrics.weightChange.toFixed(1)} kg
                    </p>
                </div>
            )}
            
            {progressMetrics.bmiChange !== undefined && (
                <div>
                    <p className="text-gray-500 mb-1">Cambio de IMC</p>
                    <p className={`text-2xl font-bold ${progressMetrics.bmiChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {progressMetrics.bmiChange > 0 ? '+' : ''}
                        {progressMetrics.bmiChange.toFixed(1)}
                    </p>
                </div>
            )}
            
            {progressMetrics.waistChange !== undefined && (
                <div>
                    <p className="text-gray-500 mb-1">Reducción de Cintura</p>
                    <p className={`text-2xl font-bold ${progressMetrics.waistChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {progressMetrics.waistChange > 0 ? '+' : ''}
                        {progressMetrics.waistChange.toFixed(1)} cm
                    </p>
                </div>
            )}
            
            {progressMetrics.bodyFatChange !== undefined && (
                <div>
                    <p className="text-gray-500 mb-1">Cambio de Grasa Corporal</p>
                    <p className={`text-2xl font-bold ${progressMetrics.bodyFatChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {progressMetrics.bodyFatChange > 0 ? '+' : ''}
                        {progressMetrics.bodyFatChange.toFixed(1)}%
                    </p>
                </div>
            )}
        </div>
    </div>
)}
                                            
                                            {/* Metas personales */}
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
                                        </div>
                                        
                                        {/* Gráficos y otras medidas */}
                                        <div className="flex flex-col gap-6">
                                            {/* Gráfico de evolución de IMC */}
                                            {bmiData.length > 1 && (
                                                <div className="bg-white rounded-lg shadow-md p-6">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolución de IMC</h3>
                                                    <div className="w-full h-64">
                                                        <Line 
                                                            data={chartData} 
                                                            options={{
                                                                responsive: true,
                                                                maintainAspectRatio: false,
                                                                scales: {
                                                                    y: {
                                                                        beginAtZero: false
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </div>
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
                                                        {latestMeasurement.measurements.chestCircumference && (
                                                            <span>Pecho: {latestMeasurement.measurements.chestCircumference} cm</span>
                                                        )}
                                                        {latestMeasurement.measurements.waistCircumference && (
                                                            <span>Cintura: {latestMeasurement.measurements.waistCircumference} cm</span>
                                                        )}
                                                        {latestMeasurement.measurements.hipCircumference && (
                                                            <span>Cadera: {latestMeasurement.measurements.hipCircumference} cm</span>
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
                            measurementHistory.length > 0 ? (
                                <ProgressHistory 
                                    measurements={measurementHistory} 
                                    onSelectMeasurement={(measurement) => {
                                        // Si es un entrenador viendo un estudiante, pasar el ID del estudiante
                                        if (role === "TRAINER" && studentId) {
                                            router.push(`/gym-module/measurement-details?id=${measurement.id}&studentId=${studentId}`);
                                        } else {
                                            router.push(`/gym-module/measurement-details?id=${measurement.id}`);
                                        }
                                    }} 
                                />
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-md text-center">
                                    <p className="text-lg font-medium mb-2">No hay mediciones registradas</p>
                                    <p>No se encontraron mediciones para este usuario.</p>
                                </div>
                            )
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

export default withRoleProtection(["STUDENT", "TRAINER"], "/gym-module")(PhysicalProgress);