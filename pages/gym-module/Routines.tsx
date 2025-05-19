import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { RoutineCard } from '@/components/gym-module/RoutineCardProps';
import Tabs from '@/components/gym-module/TabsProps';
import { getCurrentRoutine, getUserRoutines, getRecommendedRoutines } from "@/api/gymServicesIndex";
import RoutineCarousel from "@/components/gym-module/RoutineCarousel";
import ExerciseCarousel from "@/components/gym-module/ExerciseCarousel";
import { AnimatePresence, motion } from "framer-motion";
import { PageTransitionWrapper } from "@/components/PageTransitionWrapper";

// /**
//  * routines component that renders the main content of the "routines" page.
//  * 
//  * @returns {jsx.element} the rendered routines page component.
//  */
// const routines = () => {
//     const userid = typeof window !== 'undefined' ? sessionstorage.getitem("id") : null;
//     //const role = typeof window !== 'undefined' ? sessionstorage.getitem("role") : null;
//     const role: string = "trainer";
//     const [currentroutine, setcurrentroutine] = usestate<any>();
//     const [routines, setroutines] = usestate<any[]>([]);
//     const [recommendedroutines, setrecommendedroutines] = usestate<any[]>([]);
//     const [loading, setloading] = usestate<boolean>(true);
//     const [activetab, setactivetab] = usestate('rutina-actual');

//     /**
//      * effect hook to fetch routines with api calls.
//      * this is executed when the component mounts and when the userid changes.
//      * 
//      * @returns {void}
//      */
//     useeffect(() => {
//         // if (userid) {
//         //     const fetchalldata = async () => {
//         //         try {
//         //             await promise.all([
//         //                 getcurrentroutine(userid)
//         //                     .then(setcurrentroutine)
//         //                     .catch((error) => {
//         //                         console.error('error fetching current routine:', error);
//         //                     }),
//         //                 getuserroutines(userid)
//         //                     .then(setroutines)
//         //                     .catch((error) => {
//         //                         console.error('error fetching user routines:', error);
//         //                     }),
//         //                 getrecommendedroutines(userid)
//         //                     .then(setrecommendedroutines)
//         //                     .catch((error) => {
//         //                         console.error('error fetching recommended routines:', error);
//         //                     }),
//         //             ]);
//         //         } catch (error) {
//         //             console.error('error in fetching all data:', error);
//         //         } finally {
//         //             setloading(false);
//         //         }
//         //     };

//         //     fetchalldata();
//         // } else {
//         //     console.error('no userid found in sessionstorage');
//         // }

//         const simulatedroutine = {
//             id: 'routine1',
//             name: 'rutina de fuerza para principiantes',
//             description: 'una rutina básica enfocada en desarrollar fuerza en los principales grupos musculares',
//             difficulty: 'beginner',
//             goal: 'strength',
//             exercises: [
//                 {
//                     baseexerciseid: 'ejercicio-uuid-aquí',
//                     sets: 3,
//                     repetitions: 12,
//                     resttime: 60,
//                     sequenceorder: 1
//                 },
//                 {
//                     baseexerciseid: 'otro-ejercicio-uuid-aquí',
//                     sets: 3,
//                     repetitions: 10,
//                     resttime: 90,
//                     sequenceorder: 2
//                 }
//             ]
//         };

//         const simulatedroutines = [
//             simulatedroutine,
//             {
//                 ...simulatedroutine,
//                 id: 'routine2',
//                 name: 'rutina intermedia de resistencia',
//                 difficulty: 'intermediate',
//                 goal: 'endurance',
//             }
//         ];

//         setcurrentroutine(simulatedroutine);
//         setroutines(simulatedroutines);
//         setrecommendedroutines([simulatedroutines[1]]);
//         setloading(false);
//     }, [userid]);

//     return (
//         <pagetransitionwrapper>
//             <div classname="flex flex-col gap-6">
//                 <return 
//                     classname="!self-stretch !flex-[0_0_auto] !w-full"
//                     text="rutinas"
//                     returnpoint="/gym-module"
//                 />

//                 <div classname="flex flex-col md:flex-row gap-6">
//                     {/* selector de anatomía */}
//                     <div classname="flex flex-col items-center justify-center gap-5 relative flex-[0_0_auto]">
//                         {/* silueta humana simplificada */}
//                         <svg width="200" viewbox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" classname="relative w-[550px] h-[500px] bg-gray-100 object-cover">
//                             <path d="m50 10 c60 10 60 20 60 25 c60 35 55 40 50 40 c45 40 40 35 40 25 c40 20 40 10 50 10 z" stroke="black" strokewidth="1" fill="none"/>
//                             <path d="m40 40 l40 80 l35 120 l40 170 l45 170 l50 120 l55 170 l60 170 l65 120 l60 80 l60 40 z" stroke="black" strokewidth="1" fill="none"/>
//                             <path d="m40 50 l30 80 l35 100 l40 80 z" stroke="black" strokewidth="1" fill="none"/>
//                             <path d="m60 50 l70 80 l65 100 l60 80 z" stroke="black" strokewidth="1" fill="none"/>
//                         </svg>
//                         <div classname="relative w-fit [font-family: 'montserrat-bold',helvetica] font-bold text-[#7d7d7d] text-base tracking-[0] leading-4 whitespace-nowrap">
//                             selecciona un músculo...
//                         </div>
//                     </div>

