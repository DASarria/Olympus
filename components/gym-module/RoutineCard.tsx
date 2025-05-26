import Button from "@/components/gym-module/Button";
import { Routine } from "@/api/gymServicesIndex";

/**
 * Props interface for the RoutineCard component.
 * 
 * @interface Props
 */
interface Props {
  routine: Routine;
}


/**
 * RoutineCard Component
 * 
 * This component displays a single routine card containing the routine's title, description, and a button
 * to view the routine. It is used in the `RoutineCarousel` component to display individual routines in a
 * carousel format. The card has a structured layout with a title, description, and a call-to-action button.
 * 
 * @component
 * @example
 * // Usage example of the RoutineCard component
 * <RoutineCard routine={{ title: 'Strength Routine', description: 'A full-body strength workout routine.' }} />
 * 
 * @param {Props} props - The props for the RoutineCard component.
 * @returns {JSX.Element} The rendered routine card with title, description, and a button.
 */
export const RoutineCard = ({ routine }: Props) => {
  return (
    <div className="flex-shrink-0 w-[380px] h-[165px] max-h-[165px] border-box border-box inline-flex flex-col items-start justify-center gap-3 px-10 py-[30px] relative bg-[#eaeaea] rounded-[20px] overflow-hidden">
      <div className="relative w-fit mt-[-1.00px] font-bold text-black text-lg tracking-[0] leading-[18px] whitespace-nowrap">
        {routine.name || "Rutina"}
      </div>
      <div className="inline-flex w-full items-start gap-3 relative flex-[0_0_auto] border-box">
        <div className="font-bold text-black text-base leading-4 whitespace-nowrap">Descripción:</div>
        <div className="font-medium text-black text-base leading-4 overflow-hidden line-clamp-[2] text-ellipsis whitespace-normal">
          {routine.description}
        </div>
      </div>
      <div className="flex w-full items-center justify-center">
        <Button className="all-[unset] box-border inline-flex flex-col items-start px-5 py-2 relative flex-[0_0_auto] bg-[var(--lavender)] rounded-[20px] overflow-hidden">
          <span className="text-white leading-[16px] whitespace-nowrap">Ver rutina</span>
        </Button>
      </div>
    </div>
  );
};
