import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { RoutineCard } from '@/components/gym-module/RoutineCardProps';
import Tabs from '@/components/gym-module/TabsProps';

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