//                     <div classname="flex flex-col w-full">
//                         {/* pestañas */}
//                         <div classname="mb-6">
//                             <tabs
//                                 tabs={[
//                                 { id: 'rutina-actual', label: 'rutina actual' },
//                                 { id: 'todas-rutinas', label: 'todas las rutinas' }
//                                 ]}
//                                 activetab={activetab}
//                                 ontabchange={setactivetab}
//                             />
//                         </div>
//                         <animatepresence mode="wait">
//                             {activetab === 'rutina-actual' && currentroutine && (
//                                 <motion.div
//                                     key="rutina-actual"
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     transition={{ duration: 0.3 }}
//                                     classname="flex flex-col gap-4"
//                                 >
//                                     <h2 classname="text-2xl font-bold">{currentroutine.name}</h2>
//                                     <p classname="relative w-fit mt-[-1.00px] [font-family: 'montserrat-bold',helvetica]font-family text-gray-700">{currentroutine.description}</p>
//                                     <exercisecarousel exercises={currentroutine.exercises} />
//                                 </motion.div>
//                             )}
//                             {activetab === 'todas-rutinas' && (
//                                     <motion.div
//                                     key="todas-rutinas"
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     transition={{ duration: 0.3 }}
//                                     classname="flex flex-col gap-4"
//                                 >
//                                     <h2 classname="text-2xl font-bold mb-4">tus rutinas</h2>
//                                     <routinecarousel routines={routines} />
//                                 </motion.div>
//                             )}
//                         </animatepresence>

//                         <h2 classname="text-2xl font-bold mt-8 mb-4">rutinas recomendadas</h2>
//                         <routinecarousel routines={recommendedroutines} />
//                     </div>
//                 </div>
//             </div>
//         </pagetransitionwrapper>
//     )
// }

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

const Routines = () => {
    // Get user role from session storage in real implementation
    const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") ?? "USER" : "USER";

    // Sample routines data - would be fetched from API in real implementation
    const routines = [
      { id: 1, title: 'Rutina de fuerza', description: 'Enfocada en desarrollo muscular', muscleGroup: 'pecho' },
      { id: 2, title: 'Cardio y resistencia', description: 'Mejora tu resistencia', muscleGroup: 'piernas' },
      { id: 3, title: 'Definición', description: 'Para definir grupos musculares', muscleGroup: 'espalda' },
      { id: 4, title: 'Full body', description: 'Entrenamiento completo', muscleGroup: 'completo' },
    ];
  
    const recommendedRoutines = [
      { id: 5, title: 'Hipertrofia', description: 'Aumenta tamaño muscular', muscleGroup: 'pecho' },
      { id: 6, title: 'Funcional', description: 'Mejora movilidad y fuerza', muscleGroup: 'core' },
      { id: 7, title: 'Recuperación', description: 'Baja intensidad', muscleGroup: 'piernas' },
      { id: 8, title: 'Express', description: 'Entrenamiento rápido', muscleGroup: 'brazos' },
    ];
  
    const [activeTab, setActiveTab] = useState('mis-rutinas');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<number | null>(null);
    const [filteredRoutines, setFilteredRoutines] = useState(routines);
    const [filteredRecommended, setFilteredRecommended] = useState(recommendedRoutines);    // Filter routines when muscle group selection changes
    useEffect(() => {
      if (selectedMuscleGroup !== null) {
        const muscle = zoneToMuscle[selectedMuscleGroup].toLowerCase();
        
        setFilteredRoutines(
          routines.filter(routine => 
            routine.muscleGroup.toLowerCase().includes(muscle) || 
            routine.muscleGroup === 'completo'
          )
        );
        
        setFilteredRecommended(
          recommendedRoutines.filter(routine => 
            routine.muscleGroup.toLowerCase().includes(muscle) || 
            routine.muscleGroup === 'completo'
          )
        );
      } else {
        setFilteredRoutines(routines);
        setFilteredRecommended(recommendedRoutines);
      }
    }, [selectedMuscleGroup, routines, recommendedRoutines]);

    return (
        <div>
            <Return 
                className="!self-stretch !flex-[0_0_auto] !w-full"
                text="Rutinas"
                returnPoint="/gym-module"
            />

            <div className="flex flex-col md:flex-row gap-6">
                {/* Selector de anatomía con modelo 3D */}                <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col items-center justify-center gap-5">
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

                <div className="w-full md:w-1/2 lg:w-7/12">
                    {/* Pestañas */}
                    <div className="mb-6">
                    <Tabs
                        tabs={[
                        { id: 'mis-rutinas', label: 'Mis rutinas' },
                        { id: 'todas-rutinas', label: 'Todas las rutinas' }
                        ]}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                    </div>

                    {/* Lista de rutinas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRoutines.length > 0 ? (
                        filteredRoutines.map((routine) => (
                            <RoutineCard key={routine.id} routine={routine} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-6 text-gray-500">
                            No hay rutinas disponibles para este grupo muscular
                        </div>
                    )}
                    </div>

                    {/* Rutinas recomendadas */}
                    <h2 className="text-2xl font-bold mt-8 mb-4">Rutinas Recomendadas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecommended.length > 0 ? (
                        filteredRecommended.map((routine) => (
                            <RoutineCard key={routine.id} routine={routine} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-6 text-gray-500">
                            No hay rutinas recomendadas para este grupo muscular
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default withRoleProtection(["USER", "TRAINER"], "/gym-module")(Routines);