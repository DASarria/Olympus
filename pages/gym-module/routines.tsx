import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { Routine } from "@/api/gymServicesIndex";
// import { getCurrentRoutine, getUserRoutines, getRecommendedRoutines } from "@/api/gymServicesIndex";
import Tabs from '@/components/gym-module/TabsProps';
import RoutineCarousel from "@/components/gym-module/RoutineCarousel";
import ExerciseCarousel from "@/components/gym-module/ExerciseCarousel";
import { AnimatePresence, motion } from "framer-motion";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

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
    const [currentRoutine, setCurrentRoutine] = useState<Routine>();
    const [routines, setRoutines] = useState<Routine[]>([]);
    //const [recommendedRoutines, setRecommendedRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState('rutina-actual');

    /**
     * Effect hook to fetch routines with API calls.
     * This is executed when the component mounts and when the userId changes.
     * 
     * @returns {void}
     */
    useEffect(() => {
        // if (userId) {
        //     const fetchAllData = async () => {
        //         try {
        //             await Promise.all([
        //                 getCurrentRoutine(userId)
        //                     .then(setCurrentRoutine)
        //                     .catch((error) => {
        //                         console.error('Error fetching current routine:', error);
        //                     }),
        //                 getUserRoutines(userId)
        //                     .then(setRoutines)
        //                     .catch((error) => {
        //                         console.error('Error fetching user routines:', error);
        //                     }),
        //                 getRecommendedRoutines(userId)
        //                     .then(setRecommendedRoutines)
        //                     .catch((error) => {
        //                         console.error('Error fetching recommended routines:', error);
        //                     }),
        //             ]);
        //         } catch (error) {
        //             console.error('Error in fetching all data:', error);
        //         } finally {
        //             setLoading(false);
        //         }
        //     };

        //     fetchAllData();
        // } else {
        //     console.error('No userId found in sessionStorage');
        // }

        const simulatedRoutine = {
            id: 'routine1',
            name: 'Rutina de fuerza para principiantes',
            description: 'Una rutina básica enfocada en desarrollar fuerza en los principales grupos musculares',
            difficulty: 'BEGINNER',
            goal: 'STRENGTH',
            trainerId: 'trainer-uuid-aquí',
            creationDate: new Date().toISOString(),
            exercises: [
                {
                    baseExerciseId: 'ejercicio-uuid-aquí',
                    sets: 3,
                    repetitions: 12,
                    restTime: 60,
                    sequenceOrder: 1,
                    muscleGroup: zoneToMuscle[1]
                },
                {
                    baseExerciseId: 'otro-ejercicio-uuid-aquí',
                    sets: 3,
                    repetitions: 10,
                    restTime: 90,
                    sequenceOrder: 2,
                    muscleGroup: zoneToMuscle[8]
                }
            ]
        };

        const simulatedRoutines = [
            simulatedRoutine,
            {
                ...simulatedRoutine,
                id: 'routine2',
                name: 'Rutina intermedia de resistencia',
                difficulty: 'INTERMEDIATE',
                goal: 'ENDURANCE',
                trainerId: 'trainer-uuid-aquí',
                creationDate: new Date().toISOString(),
                exercises: [
                    {
                        baseExerciseId: 'ejercicio-uuid-aquí',
                        sets: 4,
                        repetitions: 15,
                        restTime: 60,
                        sequenceOrder: 1,
                        muscleGroup: zoneToMuscle[2]
                    },
                    {
                        baseExerciseId: 'otro-ejercicio-uuid-aquí',
                        sets: 4,
                        repetitions: 12,
                        restTime: 90,
                        sequenceOrder: 2,
                        muscleGroup: zoneToMuscle[5]
                    }
                ]
            }
        ];

        setCurrentRoutine(simulatedRoutine);
        setRoutines(simulatedRoutines);
        //setRecommendedRoutines([simulatedRoutines[1]]);
        setLoading(false);
    }, [userId]);

    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<number | null>(null);
    //const [filteredRoutines, setFilteredRoutines] = useState(routines);
    //const [filteredRecommended, setFilteredRecommended] = useState(recommendedRoutines);
    // useEffect(() => {
    //   if (selectedMuscleGroup !== null) {
    //     const muscle = zoneToMuscle[selectedMuscleGroup].toLowerCase();
        
    //     setFilteredRoutines(
    //       routines.filter(routine => 
    //         routine.muscleGroup.toLowerCase().includes(muscle) || 
    //         routine.muscleGroup === 'completo'
    //       )
    //     );
        
    //     setFilteredRecommended(
    //       recommendedRoutines.filter(routine => 
    //         routine.muscleGroup.toLowerCase().includes(muscle) || 
    //         routine.muscleGroup === 'completo'
    //       )
    //     );
    //   } else {
    //     setFilteredRoutines(routines);
    //     setFilteredRecommended(recommendedRoutines);
    //   }
    // }, [selectedMuscleGroup, routines, recommendedRoutines]);

    return (
        <PageTransitionWrapper>
            <div className="flex flex-col gap-6">
                <Return 
                    className="!self-stretch !flex-[0_0_auto] !w-full"
                    text="Rutinas"
                    returnPoint="/gym-module"
                />
                {loading ? (
                    <div className="flex w-full justify-center items-center h-screen">
                        <div className="w-16 h-16 border-4 border-t-4 border-gray-500 border-solid rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
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
                                <div className="flex mb-6 justify-center">
                                    <Tabs
                                        tabs={[
                                        { id: 'rutina-actual', label: 'Rutina actual' },
                                        { id: 'todas-rutinas', label: 'Todas las rutinas' }
                                        ]}
                                        activeTab={activeTab}
                                        onTabChange={setActiveTab}
                                    />
                                </div>
                                <AnimatePresence mode="wait">
                                    {/* {filteredRecommended.length > 0 ? (
                                        <> */}
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
                                                    <p className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Bold',Helvetica] font-family text-gray-700">{currentRoutine.description}</p>
                                                    <ExerciseCarousel exercises={currentRoutine.exercises} />
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
                                                    <RoutineCarousel routines={routines} />
                                                </motion.div>
                                            )}
                                        {/* </>
                                    ) : (
                                        <div className="col-span-full text-center py-6 text-gray-500">
                                            No hay rutinas disponibles para este grupo muscular
                                        </div>
                                    )} */}
                                </AnimatePresence>

                                <h2 className="text-2xl font-bold mt-8 mb-4">Rutinas Recomendadas</h2>
                                <div>
                                    {/* {filteredRecommended.length > 0 ? (
                                        filteredRecommended.map((routine) => (
                                            <RoutineCarousel routines={recommendedRoutines} />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-6 text-gray-500">
                                            No hay rutinas recomendadas para este grupo muscular
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </PageTransitionWrapper>
    )
}


export default withRoleProtection(["STUDENT", "TRAINER"], "/gym-module")(Routines);