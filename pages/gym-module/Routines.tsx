import { useState, useEffect } from "react";
import { Return } from "@/components/Return"
import { withRoleProtection } from "@/hoc/withRoleProtection";
import { RoutineCard } from '@/components/gym-module/RoutineCardProps';
import Tabs from '@/components/gym-module/TabsProps';

const Routines = () => {
    //const role = typeof window !== 'undefined' ? sessionStorage.getItem("role") : null;
    const role: string = "TRAINER";

     // Datos de ejemplo
      const routines = [
        { id: 1, title: 'Jumping Jacks', series: 2, repetitions: 15 },
        { id: 2, title: 'Jumping Jacks', series: 2, repetitions: 15 },
        { id: 3, title: 'Jumping Jacks', series: 2, repetitions: 15 },
        { id: 4, title: 'Jumping Jacks', series: 2, repetitions: 15 },
      ];
    
      const recommendedRoutines = [
        { id: 5, title: 'Jumping Jacks', series: 2, repetitions: 15 },
        { id: 6, title: 'Jumping Jacks', series: 2, repetitions: 15 },
        { id: 7, title: 'Jumping Jacks', series: 2, repetitions: 15 },
        { id: 8, title: 'Jumping Jacks', series: 2, repetitions: 15 },
      ];
    
      const [activeTab, setActiveTab] = useState('mis-rutinas');

    return (
        <div>
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

                <div className="md:w-2/3">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {routines.map((routine) => (
                        <RoutineCard key={routine.id} routine={routine} />
                    ))}
                    </div>

                    {/* Rutinas recomendadas */}
                    <h2 className="text-2xl font-bold mt-8 mb-4">Rutinas Recomendadas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recommendedRoutines.map((routine) => (
                        <RoutineCard key={routine.id} routine={routine} />
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default withRoleProtection(["USER", "TRAINER"], "/gym-module")(Routines);