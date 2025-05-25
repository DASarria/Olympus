import Button from "@/components/gym-module/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { RoutineCard } from "./RoutineCard";
import { assignRoutineToUser, Routine } from "@/api/gymServicesIndex";
import { toast } from "react-hot-toast";
import styles from './routineCarousel.module.css';

/**
 * RoutineCarousel Component
 * 
 * This component renders a horizontal carousel of routine cards. It allows users to navigate through the 
 * list of routines using previous and next buttons. The carousel automatically wraps around when reaching the 
 * end or beginning of the list. The transition between items is animated with a sliding effect.
 * 
 * @component
 * @example
 * // Usage example of the RoutineCarousel component
 * <RoutineCarousel routines={routines} />
 * 
 * // Highlight routines that match user goals
 * <RoutineCarousel routines={routines} highlightMatches={true} />
 */
interface RoutineCarouselProps {
  routines: Routine[];
  highlightMatches?: boolean;
  currentRoutineId?: string;
  onSetCurrent?: (routineId: string) => Promise<void>;
}

const RoutineCarousel = ({ routines, highlightMatches = false, currentRoutineId, onSetCurrent }: RoutineCarouselProps) => {
  const [index, setIndex] = useState(0);
  // Compute the position class name dynamically
  const positionClassName = useMemo(() => {
    const positionKey = `position${index}`;
    return styles[positionKey] ?? '';
  }, [index]);

  const prev = () => setIndex((prevState) => (prevState > 0 ? prevState - 1 : routines.length - 1));
  const next = () => setIndex((prevState) => (prevState + 1) % routines.length);
  const handleAssignRoutine = async (routineId: string) => {
    try {
      // Get user ID from sessionStorage
      const userId = typeof window !== 'undefined' ? sessionStorage.getItem("id") : null;
      if (!userId) {
        toast.error("No se pudo identificar al usuario");
        return;
      }
      
      await assignRoutineToUser(userId, routineId);
      toast.success("Rutina asignada correctamente");
    } catch (error) {
      console.error("Error al asignar la rutina:", error);
      toast.error("Error al asignar la rutina");
    }
  };
  return (
    <div className={styles.carouselContainer}>
      <Button onClick={prev} className="p-2">
        <ChevronLeft />
      </Button>
      <div className={styles.carouselItemsContainer}>
        <div
          className={`${styles.carouselItems} ${positionClassName}`}
        >          {routines.map((routine, i) => (
            <RoutineCard 
              key={routine.id ?? i} 
              routine={routine} 
              onAssign={handleAssignRoutine}
              highlightMatch={highlightMatches}
              isCurrentRoutine={routine.id === currentRoutineId}
              onSetCurrent={onSetCurrent}
            />
          ))}
        </div>
      </div>
      <Button onClick={next} className="p-2">
        <ChevronRight />
      </Button>
    </div>
  );
};

export default RoutineCarousel;
