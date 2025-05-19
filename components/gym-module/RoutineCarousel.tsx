import Button from "@/components/gym-module/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { RoutineCard } from "./RoutineCard";

const ITEM_WIDTH = 280;
const VISIBLE_ITEMS = 3;

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
 * <RoutineCarousel routines={routineData} />
 * 
 * @param {Object} props - The props for the RoutineCarousel component.
 * @param {Array} props.routines - The array of routines to be displayed in the carousel.
 * @returns {JSX.Element} A carousel that displays the routine cards with navigation buttons.
 */
const RoutineCarousel = ({ routines }: { routines: any[] }) => {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((prev) => (prev > 0 ? prev - 1 : routines.length - 1));
  const next = () => setIndex((prev) => (prev + 1) % routines.length);

  return (
    <div className="flex items-center justify-between">
      <Button onClick={prev} className="p-2">
        <ChevronLeft />
      </Button>
      <div className="overflow-hidden mx-4 flex-1">
        <div
          className="inline-flex items-start gap-10 relative transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${index * ITEM_WIDTH}px)` }}
        >
          {routines.map((routine, i) => (
            <RoutineCard key={routine.id || i} routine={routine} />
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
