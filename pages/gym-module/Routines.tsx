import { useState, useEffect } from "react";
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { getCurrentRoutine, getUserRoutines, getRecommendedRoutines } from "@/api/gymServicesIndex";
import Tabs from '@/components/gym-module/TabsProps';
import RoutineCarousel from "@/components/gym-module/RoutineCarousel";
import ExerciseCarousel from "@/components/gym-module/ExerciseCarousel";
import { AnimatePresence, motion } from "framer-motion";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

/**
 * Routines Component that renders the main content of the "Routines" page.
 * 
 * @returns {JSX.Element} The rendered Routines page component.
 */
const Routines = () => {
    const userId = typeof window !== 'undefined' ? sessionStorage.getItem("id") : null;
    //const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string = "TRAINER";
    const [currentRoutine, setCurrentRoutine] = useState<any>();
    const [routines, setRoutines] = useState<any[]>([]);
    const [recommendedRoutines, setRecommendedRoutines] = useState<any[]>([]);
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
            exercises: [
                {
                    baseExerciseId: 'ejercicio-uuid-aquí',
                    sets: 3,
                    repetitions: 12,
                    restTime: 60,
                    sequenceOrder: 1
                },
                {
                    baseExerciseId: 'otro-ejercicio-uuid-aquí',
                    sets: 3,
                    repetitions: 10,
                    restTime: 90,
                    sequenceOrder: 2
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
            }
        ];

        setCurrentRoutine(simulatedRoutine);
        setRoutines(simulatedRoutines);
        setRecommendedRoutines([simulatedRoutines[1]]);
        setLoading(false);
    }, [userId]);

    return (
        <PageTransitionWrapper>
            <div className="flex flex-col gap-6">
                <Return 
                    className="!self-stretch !flex-[0_0_auto] !w-full"
                    text="Rutinas"
                    returnPoint="/gym-module"
                />

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Selector de anatomía */}
                    <div className="flex flex-col items-center justify-center gap-5 relative flex-[0_0_auto]">
                        {/* Silueta humana simplificada */}
                        <svg width="200" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative w-[550px] h-[500px] bg-gray-100 object-cover">
                            <path d="M50 10 C60 10 60 20 60 25 C60 35 55 40 50 40 C45 40 40 35 40 25 C40 20 40 10 50 10 Z" stroke="black" strokeWidth="1" fill="none"/>
                            <path d="M40 40 L40 80 L35 120 L40 170 L45 170 L50 120 L55 170 L60 170 L65 120 L60 80 L60 40 Z" stroke="black" strokeWidth="1" fill="none"/>
                            <path d="M40 50 L30 80 L35 100 L40 80 Z" stroke="black" strokeWidth="1" fill="none"/>
                            <path d="M60 50 L70 80 L65 100 L60 80 Z" stroke="black" strokeWidth="1" fill="none"/>
                        </svg>
                        <div className="relative w-fit [font-family: 'Montserrat-Bold',Helvetica] font-bold text-[#7d7d7d] text-base tracking-[0] leading-4 whitespace-nowrap">
                            Selecciona un músculo...
                        </div>
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
                        </div>
                        <AnimatePresence mode="wait">
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
                        </AnimatePresence>

                        <h2 className="text-2xl font-bold mt-8 mb-4">Rutinas Recomendadas</h2>
                        <RoutineCarousel routines={recommendedRoutines} />
                    </div>
                </div>
            </div>
        </PageTransitionWrapper>
    )
}


export default withRoleProtection(["USER", "TRAINER"], "/gym-module")(Routines);