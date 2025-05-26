import { useState } from "react";
import Button from "@/components/gym-module/Button";
import { Routine as BaseRoutine } from "@/api/gym-module/routinesService";
import { Dialog } from "@/components/Dialog";
import ExerciseCarousel from "@/components/gym-module/ExerciseCarousel";
import { toast } from "react-hot-toast";

/**
 * Extended Routine interface to include matchesUserGoal property
 */
interface Routine extends BaseRoutine {
  matchesUserGoal?: boolean;
  isCurrentRoutine?: boolean;
}

/**
 * Props interface for the RoutineCard component.
 * 
 * @interface Props
 */
interface Props {  routine: Routine;
  onAssign?: (routineId: string) => void;
  highlightMatch?: boolean;
  isCurrentRoutine?: boolean;
  onSetCurrent?: (routineId: string) => Promise<void>;
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
export const RoutineCard = ({ 
  routine, 
  onAssign, 
  highlightMatch, 
  isCurrentRoutine = false,
  onSetCurrent
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingCurrent, setIsSettingCurrent] = useState(false);

  const handleViewRoutine = () => {
    setIsDialogOpen(true);
  };

  const handleAssignRoutine = () => {
    if (onAssign && routine.id) {
      onAssign(routine.id);
    }
  };
  
  const handleSetCurrentRoutine = async () => {
    if (onSetCurrent && routine.id) {
      try {
        setIsSettingCurrent(true);
        await onSetCurrent(routine.id);
        toast.success("Rutina establecida como actual");
      } catch (error) {
        console.error("Error al establecer rutina como actual:", error);
        toast.error("No se pudo establecer como rutina actual");
      } finally {
        setIsSettingCurrent(false);
      }
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
  };  return (
    <>
      <div className={`flex-shrink-0 w-[380px] h-[210px] max-h-[210px] border-box inline-flex flex-col items-start justify-center gap-3 px-10 py-[30px] relative 
        ${isCurrentRoutine || routine.isCurrentRoutine 
          ? 'bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-400 shadow-md' 
          : highlightMatch && routine.matchesUserGoal 
            ? 'bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-400 shadow-md' 
            : 'bg-[#eaeaea]'} 
        rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-lg`}>
        {/* Current Routine Badge */}
        {(isCurrentRoutine || routine.isCurrentRoutine) && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Actual
          </div>
        )}
          {/* Recommended Badge */}
        {!(isCurrentRoutine || routine.isCurrentRoutine) && highlightMatch && routine.matchesUserGoal && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Recomendado
          </div>
        )}
        <div className="relative w-fit mt-[-1.00px] font-bold text-black text-lg tracking-[0] leading-[18px] whitespace-nowrap">
          {routine.name ?? "Rutina"}
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
              {routine.difficulty ?? "No especificada"}
            </span>
          </div>
          {routine.goal && (
            <div className="flex flex-col max-w-[120px] overflow-hidden">
              <span className="text-xs text-gray-500">Objetivo:</span>
              <span className="text-sm font-medium text-blue-600 truncate">
                {routine.goal}
              </span>
            </div>
          )}
          <Button
            onClick={handleViewRoutine}
            className="all-[unset] box-border inline-flex flex-col items-start px-5 py-2 relative flex-[0_0_auto] bg-[var(--lavender)] rounded-[20px] overflow-hidden hover:bg-purple-700 transition-colors"
          >
            <span className="text-white leading-[16px] whitespace-nowrap">Ver rutina</span>
          </Button>
        </div>
          {/* Current Routine Button - only show if not current and onSetCurrent is provided */}
        {!(isCurrentRoutine || routine.isCurrentRoutine) && onSetCurrent && (
          <div className="absolute bottom-2 left-2">
            <button
              onClick={handleSetCurrentRoutine}
              disabled={isSettingCurrent}
              className="text-xs text-green-600 hover:text-green-800 hover:underline flex items-center gap-1"
            >
              {isSettingCurrent ? (
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              Establecer como actual
            </button>
          </div>
        )}
      </div>{isDialogOpen && (
        <Dialog
          title={routine.name ?? "Detalles de la rutina"}
          onClose={() => setIsDialogOpen(false)}
        >
          <div className="flex flex-col gap-6 p-6">
            {/* Header with goal and difficulty badges */}
            <div className="flex flex-wrap gap-2 mb-2">
              {routine.goal && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Objetivo: {routine.goal}
                </span>
              )}
              {routine.difficulty && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  routine.difficulty.toLowerCase() === 'beginner' ? 'bg-green-100 text-green-800' :
                  routine.difficulty.toLowerCase() === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Dificultad: {routine.difficulty}
                </span>
              )}
            </div>
            
            {/* Description */}
            {routine.description && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-md font-semibold mb-2">Descripción</h3>
                <p className="text-gray-700">{routine.description}</p>
              </div>
            )}
            
            {/* Exercises section with clear title */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Ejercicios ({routine.exercises?.length || 0})
              </h3>
              
              {routine.exercises && routine.exercises.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                  <ExerciseCarousel exercises={routine.exercises} />
                </div>
              ) : (
                <p className="text-center py-6 bg-gray-50 rounded-lg text-gray-500">
                  Esta rutina no tiene ejercicios registrados.
                </p>
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
