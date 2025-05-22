import { useState } from "react";
import Button from "@/components/gym-module/Button";
import { Routine } from "@/api/gym-module/routinesService";
import { Dialog } from "@/components/Dialog";
import ExerciseCarousel from "@/components/gym-module/ExerciseCarousel";

/**
 * Props interface for the RoutineCard component.
 * 
 * @interface Props
 */
interface Props {
  routine: Routine;
  onAssign?: (routineId: string) => void;
}

/**
 * RoutineCard Component
 * 
 * This component displays a single routine card containing the routine's name, description, and a button
 * to view the routine. It is used in the `RoutineCarousel` component to display individual routines in a
 * carousel format. The card has a structured layout with a name, description, and a call-to-action button.
 * Clicking the button opens a dialog with detailed information about the routine and its exercises.
 * 
 * @component
 * @example
 * // Usage example of the RoutineCard component
 * <RoutineCard routine={{ name: 'Strength Routine', description: 'A full-body strength workout routine.' }} />
 * 
 * @param {Props} props - The props for the RoutineCard component.
 * @returns {JSX.Element} The rendered routine card with name, description, and a button.
 */
export const RoutineCard = ({ routine, onAssign }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewRoutine = () => {
    setIsDialogOpen(true);
  };

  const handleAssignRoutine = () => {
    if (onAssign && routine.id) {
      onAssign(routine.id);
    }
  };

  const getDifficultyColor = (difficulty: string | undefined) => {
    switch(difficulty?.toLowerCase()) {
      case 'beginner':
        return 'text-green-500';
      case 'intermediate':
        return 'text-yellow-500';
      case 'advanced':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <>
      <div className="flex-shrink-0 w-[380px] h-[185px] max-h-[185px] border-box inline-flex flex-col items-start justify-center gap-3 px-10 py-[30px] relative bg-[#eaeaea] rounded-[20px] overflow-hidden">
        <div className="relative w-fit mt-[-1.00px] font-bold text-black text-lg tracking-[0] leading-[18px] whitespace-nowrap">
          {routine.name || "Rutina"}
        </div>
        <div className="inline-flex w-full items-start gap-3 relative flex-[0_0_auto] border-box">
          <div className="font-bold text-black text-base leading-4 whitespace-nowrap">Descripción:</div>
          <div className="font-medium text-black text-base leading-4 overflow-hidden line-clamp-[2] text-ellipsis whitespace-normal">
            {routine.description}
          </div>
        </div>
        <div className="flex flex-row gap-3 w-full items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Dificultad:</span>
            <span className={`text-sm font-semibold ${getDifficultyColor(routine.difficulty)}`}>
              {routine.difficulty || "No especificada"}
            </span>
          </div>
          <Button
            onClick={handleViewRoutine}
            className="all-[unset] box-border inline-flex flex-col items-start px-5 py-2 relative flex-[0_0_auto] bg-[var(--lavender)] rounded-[20px] overflow-hidden"
          >
            <span className="text-white leading-[16px] whitespace-nowrap">Ver rutina</span>
          </Button>
        </div>
      </div>

      {isDialogOpen && (
        <Dialog
          title={routine.name || "Detalles de la rutina"}
          onClose={() => setIsDialogOpen(false)}
        >
          <div className="flex flex-col gap-6 p-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Detalles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Objetivo:</span> {routine.goal || "No especificado"}
                </div>
                <div>
                  <span className="font-semibold">Dificultad:</span> <span className={getDifficultyColor(routine.difficulty)}>{routine.difficulty || "No especificada"}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">Descripción:</span> {routine.description}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Ejercicios</h3>
              {routine.exercises && routine.exercises.length > 0 ? (
                <ExerciseCarousel exercises={routine.exercises} />
              ) : (
                <p className="text-gray-500">Esta rutina no tiene ejercicios registrados.</p>
              )}
            </div>

            {onAssign && (
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={handleAssignRoutine}
                  className="all-[unset] box-border inline-flex flex-col items-start px-5 py-2 relative flex-[0_0_auto] bg-green-500 rounded-[20px] overflow-hidden"
                >
                  <span className="text-white leading-[16px] whitespace-nowrap">Asignar esta rutina</span>
                </Button>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </>
  );
};
