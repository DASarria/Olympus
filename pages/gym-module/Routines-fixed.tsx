import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { 
    getCurrentRoutine, 
    getUserRoutines, 
    getRecommendedRoutines, 
    assignRoutineToUser, 
    Routine 
} from "@/api/gymServicesIndex";
import { mapZoneIdToMuscleGroup } from "@/api/gym-module/excerciseService";
import Tabs from '@/components/gym-module/TabsProps';
import RoutineCarousel from "@/components/gym-module/RoutineCarousel";
import ExerciseCarousel from "@/components/gym-module/ExerciseCarousel";
import { AnimatePresence, motion } from "framer-motion";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";
import toast from "react-hot-toast";
import { RoutineExercise } from "@/api/gym-module/routinesService";

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
 * Routines Component that renders the main content of the "Routines" page.
 * 
 * @returns {JSX.Element} The rendered Routines page component.
 */
const Routines = () => {
    const userId = typeof window !== 'undefined' ? sessionStorage.getItem("id") : null;
    //const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string = "TRAINER";
    
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

    /**
     * Effect hook to fetch routines with API calls.
     * This is executed when the component mounts and when the userId changes.
     * 
     * @returns {void}
     */
    useEffect(() => {
        if (userId) {
            const fetchAllData = async () => {
                setLoading(true);
                try {
                    // Fetch current routine
                    try {
                        const currentRoutineData = await getCurrentRoutine(userId);
                        setCurrentRoutine(currentRoutineData);
                    } catch (error) {
                        console.error('Error fetching current routine:', error);
                        // If no current routine, don't show an error to the user
                    }
                    
                    // Fetch user routines
                    try {
                        const userRoutinesData = await getUserRoutines(userId);
                        setRoutines(userRoutinesData);
                        setFilteredRoutines(userRoutinesData);
                    } catch (error) {
                        console.error('Error fetching user routines:', error);
                        toast.error("No se pudieron cargar tus rutinas");
                    }
                    
                    // Fetch recommended routines
                    try {
                        const recommendedRoutinesData = await getRecommendedRoutines(userId);
                        setRecommendedRoutines(recommendedRoutinesData);
                        setFilteredRecommended(recommendedRoutinesData);
                    } catch (error) {
                        console.error('Error fetching recommended routines:', error);
                        toast.error("No se pudieron cargar las rutinas recomendadas");
                    }
                } catch (error) {
                    console.error('Error in fetching all data:', error);
                    toast.error("Error al cargar los datos de rutinas");
                } finally {
                    setLoading(false);
                }
            };

            fetchAllData();
        } else {
            console.error('No userId found in sessionStorage');
            toast.error("No se pudo identificar al usuario. Por favor, inicie sesión nuevamente.");
            setLoading(false);
        }
    }, [userId]);

    // Filter routines based on selected muscle group
    useEffect(() => {
      if (selectedMuscleGroup !== null) {
        const muscleName = zoneToMuscle[selectedMuscleGroup].toLowerCase();
        
        // Filter routines based on their exercises' muscle groups
        setFilteredRoutines(
          routines.filter(routine => 
            routine.exercises?.some(exercise => 
              exercise.muscleGroup?.toLowerCase() === muscleName ||
              exercise.muscleGroup?.toLowerCase()?.includes(muscleName)
            ) || false
          )
        );
        
        // Similarly filter recommended routines
        setFilteredRecommended(
          recommendedRoutines.filter(routine => 
            routine.exercises?.some(exercise => 
              exercise.muscleGroup?.toLowerCase() === muscleName ||
              exercise.muscleGroup?.toLowerCase()?.includes(muscleName)
            ) || false
          )
        );
      } else {
        setFilteredRoutines(routines);
        setFilteredRecommended(recommendedRoutines);
      }
    }, [selectedMuscleGroup, routines, recommendedRoutines]);

    return (
        <PageTransitionWrapper>
            <div className="flex flex-col gap-6">
                <Return 
                    className="!self-stretch !flex-[0_0_auto] !w-full"
                    text="Rutinas"
                    returnPoint="/gym-module"
                />
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col items-center justify-center gap-5">
                        {/* Selector de anatomía */}
                        <BodyCanvasInteractive
                            modelPath="/models/male/scene.gltf"
                            onSelectZone={setSelectedMuscleGroup}
                        />
                        {selectedMuscleGroup && (
                            <div className="mt-2 text-center">
                                <span className="font-semibold">Grupo muscular seleccionado:</span> {zoneToMuscle[selectedMuscleGroup]}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col w-full">
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
                                            <p className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Bold',Helvetica]font-family text-gray-700">{currentRoutine.description}</p>
                                            {currentRoutine.exercises && (
                                                <ExerciseCarousel exercises={currentRoutine.exercises as any[]} />
                                            )}
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

                        <h2 className="text-2xl font-bold mt-8 mb-4">Rutinas Recomendadas</h2>                        <div>
                            {filteredRecommended.length > 0 ? (
                                <RoutineCarousel routines={filteredRecommended} />
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
        </PageTransitionWrapper>
    )
}


export default withRoleProtection(["USER", "TRAINER"], "/gym-module")(Routines);
