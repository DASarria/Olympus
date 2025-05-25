/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { 
    getCurrentRoutine, 
    getUserRoutines, 
    getRecommendedRoutines,
    Routine as BaseRoutine,
    RoutineDTO,
    RoutineExerciseDTO,
    createCustomRoutine,
    getAllExercises,
    BaseExercise,
    BaseExerciseDTO,
    createExercise
} from "@/api/gymServicesIndex";
import { getUserGoals } from "@/api/gym-module/goalService";
import { getAllStudents, Student } from "@/api/gym-module/userService";
import Tabs from '@/components/gym-module/TabsProps';
import RoutineCarousel from "@/components/gym-module/RoutineCarousel";
import ExerciseCarousel from "@/components/gym-module/ExerciseCarousel";
import MuscleGroupSelector from "@/components/gym-module/MuscleGroupSelector";
import { AnimatePresence, motion } from "framer-motion";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import StudentSelectionModal from "@/components/gym-module/StudentSelectionModal";
import { FilterBtn } from '@/components/gym-module/FilterBtn';
import UserIcon from '@/public/user-filter.svg';

// Dynamically import the 3D component to prevent SSR issues
const BodyCanvasInteractive = dynamic(
  () => import('@/components/gym-module/BodyCanvasInteractive'),
  { ssr: false } // Disable server-side rendering
);

// Mapping from zone ID to muscle group name
const zoneToMuscle: Record<number, string> = {
    1: 'pecho',
    2: 'espalda',
    3: 'bíceps',
    4: 'tríceps',
    5: 'hombros',
    6: 'abdomen',
    7: 'glúteos',
    8: 'cuádriceps',
    9: 'isquiotibiales',
    10: 'pantorrillas',
};

/**
 * Interface for a routine with additional properties
 * beyond the base Routine type
 */
interface Routine extends BaseRoutine {
    matchesUserGoal?: boolean;
}

/**
 * Routines Component that renders the main content of the "Routines" page.
 * The view changes depending on the user's role (USER or TRAINER).
 */
