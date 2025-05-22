import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Return } from '@/components/Return';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';
import { withRoleProtection } from '@/hoc/withRoleProtection';
import MeasurementForm from '@/components/gym-module/MeasurementForm';
import StudentSelectionModal from '@/components/gym-module/StudentSelectionModal';
import { Student, CreatePhysicalMeasurementDTO } from '@/types/gym/physicalTracking';
import { recordPhysicalMeasurement } from '@/api/gym-module/physicalProgressService';
import { getUserById } from '@/api/gym-module/userService';

/**
 * Página para registrar una nueva medición física
 */
const RecordMeasurement = () => {
  const router = useRouter();
  const { studentId } = router.query; // Posible ID de estudiante pasado como query param
  
  const [userId, setUserId] = useState<string>('');
  const [isTrainerMode, setIsTrainerMode] = useState<boolean>(false);
  const [showStudentSelector, setShowStudentSelector] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  useEffect(() => {
    // Obtener información del usuario actual
    const userIdFromSession = sessionStorage.getItem('id');
    const userRole = sessionStorage.getItem('role');
    
    setCurrentUserRole(userRole || '');
    
    // Si hay un ID de estudiante en la URL y el usuario es entrenador
    if (studentId && userRole === 'TRAINER') {
      console.log(`Modo entrenador: Registrando medición para estudiante con ID: ${studentId}`);
      setUserId(studentId as string);
      setIsTrainerMode(true);
      loadStudentInfo(studentId as string);
    } else if (userRole === 'TRAINER') {
      // Si es entrenador pero no hay ID de estudiante, mostrar selector
      setIsTrainerMode(true);
      setShowStudentSelector(true);
    } else if (userIdFromSession) {
      // Si es usuario normal, usar su propio ID
      setUserId(userIdFromSession);
      setLoading(false);
    } else {
      // Error: no hay ID de usuario
      setError('No se pudo determinar el ID de usuario');
      setLoading(false);
    }
  }, [studentId]);
  
  const loadStudentInfo = async (id: string) => {
    try {
      console.log(`Cargando información del estudiante con ID: ${id}`);
      const student = await getUserById(id);
      if (student) {
        console.log(`Estudiante encontrado: ${student.name}`);
        setSelectedStudent({
          id: student.id || id,
          name: student.name,
          institutionalId: student.institutionalId,
          role: student.role
        });
      } else {
        console.warn(`No se encontró información para el estudiante con ID: ${id}`);
        // Usar datos simulados como fallback
        setSelectedStudent({
          id: id,
          name: "Estudiante",
          institutionalId: "No disponible",
          role: "USER"
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar información del estudiante:', error);
      // Usar datos simulados como fallback en caso de error
      setSelectedStudent({
        id: id,
        name: "Estudiante (Datos simulados)",
        institutionalId: "No disponible",
        role: "USER"
      });
      setLoading(false);
    }
  };
  
  const handleStudentSelect = (student: Student) => {
    console.log(`Estudiante seleccionado: ${student.name} (${student.id})`);
    setSelectedStudent(student);
    setUserId(student.id);
    setShowStudentSelector(false);
  };
  
  const handleFormSubmit = async (userId: string, data: CreatePhysicalMeasurementDTO) => {
    try {
      console.log(`Registrando medición para usuario con ID: ${userId}`);
      console.log('Datos de la medición:', data);
      setError(null);
      await recordPhysicalMeasurement(userId, data);
      setSuccess(true);
      
      // Redireccionar después de un breve retraso
      setTimeout(() => {
        if (isTrainerMode) {
          // Si es entrenador, redirigir a la página de progreso del estudiante
          router.push(`/gym-module/physical-progress?studentId=${userId}`);
        } else {
          // Si es usuario normal, redirigir a su propia página de progreso
          router.push('/gym-module/physical-progress');
        }
      }, 1500);
    } catch (error: any) {
      console.error('Error al registrar medición:', error);
      setError(error.message || 'Error al registrar la medición física');
    }
  };
  
  return (
    <PageTransitionWrapper>
      <div className="p-4 max-w-7xl mx-auto">
        <Return 
          className="!self-stretch !flex-[0_0_auto] !w-full mb-4"
          text="Progreso Físico"
          returnPoint={isTrainerMode && studentId ? `/gym-module/physical-progress?studentId=${studentId}` : "/gym-module/physical-progress"}
        />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Registrar Nueva Medición Física</h1>
          <p className="text-gray-600 mt-1">
            Registra tus medidas corporales para dar seguimiento a tu progreso físico.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            Medición registrada con éxito. Redirigiendo...
          </div>
        ) : (
          <>
            {isTrainerMode && selectedStudent && (
              <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-medium">Registrando medición para:</p>
                  <p>{selectedStudent.name} (ID: {selectedStudent.institutionalId})</p>
                </div>
                <button 
                  onClick={() => setShowStudentSelector(true)}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
                >
                  Cambiar
                </button>
              </div>
            )}
            
            {userId && (
              <MeasurementForm 
                userId={userId} 
                onSubmit={handleFormSubmit} 
                isTrainerMode={isTrainerMode} 
              />
            )}
            
            {showStudentSelector && (
              <StudentSelectionModal 
                isOpen={showStudentSelector}
                onClose={() => {
                  if (selectedStudent) {
                    setShowStudentSelector(false);
                  } else {
                    router.push('/gym-module/physical-progress');
                  }
                }}
                onSelectStudent={handleStudentSelect}
              />
            )}
          </>
        )}
      </div>
    </PageTransitionWrapper>
  );
};

export default withRoleProtection(["USER", "TRAINER"], "/gym-module")(RecordMeasurement);