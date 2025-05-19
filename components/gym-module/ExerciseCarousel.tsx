import Button from "@/components/gym-module/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const ITEM_WIDTH = 280;
const VISIBLE_ITEMS = 3; 

/**
 * ExerciseCarousel Component
 * 
 * This component displays a carousel of exercises where users can scroll horizontally through a list
 * of exercises. Each exercise is presented in a card with details such as sets, repetitions, and rest time.
 * The carousel includes navigation buttons (left and right) to scroll through the exercises.
 *
 * @component
 * @example
 * // Usage example of ExerciseCarousel component
 * <ExerciseCarousel exercises={[{name: 'Push-up', sets: 3, repetitions: 15, restTime: 60}, {name: 'Squat', sets: 4, repetitions: 20, restTime: 90}]} />
 * 
 * @param {Props} props - The props for the ExerciseCarousel component.
 * @returns {JSX.Element} The rendered carousel displaying exercise cards.
 */
const ExerciseCarousel = ({ exercises }: { exercises: any[] }) => {
    const [index, setIndex] = useState(0);


    const prev = () => setIndex((prev) => (prev > 0 ? prev - 1 : exercises.length - 1));
    const next = () => setIndex((prev) => (prev + 1) % exercises.length);

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
                    {exercises.map((exercise, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-[380px] h-[202px] max-h-[202px] border-box inline-flex flex-col items-start justify-center gap-3 px-10 py-[30px] relative bg-[#eaeaea] rounded-[20px] overflow-hidden"
                        >
                            <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Bold',Helvetica] font-bold text-black text-lg tracking-[0] leading-[18px] whitespace-nowrap">{exercise.name || "Ejercicio"}</div>
                            <div className="inline-flex items-start gap-3 relatiove flex-[0_0_auto]">
                                <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-4 whitespace-nowrap">Series: </div>
                                <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Medium',Helvetica] font-medium text-black text-base tracking-[0] leading-4 whitespace-nowrap">{exercise.sets}</div>
                            </div>
                            <div className="inline-flex items-start gap-3 relatiove flex-[0_0_auto]">
                                <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-4 whitespace-nowrap">Repeticiones: </div>
                                <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Medium',Helvetica] font-medium text-black text-base tracking-[0] leading-4 whitespace-nowrap">{exercise.repetitions}</div>
                            </div>
                            <div className="inline-flex items-start gap-3 relatiove flex-[0_0_auto]">
                                <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Bold',Helvetica] font-bold text-black text-base tracking-[0] leading-4 whitespace-nowrap">Descanso: </div>
                                <div className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Medium',Helvetica] font-medium text-black text-base tracking-[0] leading-4 whitespace-nowrap">{exercise.restTime} seg</div>
                            </div>
                            <div className="flex w-full items-center justify-center">
                                <Button className="all-[unset] box-border inline-flex flex-col items-start px-5 py-2 relative flex-[0_0_auto] bg-[var(--lavender)] rounded-[20px] overflow-hidden">
                                    <span className="relative w-fit mt-[-1.00px] [font-family: 'Montserrat-Regular',Helvetica] text-white tracking-[0] leading-[16px] whitespace-nowrap">Ver ejercicio</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Button onClick={next} className="p-2">
                <ChevronRight />
            </Button>
        </div>
    );
};

export default ExerciseCarousel;