const Routines: React.FC = () => {
    const router = useRouter();
    const { studentId } = router.query;    // User information
    const currentUserId = typeof window !== 'undefined' ? sessionStorage.getItem("id") : null;
    const [role, setRole] = useState<string | null>(null);
    
    // State for routines data
    const [currentRoutine, setCurrentRoutine] = useState<Routine | null>(null);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [recommendedRoutines, setRecommendedRoutines] = useState<Routine[]>([]);
    
    // State for filtered routines
    const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([]);
    const [filteredRecommended, setFilteredRecommended] = useState<Routine[]>([]);
    
    // UI state
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState('rutina-actual');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<number | null>(null);
    
    // TRAINER specific states
    const [viewMode, setViewMode] = useState<'dashboard' | 'detail'>('detail');
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [showStudentSelector, setShowStudentSelector] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    
    // Exercise and routine creation states
    const [allExercises, setAllExercises] = useState<BaseExercise[]>([]);
    const [newRoutine, setNewRoutine] = useState<RoutineDTO>({
        name: '',
        description: '',
        difficulty: 'Beginner',
        goal: '',
        exercises: []
    });
    
    // Physical progress and goals for recommended routines
    const [userGoals, setUserGoals] = useState<string[]>([]);// Load trainer dashboard with student list
    const loadTrainerDashboard = async () => {
        try {
            setLoading(true);
            
            if (!currentUserId) {
                console.error("No se encontró ID del entrenador");
                return;
            }
            
            // Get students assigned to the trainer
            const trainerStudents = await getAllStudents();
            setStudents(trainerStudents);
            setFilteredStudents(trainerStudents);
            
            // Get available exercises for routine creation
            try {
                const exercisesData = await getAllExercises();
                console.log("Ejercicios cargados:", exercisesData);
                setAllExercises(exercisesData);
            } catch (exercisesError) {
                console.error("Error al cargar ejercicios:", exercisesError);
                toast.error("No se pudieron cargar los ejercicios disponibles");
                // Set empty array to avoid undefined errors
                setAllExercises([]);
            }
            
        } catch (error) {
            console.error("Error al cargar dashboard del entrenador:", error);
        } finally {
            setLoading(false);
        }
    };
      // Load detailed data for a specific user
    const loadUserData = async (userId: string) => {
        try {
            setLoading(true);
            console.log(`Cargando datos para usuario ${userId}`);
              // If trainer viewing a student, get student details
            if (role === "TRAINER" && userId !== currentUserId) {
                try {
                    const studentsList = await getAllStudents();
                    const student = studentsList.find(s => s.id === userId);
                    if (student) {
                        setSelectedStudent(student);
                        console.log("Selected student:", student);
                    } else {
                        console.warn(`Student with ID ${userId} not found in list`);
                        toast.error("Estudiante no encontrado");
                    }
                } catch (studentError) {
                    console.error("Error fetching student details:", studentError);
                    toast.error("Error al obtener detalles del estudiante");
                }
                
                // Get all exercises for routine creation
                try {
                    const exercisesData = await getAllExercises();
                    console.log("Ejercicios cargados:", exercisesData);
                    setAllExercises(exercisesData);
                } catch (exercisesError) {
                    console.error("Error al cargar ejercicios:", exercisesError);
                    toast.error("No se pudieron cargar los ejercicios disponibles");
                    setAllExercises([]);
                }
            }
              // Fetch routines and other data in parallel
            try {
            // Fetch all exercises (for enrichment) and physical goals for recommendations first
            let exercisesData: BaseExercise[] = [];
            try {
                exercisesData = await getAllExercises();
                setAllExercises(exercisesData);
            } catch (ex) {
                console.error("Error loading exercises for user view:", ex);
            }
            // Fetch user goals for recommendations
                const goalsData = await getUserGoals(userId).catch(err => {
                    console.error('Error fetching user goals:', err);
                    return [];
                });
                setUserGoals(goalsData);
                  // Create safer versions of the API calls with proper fallbacks
                const safeGetCurrentRoutine = async (id: string) => {
                    try {
                        console.log(`Safely fetching current routine for user ID: ${id}`);
                        // Instead of directly calling getCurrentRoutine, we'll handle 404 error more gracefully
                        try {
                            const routine = await getCurrentRoutine(id);
                            console.log("Current routine fetch successful:", routine?.name || "No name found");
                            return routine;
                        } catch (routineErr: any) {
                            // Check specifically for 404 error which means no current routine
                            if (routineErr.response?.status === 404) {
                                console.log("No current routine found for user (404 response)");
                                return null;
                            }
                            // Any other error, rethrow to be caught by the outer try-catch
                            throw routineErr;
                        }
                    } catch (err) {
                        console.error('Error in safeGetCurrentRoutine:', err);
                        // Return null for any errors to avoid breaking the UI
                        return null;
                    }
                };
                
                const safeGetUserRoutines = async (id: string) => {
                    try {
                        console.log(`Safely fetching user routines for user ID: ${id}`);
                        const routines = await getUserRoutines(id);
                        console.log(`Retrieved ${routines.length} user routines`);
                        return routines;
                    } catch (err) {
                        console.error('Error fetching user routines:', err);
                        toast.error("No se pudieron cargar tus rutinas");
                        return [];
                    }
                };
                
                const safeGetRecommendedRoutines = async (id: string) => {
                    try {
                        console.log(`Safely fetching recommended routines for user ID: ${id}`);
                        const routines = await getRecommendedRoutines(id);
                        console.log(`Retrieved ${routines.length} recommended routines`);
                        return routines;
                    } catch (err) {
                        console.error('Error fetching recommended routines:', err);
                        toast.error("No se pudieron cargar las rutinas recomendadas");
                        return [];
                    }
                };
                
                console.log("Fetching all routine data in parallel...");
                // Fetch current routine, user routines, and recommended routines
                const [currentRoutineData, userRoutinesData, recommendedRoutinesData] = await Promise.all([
                    safeGetCurrentRoutine(userId),
                    safeGetUserRoutines(userId),
                    safeGetRecommendedRoutines(userId)
                ]);
                // enrich exercises with details
                const enrichRoutine = (routine: Routine | null) => {
                    if (!routine) return null;
                    return {
                        ...routine,
                        exercises: routine.exercises?.map(ex => {
                            const base = exercisesData.find(be => be.id === ex.baseExerciseId);
                            return {
                                ...ex,
                                name: base?.name,
                                description: base?.description,
                                muscleGroup: base?.muscleGroup,
                                equipment: base?.equipment,
                                imageUrl: base?.imageUrl,
                                videoUrl: base?.videoUrl
                            };
                        })
                    } as Routine;
                };
                const enrichedCurrent = enrichRoutine(currentRoutineData);
                const enrichedUserRoutines = userRoutinesData.map(r => enrichRoutine(r)!) as Routine[];
                const processedRecommendedRoutines = recommendedRoutinesData.map(routine => {
                      // Check if routine goal matches any user goals
                      const matchesUserGoal = routine.goal && goalsData.some(
                          goal => goal.toLowerCase() === routine.goal?.toLowerCase()
                      );
                      
                      console.log(`Routine ${routine.name} goal: ${routine.goal}, Matches user goals: ${matchesUserGoal}`, 
                          { routineGoal: routine.goal, userGoals: goalsData });
                      
                      return {
                          ...routine,
                          // Add a flag to identify if this routine matches user goals
                          matchesUserGoal: matchesUserGoal
                      } as Routine;
                  });
                  
                  setCurrentRoutine(enrichedCurrent);
                  setRoutines(enrichedUserRoutines);
                  setFilteredRoutines(enrichedUserRoutines);
                  setRecommendedRoutines(processedRecommendedRoutines);
                  setFilteredRecommended(processedRecommendedRoutines);
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setLoading(false);
            }
        } catch (error) {
            console.error("Error al cargar datos del usuario:", error);
            setLoading(false);
        }
    };    
    
    useEffect(() => {
        // Get user role from session storage
        const userRole = sessionStorage.getItem("role");
        setRole(userRole);
        
        // Determine view mode based on role and studentId
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserId, studentId]);

    // Filter students based on search term
    useEffect(() => {
        if (students.length > 0) {
            const searchTermLower = searchTerm.toLowerCase();
            const filtered = students.filter(student => 
                (student.name?.toLowerCase().includes(searchTermLower)) ||
                (student.institutionalId?.toLowerCase().includes(searchTermLower))
            );
            setFilteredStudents(filtered);
        }
    }, [searchTerm, students]);

    // Effect to filter routines based on selected muscle group
    useEffect(() => {
        if (selectedMuscleGroup !== null) {
            const muscleName = zoneToMuscle[selectedMuscleGroup].toLowerCase();
            
            // Filter routines based on their exercises' muscle groups
            setFilteredRoutines(
                routines.filter(routine => 
                    routine.exercises?.some(exercise => 
                        exercise.muscleGroup?.toLowerCase() === muscleName ||
                        exercise.muscleGroup?.toLowerCase()?.includes(muscleName)
                    ) ?? false
                )
            );
            
            // Similarly filter recommended routines
            setFilteredRecommended(
                recommendedRoutines.filter(routine => 
                    routine.exercises?.some(exercise => 
                        exercise.muscleGroup?.toLowerCase() === muscleName ||
                        exercise.muscleGroup?.toLowerCase()?.includes(muscleName)
                    ) ?? false
                )
            );
        } else {
            setFilteredRoutines(routines);
            setFilteredRecommended(recommendedRoutines);
        }
    }, [selectedMuscleGroup, routines, recommendedRoutines]);
    
    // Handle student selection from modal
    const handleStudentSelect = (student: Student) => {
        setShowStudentSelector(false);
        router.push(`/gym-module/Routines?studentId=${student.id}`);
    };
    
    // Handle student card click in dashboard
    const handleStudentCardClick = (studentId: string) => {
        router.push(`/gym-module/Routines?studentId=${studentId}`);
    };    // Handle routine creation for a student
    const handleCreateRoutine = async () => {
        if (!selectedStudent?.id) {
            toast.error("Por favor, seleccione un estudiante primero");
            return;
        }
        
        // Validate the routine data
        if (!newRoutine.name || newRoutine.name.trim() === '') {
            toast.error("Por favor, ingrese un nombre para la rutina");
            return;
        }
        
        if (!newRoutine.exercises || newRoutine.exercises.length === 0) {
            toast.error("Por favor, agregue al menos un ejercicio a la rutina");
            return;
        }
        
        // Check for goal selection
        if (!newRoutine.goal || newRoutine.goal.trim() === '') {
            toast("⚠️ No se ha seleccionado un objetivo específico. Se utilizará un objetivo general.");
            // Set a default goal
            newRoutine.goal = "Mejorar condición física general";
        }
        
        // Verify all exercises have valid baseExerciseId and other required fields
        const validatedExercises = newRoutine.exercises.map(ex => {
            // Ensure baseExerciseId is valid
            if (!ex.baseExerciseId || ex.baseExerciseId.trim() === '') {
                console.error("Exercise missing baseExerciseId:", ex);
                throw new Error("La rutina contiene ejercicios inválidos. Por favor, elimínelos y agréguelos nuevamente.");
            }
            
            // Ensure required numeric values are valid or set defaults
            return {
                ...ex,
                sets: ex.sets || 3,
                repetitions: ex.repetitions || 12,
                restTime: ex.restTime || 60,
                sequenceOrder: ex.sequenceOrder || 1
            };
        });
        
        // Sort exercises by sequence order
        validatedExercises.sort((a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0));
        
        try {
            console.log(`Creating routine for student ${selectedStudent.id}:`, {
                ...newRoutine,
                exercises: validatedExercises
            });
            
            const toastId = toast.loading("Creando rutina...");
            
            const routineWithTrainerId = {
                ...newRoutine,
                exercises: validatedExercises,
                trainerId: currentUserId || undefined,
                // Ensure description has a value if empty
                description: newRoutine.description || `Rutina de ${newRoutine.difficulty} creada para ${selectedStudent.name}`,
            };
            
            const createdRoutine = await createCustomRoutine(selectedStudent.id, routineWithTrainerId);
            
            toast.dismiss(toastId);
            toast.success("Rutina creada exitosamente");
            
            console.log("Routine created successfully:", createdRoutine);
            
            // Reload user data to show the new routine
            loadUserData(selectedStudent.id);
            
            // Reset form
            setNewRoutine({
                name: '',
                description: '',
                difficulty: 'Beginner',
                goal: '',
                exercises: []
            });
            
            // Close any open exercise form
            const form = document.getElementById('create-exercise-form');
            if (form && !form.classList.contains('hidden')) {
                form.classList.add('hidden');
            }
        } catch (error: any) {
            toast.dismiss();
            console.error("Error al crear rutina:", error);
            
            if (error.response?.status === 400) {
                toast.error(`Error en datos de rutina: ${error.response?.data?.message || "Verifique los campos"}`);
            } else if (error.response?.status === 404) {
                toast.error("Usuario o ejercicios no encontrados. Verifique los IDs.");
            } else {
                toast.error(error.message || "Error al crear la rutina. Intente nuevamente.");
            }
        }
    };// Handle exercise creation
    const handleCreateExercise = async () => {
        // Get values from form inputs
        const nameInput = document.getElementById('exercise-name') as HTMLInputElement;
        const muscleGroupSelect = document.getElementById('exercise-muscle-group') as HTMLSelectElement;
        const equipmentSelect = document.getElementById('exercise-equipment') as HTMLSelectElement;
        const descriptionTextarea = document.getElementById('exercise-description') as HTMLTextAreaElement;
        const imageUrlInput = document.getElementById('exercise-image-url') as HTMLInputElement;
        const videoUrlInput = document.getElementById('exercise-video-url') as HTMLInputElement;
        
        // Get the form values
        const name = nameInput?.value?.trim() || '';
        const equipment = equipmentSelect?.value || '';
        const description = descriptionTextarea?.value?.trim() || '';
        const imageUrl = imageUrlInput?.value?.trim() || '';
        const videoUrl = videoUrlInput?.value?.trim() || '';
        
        // Determine muscle group: prioritize the 3D model selection if available
        let muscleGroup = '';
        if (selectedMuscleGroup !== null) {
            // Convert the selectedMuscleGroup to the proper backend format
            muscleGroup = zoneToMuscle[selectedMuscleGroup].toUpperCase();
            console.log(`Using preselected muscle group from 3D model: ${muscleGroup}`);
        } else if (muscleGroupSelect?.value) {
            // Otherwise, use the form value
            muscleGroup = muscleGroupSelect.value;
            console.log(`Using form-selected muscle group: ${muscleGroup}`);
        }
        
        // Validate required fields
        if (!name) {
            toast.error("Por favor, ingrese un nombre para el ejercicio");
            return;
        }
        
        if (!muscleGroup) {
            toast.error("Por favor, seleccione un grupo muscular");
            return;
        }
        
        if (!equipment) {
            toast.error("Por favor, seleccione un tipo de equipamiento");
            return;
        }
        
        // Create exercise object
        const exerciseDTO: BaseExerciseDTO = {
            name,
            description: description || undefined,
            muscleGroup,
            equipment,
            imageUrl: imageUrl || undefined,
            videoUrl: videoUrl || undefined
        };
        
        console.log("Creating new exercise with data:", exerciseDTO);
        
        try {
            toast.loading("Creando nuevo ejercicio...");
            
            // Call API to create exercise
            const createdExercise = await createExercise(exerciseDTO);
            
            if (!createdExercise || !createdExercise.id) {
                console.error("El ejercicio creado no tiene ID:", createdExercise);
                toast.dismiss();
                toast.error("Error: El ejercicio no se creó correctamente");
                return;
            }
            
            console.log("Exercise created successfully:", createdExercise);
            
            // Update exercises list
            setAllExercises(prevExercises => {
                // Verificar si el ejercicio ya existe para evitar duplicados
                const exists = prevExercises.some(ex => ex.id === createdExercise.id);
                if (exists) return prevExercises;
                return [...prevExercises, createdExercise];
            });
            
            // Reset form
            if (nameInput) nameInput.value = '';
            // Don't reset muscle group if it's from the 3D model
            if (muscleGroupSelect && selectedMuscleGroup === null) muscleGroupSelect.value = '';
            if (equipmentSelect) equipmentSelect.value = '';
            if (descriptionTextarea) descriptionTextarea.value = '';
            if (imageUrlInput) imageUrlInput.value = '';
            if (videoUrlInput) videoUrlInput.value = '';
            
            // Hide form
            const form = document.getElementById('create-exercise-form');
            if (form) {
                form.classList.add('hidden');
            }
            
            toast.dismiss();
            toast.success("Ejercicio creado exitosamente");
            
            // Recargar ejercicios para asegurar que tengamos la lista actualizada
            try {
                const refreshedExercises = await getAllExercises();
                if (refreshedExercises && refreshedExercises.length > 0) {
                    setAllExercises(refreshedExercises);
                    console.log("Lista de ejercicios actualizada:", refreshedExercises.length, "ejercicios");
                }
            } catch (refreshError) {
                console.error("Error al refrescar la lista de ejercicios:", refreshError);
            }
        } catch (error) {
            console.error("Error al crear ejercicio:", error);
            toast.dismiss();
            toast.error("Error al crear el ejercicio. Intente nuevamente.");
        }
    };// Handle adding exercise to new routine
    const handleAddExercise = (exercise: BaseExercise) => {
        if (!exercise.id) {
            console.error("Exercise is missing ID:", exercise);
            toast.error("No se puede agregar un ejercicio sin ID");
            return;
        }
        
        // Log the exercise being added for debugging
        console.log("Adding exercise to routine:", exercise);
        
        // Check if this exercise is already added to avoid duplicates
        const isAlreadyAdded = newRoutine.exercises?.some((ex: RoutineExerciseDTO) => ex.baseExerciseId === exercise.id);
        if (isAlreadyAdded) {
            toast.error("Este ejercicio ya está en la rutina");
            return;
        }
        
        // Calculate the next sequence order
        const nextOrder = newRoutine.exercises?.length ? 
            Math.max(...newRoutine.exercises.map(ex => ex.sequenceOrder || 0)) + 1 : 1;
        
        // Create the exercise with required parameters for the routine
        const newExercise: RoutineExerciseDTO = {
            baseExerciseId: exercise.id,
            sets: 3, // Default value
            repetitions: 12, // Default value
            restTime: 60, // Default rest time in seconds
            sequenceOrder: nextOrder
        };
        
        try {
            // Add the exercise to the routine
            setNewRoutine(prev => ({
                ...prev,
                exercises: [...(prev.exercises || []), newExercise]
            }));
            
            toast.success(`Ejercicio "${exercise.name}" agregado a la rutina (${newExercise.sets} series x ${newExercise.repetitions} repeticiones)`);
            
            // Scroll to the added exercise section
            setTimeout(() => {
                const exercisesSection = document.getElementById('selected-exercises-section');
                if (exercisesSection) {
                    exercisesSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        } catch (error) {
            console.error("Error al agregar ejercicio:", error);
            toast.error("Error al agregar el ejercicio");
        }
    };
      // Remove exercise from new routine
    const handleRemoveExercise = (index: number) => {
        setNewRoutine(prev => ({
            ...prev,
            exercises: prev.exercises?.filter((_: RoutineExerciseDTO, i: number) => i !== index)
        }));
    };

    // Render Trainer Dashboard View
    const renderTrainerDashboard = () => (
        <div className="flex flex-col gap-6">
            <Return 
                className="self-stretch flex-[0_0_auto] w-full"
                text="Módulo de Gimnasio"
                returnPoint="/gym-module"
            />
            
            <div className="flex flex-col w-full">
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Rutinas - Estudiantes</h1>
                    
                    <div className="flex items-center gap-4">
                        <FilterBtn
                            icon={UserIcon}
                            text="Buscar estudiante"
                            type="search"
                            action={(term) => setSearchTerm(term as string)}
                        />
                        
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
                        {filteredStudents.map((student) => (
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
                                    </div>
                                    
                                    <div className="mt-4 text-right">
                                        <span className="text-blue-600 text-sm">Gestionar rutinas →</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Render Trainer Detail View (viewing a specific student)
    const renderTrainerDetailView = () => (
        <div className="flex flex-col gap-6">
            <Return 
                className="self-stretch flex-[0_0_auto] w-full"
                text="Volver al listado"
                returnPoint="/gym-module/Routines"
            />
            
            <div className="flex flex-col w-full">
                <div className="flex flex-wrap justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Rutinas de {selectedStudent?.name}
                    </h1>
                    
                    <button
                        onClick={() => router.push('/gym-module/Routines')}
                        className="text-blue-600 border border-blue-600 px-4 py-1.5 rounded-md hover:bg-blue-50"
                    >
                        Volver al dashboard
                    </button>
                </div>
                
                {/* Mostrar los objetivos del estudiante */}
                {userGoals.length > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Objetivos del estudiante:</h3>
                        <div className="flex flex-wrap gap-2">
                            {userGoals.map((goal, i) => (
                                <span key={`student-goal-${i}-${goal}`} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {goal}
                                </span>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Estos objetivos te ayudarán a crear rutinas personalizadas para este estudiante.
                        </p>
                    </div>
                )}
                
                {/* Selector de grupos musculares para filtrar ejercicios */}
                <div className="mb-6">
                    <MuscleGroupSelector 
                        onSelect={setSelectedMuscleGroup}
                        selectedMuscleGroup={selectedMuscleGroup}
                        zoneMap={zoneToMuscle}
                    />
                </div>
                
                {/* Crear nueva rutina form */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">Crear nueva rutina</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" id="routine-name-label">Nombre de la rutina</label>
                            <input
                                type="text"
                                value={newRoutine.name}
                                onChange={(e) => setNewRoutine({...newRoutine, name: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Ej: Rutina de fuerza"
                                aria-labelledby="routine-name-label"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" id="goal-label">Objetivo</label>
                            <select
                                value={newRoutine.goal}
                                onChange={(e) => setNewRoutine({...newRoutine, goal: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                aria-labelledby="goal-label"
                            >
                                <option value="">Selecciona un objetivo</option>                                {userGoals.map((goal) => (
                                    <option key={`goal-option-${goal}`} value={goal}>{goal}</option>
                                ))}
                                <option value="Ganar masa muscular">Ganar masa muscular</option>
                                <option value="Perder peso">Perder peso</option>
                                <option value="Aumentar resistencia">Aumentar resistencia</option>
                                <option value="Mejorar flexibilidad">Mejorar flexibilidad</option>
                                <option value="Rehabilitación">Rehabilitación</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1" id="difficulty-label">Dificultad</label>
                            <select
                                value={newRoutine.difficulty}
                                onChange={(e) => setNewRoutine({...newRoutine, difficulty: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                aria-labelledby="difficulty-label"
                            >
                                <option value="Beginner">Principiante</option>
                                <option value="Intermediate">Intermedio</option>
                                <option value="Advanced">Avanzado</option>
                            </select>
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1" id="description-label">Descripción</label>
                            <textarea
                                value={newRoutine.description}
                                onChange={(e) => setNewRoutine({...newRoutine, description: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows={3}
                                placeholder="Descripción de la rutina..."
                                aria-labelledby="description-label"
                            ></textarea>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <h3 className="text-lg font-medium mb-2">Ejercicios</h3>
                          {/* Crear nuevo ejercicio */}
                        <div className="mb-5 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-gray-700">Crear nuevo ejercicio</h4>
                                <button
                                    type="button"
                                    className="text-blue-600 text-sm flex items-center gap-1"
                                    onClick={() => {
                                        const form = document.getElementById('create-exercise-form');
                                        if (form) {
                                            form.classList.toggle('hidden');
                                        }
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="16"></line>
                                        <line x1="8" y1="12" x2="16" y2="12"></line>
                                    </svg>
                                    Crear ejercicio
                                </button>
                            </div>
                            
                            <div id="create-exercise-form" className="hidden bg-white p-4 border border-gray-200 rounded-md shadow-sm">
                                <div className="text-sm text-gray-600 mb-3">
                                    Complete los siguientes campos para crear un nuevo ejercicio. Los campos marcados con * son obligatorios.
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" id="exercise-name-label">
                                            Nombre del ejercicio *
                                        </label>
                                        <input
                                            type="text"
                                            id="exercise-name"
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            placeholder="Ej: Extreme push up"
                                            aria-labelledby="exercise-name-label"
                                        />
                                    </div>
                                    
                                    <div>                                        <label className="block text-sm font-medium text-gray-700 mb-1" id="exercise-muscle-group-label">
                                            Grupo muscular {selectedMuscleGroup !== null ? '(preseleccionado)' : '*'}
                                        </label>
                                        <select
                                            id="exercise-muscle-group"
                                            className={`w-full p-2 border border-gray-300 rounded-md ${selectedMuscleGroup !== null ? 'bg-gray-100' : ''}`}
                                            aria-labelledby="exercise-muscle-group-label"
                                            disabled={selectedMuscleGroup !== null}
                                            value={selectedMuscleGroup !== null ? zoneToMuscle[selectedMuscleGroup].toUpperCase() : ""}
                                        >
                                            <option value="">Seleccionar grupo muscular</option>
                                            <option value="CHEST">Pecho</option>
                                            <option value="BACK">Espalda</option>
                                            <option value="BICEPS">Bíceps</option>
                                            <option value="TRICEPS">Tríceps</option>
                                            <option value="SHOULDERS">Hombros</option>
                                            <option value="ABS">Abdomen</option>
                                            <option value="GLUTES">Glúteos</option>
                                            <option value="QUADS">Cuádriceps</option>
                                            <option value="HAMSTRINGS">Isquiotibiales</option>
                                            <option value="CALVES">Pantorrillas</option>
                                            <option value="FULL_BODY">Cuerpo completo</option>
                                        </select>
                                        {selectedMuscleGroup !== null && (
                                            <p className="text-xs text-blue-600 mt-1">
                                                Grupo muscular preseleccionado del modelo 3D: {zoneToMuscle[selectedMuscleGroup]}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" id="exercise-equipment-label">
                                            Equipamiento *
                                        </label>
                                        <select
                                            id="exercise-equipment"
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            aria-labelledby="exercise-equipment-label"
                                        >
                                            <option value="">Seleccionar equipamiento</option>
                                            <option value="BARBELL">Barra</option>
                                            <option value="DUMBBELL">Mancuernas</option>
                                            <option value="MACHINE">Máquina</option>
                                            <option value="CABLE">Cable</option>
                                            <option value="BODYWEIGHT">Peso corporal</option>
                                            <option value="RESISTANCE_BAND">Banda de resistencia</option>
                                            <option value="KETTLEBELL">Kettlebell</option>
                                            <option value="MEDICINE_BALL">Balón medicinal</option>
                                            <option value="NONE">Ninguno</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1" id="exercise-description-label">
                                            Descripción
                                        </label>
                                        <textarea
                                            id="exercise-description"
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            rows={3}
                                            placeholder="Descripción detallada del ejercicio..."
                                            aria-labelledby="exercise-description-label"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" id="exercise-image-url-label">
                                            URL de imagen
                                        </label>
                                        <input
                                            type="text"
                                            id="exercise-image-url"
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                            aria-labelledby="exercise-image-url-label"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" id="exercise-video-url-label">
                                            URL de video
                                        </label>
                                        <input
                                            type="text"
                                            id="exercise-video-url"
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            placeholder="https://ejemplo.com/video.mp4"
                                            aria-labelledby="exercise-video-url-label"
                                        />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={handleCreateExercise}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    >
                                        Crear Ejercicio
                                    </button>
                                </div>
                            </div>
                        </div>
                          {/* Listado de ejercicios disponibles, agrupados por grupo muscular */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1" id="exercises-label">Agregar ejercicios</label>
                            
                            {/* Mensaje para indicar filtrado */}
                            {selectedMuscleGroup !== null && (
                                <div className="mb-2 text-sm text-blue-600">
                                    Mostrando ejercicios para {zoneToMuscle[selectedMuscleGroup]}
                                    <button 
                                        onClick={() => setSelectedMuscleGroup(null)} 
                                        className="ml-2 text-xs bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded"
                                    >
                                        Ver todos
                                    </button>
                                </div>
                            )}
                            
                            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                                {allExercises.length === 0 ? (
                                    <p className="text-center py-4 text-gray-500">
                                        No hay ejercicios disponibles. Crea un ejercicio primero.
                                    </p>
                                ) : (
                                    /* Agrupar ejercicios por grupo muscular */
                                    Object.values(zoneToMuscle).map(muscleGroup => {
                                        // Filtrar ejercicios para este grupo muscular
                                        const exercisesForGroup = allExercises.filter(
                                            exercise => exercise.muscleGroup?.toLowerCase() === muscleGroup.toLowerCase()
                                        );
                                        
                                        // Si no hay ejercicios para este grupo, no mostrar la sección
                                        if (exercisesForGroup.length === 0) return null;
                                        
                                        // Si hay un grupo muscular seleccionado y no es este, no mostrar
                                        if (selectedMuscleGroup !== null && 
                                            zoneToMuscle[selectedMuscleGroup].toLowerCase() !== muscleGroup.toLowerCase()) {
                                            return null;
                                        }
                                        
                                        return (
                                            <div key={`group-${muscleGroup}`} className="mb-3">
                                                <h4 className="text-md font-medium text-gray-700 border-b border-gray-300 pb-1 mb-2 capitalize">
                                                    {muscleGroup}
                                                </h4>                                                {exercisesForGroup.map((exercise) => (
                                                    <div key={`ex-${exercise.id}`} className="flex justify-between items-center py-2 border-b border-gray-100 hover:bg-gray-50">
                                                        <div>
                                                            <p className="font-medium">{exercise.name}</p>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                {exercise.equipment && (
                                                                    <span className="inline-block bg-gray-100 px-2 py-0.5 rounded">
                                                                        {exercise.equipment}
                                                                    </span>
                                                                )}
                                                                {exercise.description && (
                                                                    <span className="inline-block truncate max-w-[200px]">
                                                                        {exercise.description}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleAddExercise(exercise)}
                                                            className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100"
                                                            aria-label={`Agregar ejercicio ${exercise.name}`}
                                                        >
                                                            Agregar
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>                          {/* Ejercicios seleccionados */}
                        <div id="selected-exercises-section">
                            <h4 className="text-md font-medium mb-2">Ejercicios seleccionados</h4>
                            {newRoutine.exercises && newRoutine.exercises.length > 0 ? (
                                <div className="border border-gray-200 rounded-md">
                                    {newRoutine.exercises.map((exercise, index) => {
                                        // Find the base exercise to get name and muscle group
                                        const baseExercise = allExercises.find(e => e.id === exercise.baseExerciseId);
                                        
                                        if (!baseExercise) {
                                            console.warn(`Base exercise not found for ID: ${exercise.baseExerciseId}`);
                                        }
                                        
                                        return (
                                            <div key={`exercise-${baseExercise?.id ?? index}`} 
                                                className="flex flex-wrap justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50">
                                                <div className="w-full md:w-auto mb-2 md:mb-0">
                                                    <p className="font-medium">{baseExercise?.name ?? 'Ejercicio sin nombre'}</p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                            {baseExercise?.muscleGroup ?? 'Sin grupo muscular'}
                                                        </span>
                                                        {baseExercise?.equipment && (
                                                            <span className="inline-block bg-gray-100 px-2 py-0.5 rounded">
                                                                {baseExercise.equipment}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-2 items-center">
                                                    <div>
                                                        <label className="block text-xs text-gray-500" id={`sets-label-${index}`}>Series</label>
                                                        <input
                                                            type="number"
                                                            value={exercise.sets}
                                                            onChange={(e) => {
                                                                const newExercises = [...newRoutine.exercises!];
                                                                newExercises[index] = {
                                                                    ...newExercises[index],
                                                                    sets: parseInt(e.target.value) || 3
                                                                };
                                                                setNewRoutine({...newRoutine, exercises: newExercises});
                                                            }}
                                                            className="w-16 p-1 border border-gray-300 rounded-md"
                                                            min="1"
                                                            aria-labelledby={`sets-label-${index}`}
                                                            placeholder="Series"
                                                        />
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-xs text-gray-500" id={`reps-label-${index}`}>Reps</label>
                                                        <input
                                                            type="number"
                                                            value={exercise.repetitions}
                                                            onChange={(e) => {
                                                                const newExercises = [...newRoutine.exercises!];
                                                                newExercises[index] = {
                                                                    ...newExercises[index],
                                                                    repetitions: parseInt(e.target.value) || 12
                                                                };
                                                                setNewRoutine({...newRoutine, exercises: newExercises});
                                                            }}
                                                            className="w-16 p-1 border border-gray-300 rounded-md"
                                                            min="1"
                                                            aria-labelledby={`reps-label-${index}`}
                                                            placeholder="Reps"
                                                        />
                                                    </div>
                                                          <div>
                                                    <label className="block text-xs text-gray-500" id={`rest-label-${index}`}>Descanso (s)</label>
                                                    <input
                                                        type="number"
                                                        value={exercise.restTime}
                                                        onChange={(e) => {
                                                            const newExercises = [...newRoutine.exercises!];
                                                            newExercises[index] = {
                                                                ...newExercises[index],
                                                                restTime: parseInt(e.target.value) || 60
                                                            };
                                                            setNewRoutine({...newRoutine, exercises: newExercises});
                                                        }}
                                                        className="w-16 p-1 border border-gray-300 rounded-md"
                                                        min="0"
                                                        aria-labelledby={`rest-label-${index}`}
                                                        placeholder="Descanso"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-xs text-gray-500" id={`order-label-${index}`}>Orden</label>
                                                    <input
                                                        type="number"
                                                        value={exercise.sequenceOrder}
                                                        onChange={(e) => {
                                                            const newExercises = [...newRoutine.exercises!];
                                                            newExercises[index] = {
                                                                ...newExercises[index],
                                                                sequenceOrder: parseInt(e.target.value) || index + 1
                                                            };
                                                            setNewRoutine({...newRoutine, exercises: newExercises});
                                                        }}
                                                        className="w-16 p-1 border border-gray-300 rounded-md"
                                                        min="1"
                                                        aria-labelledby={`order-label-${index}`}
                                                        placeholder="Orden"
                                                    />
                                                </div>
                                                    
                                                    <button
                                                        onClick={() => handleRemoveExercise(index)}
                                                        className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-md hover:bg-red-100 ml-2"
                                                        aria-label={`Eliminar ejercicio ${baseExercise?.name ?? 'seleccionado'}`}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4 border border-gray-200 rounded-md">
                                    No hay ejercicios seleccionados
                                </p>
                            )}
                        </div>
                    </div>
                      <div className="mt-6 text-right">
                        <button
                            onClick={handleCreateRoutine}
                            disabled={!newRoutine.name || !newRoutine.exercises || newRoutine.exercises.length === 0}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
                            aria-label="Crear rutina personalizada"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="12" y1="18" x2="12" y2="12"></line>
                                <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
                            Crear Rutina
                        </button>
                    </div>
                </div>
                
                {/* Rutinas actuales del estudiante */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Rutinas Actuales</h2>
                    {routines.length > 0 ? (
                        <div className="mb-4">
                            <RoutineCarousel routines={routines} />
                        </div>
                    ) : (
                        <p className="text-center py-4 bg-gray-50 rounded-md text-gray-500">
                            No hay rutinas disponibles para este estudiante
                        </p>
                    )}
                </div>
                
                {/* Rutinas recomendadas basadas en sus objetivos */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Rutinas Recomendadas por Objetivos</h2>
                    <div className="mb-2">
                        <h3 className="text-md font-medium">Objetivos del estudiante:</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {userGoals.length > 0 ? (
                                userGoals.map((goal, i) => (
                                    <span key={`goal-${i}-${goal}`} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {goal}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500">No se han definido objetivos</span>
                            )}
                        </div>
                    </div>
                    
                    {recommendedRoutines.length > 0 ? (
                        <div className="mb-4">
                            <RoutineCarousel routines={recommendedRoutines} />
                        </div>
                    ) : (
                        <p className="text-center py-4 bg-gray-50 rounded-md text-gray-500">
                            No hay rutinas recomendadas disponibles para este estudiante
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    // Render User View
    const renderUserView = () => (
        <div className="flex flex-col gap-6">
            <Return 
                className="self-stretch flex-[0_0_auto] w-full"
                text="Rutinas"
                returnPoint="/gym-module"
            />
            
            <div className="flex flex-col md:flex-row gap-6">
                {/* 3D Body model - ONLY shown for USER role */}
                <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col items-center justify-center gap-5">
                    <BodyCanvasInteractive
                        modelPath="/models/male/scene.gltf"
                    />
                    <div className="text-center text-sm text-gray-500">
                        Usa el selector de arriba para filtrar por grupo muscular
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    {/* Selector de grupos musculares mejorado */}
                    <MuscleGroupSelector 
                        onSelect={setSelectedMuscleGroup}
                        selectedMuscleGroup={selectedMuscleGroup}
                        zoneMap={zoneToMuscle}
                    />
                    
                    {/* Pestañas */}
                    <div className="mb-6">
                        <Tabs
                            tabs={[
                            { id: 'rutina-actual', label: 'Rutina actual' },
                            { id: 'todas-rutinas', label: 'Todas las rutinas' }
                            ]}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    <AnimatePresence mode="wait">
                        {filteredRoutines.length > 0 ? (
                            <>
                                {activeTab === 'rutina-actual' && currentRoutine && (
                                    <motion.div
                                        key="rutina-actual"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col gap-4"
                                    >
                                        <h2 className="text-2xl font-bold">{currentRoutine.name}</h2>
                                        <p className="relative w-fit mt-[-1px] font-bold text-gray-700">{currentRoutine.description}</p>
                                        <ExerciseCarousel exercises={currentRoutine.exercises || []} />
                                    </motion.div>
                                )}
                                {activeTab === 'todas-rutinas' && (
                                    <motion.div
                                        key="todas-rutinas"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col gap-4"
                                    >
                                        <h2 className="text-2xl font-bold mb-4">Tus Rutinas</h2>
                                        <RoutineCarousel routines={filteredRoutines} />
                                    </motion.div>
                                )}
                            </>
                        ) : (
                            <div className="col-span-full text-center py-6 text-gray-500">
                                No hay rutinas disponibles para este grupo muscular
                            </div>
                        )}
                    </AnimatePresence>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Rutinas Recomendadas</h2>
                    {/* Mostrar los objetivos del usuario */}
                    {userGoals.length > 0 && (
                        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold mb-2">Tus objetivos:</h3>
                            <div className="flex flex-wrap gap-2">
                                {userGoals.map((goal, i) => (
                                    <span key={`user-goal-${i}-${goal}`} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {goal}
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Las rutinas recomendadas se adaptan a tus objetivos físicos personales.
                            </p>
                        </div>
                    )}
                    
                    <div>
                        {filteredRecommended.length > 0 ? (
                            <RoutineCarousel 
                                routines={filteredRecommended} 
                                highlightMatches={true} // Add ability to highlight routines that match goals
                            />
                        ) : (
                            <div className="col-span-full text-center py-6 text-gray-500">
                                No hay rutinas recomendadas para este grupo muscular
                            </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );    // Main render
    return (
        <PageTransitionWrapper>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : viewMode === 'dashboard' ? (
                // TRAINER DASHBOARD VIEW
                renderTrainerDashboard()
            ) : role === "TRAINER" && selectedStudent ? (
                // TRAINER VIEWING SPECIFIC STUDENT
                renderTrainerDetailView()
            ) : (
                // USER VIEW
                renderUserView()
            )}
            
            {/* Modal de selección de estudiante */}
            {showStudentSelector && (
                <StudentSelectionModal
                    isOpen={showStudentSelector}
                    onSelectStudent={handleStudentSelect}
                    onClose={() => setShowStudentSelector(false)}
                />
            )}
        </PageTransitionWrapper>
    );
}

export default withRoleProtection(["USER", "TRAINER"], "/gym-module")(Routines);
