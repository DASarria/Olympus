import Button from "@/components/gym-module/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { RoutineExercise } from "@/api/gym-module/routinesService";
import { Dialog } from "@/components/Dialog";
import styles from './exerciseCarousel.module.css';

interface ExerciseWithDetails extends RoutineExercise {
    name?: string;
    description?: string;
    muscleGroup?: string;
    difficulty?: string;
    imageUrl?: string;
    videoUrl?: string;
    equipment?: string;
}

/**
 * ExerciseCarousel Component
 * 
 * Displays a carousel of exercises where users can scroll horizontally through a list
 * of exercises.
 */
const ExerciseCarousel = ({ exercises }: { exercises: RoutineExercise[] }) => {
    const [index, setIndex] = useState(0);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseWithDetails | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // Compute the position class name dynamically
    const positionClassName = useMemo(() => {
        const positionKey = `position${index}`;
        return styles[positionKey] || '';
    }, [index]);
    
    const prev = () => setIndex((prev) => (prev > 0 ? prev - 1 : exercises.length - 1));
    const next = () => setIndex((prev) => (prev + 1) % exercises.length);

    const handleViewExercise = (exercise: ExerciseWithDetails) => {
        setSelectedExercise(exercise);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedExercise(null);
    };
    
    return (
        <>
            <div className={styles.carouselContainer}>
                <Button onClick={prev} className="p-2">
                    <ChevronLeft />
                </Button>
                <div className={styles.carouselItemsContainer}>
                    <div className={`${styles.carouselItems} ${positionClassName}`}>
                        {exercises.length > 0 ? (
                            exercises.map((exercise, i) => (
                                <div
                                    key={`exercise-${exercise.id ?? exercise.baseExerciseId ?? i}`}
                                    className="flex-shrink-0 w-[380px] h-[202px] max-h-[202px] border-box inline-flex flex-col items-start justify-center gap-3 px-10 py-8 relative bg-[#eaeaea] rounded-[20px] overflow-hidden"
                                >
                                    <div className="relative w-fit font-bold text-black text-lg leading-5 whitespace-nowrap">
                                        {exercise.name ?? "Ejercicio"}
                                    </div>
                                    <div className="inline-flex items-start gap-3 relative flex-[0_0_auto]">
                                        <div className="relative w-fit font-bold text-black text-base leading-4 whitespace-nowrap">
                                            Series:
                                        </div>
                                        <div className="relative w-fit font-medium text-black text-base leading-4 whitespace-nowrap">
                                            {exercise.sets}
                                        </div>
                                    </div>
                                    <div className="inline-flex items-start gap-3 relative flex-[0_0_auto]">
                                        <div className="relative w-fit font-bold text-black text-base leading-4 whitespace-nowrap">
                                            Repeticiones:
                                        </div>
                                        <div className="relative w-fit font-medium text-black text-base leading-4 whitespace-nowrap">
                                            {exercise.repetitions}
                                        </div>
                                    </div>
                                    <div className="inline-flex items-start gap-3 relative flex-[0_0_auto]">
                                        <div className="relative w-fit font-bold text-black text-base leading-4 whitespace-nowrap">
                                            Descanso:
                                        </div>
                                        <div className="relative w-fit font-medium text-black text-base leading-4 whitespace-nowrap">
                                            {exercise.restTime ?? 0} seg
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-center">
                                        <Button 
                                            onClick={() => handleViewExercise(exercise)}
                                            className="box-border inline-flex flex-col items-start px-5 py-2 bg-[var(--lavender)] rounded-[20px] overflow-hidden"
                                        >
                                            <span className="relative w-fit text-white leading-4 whitespace-nowrap">
                                                Ver ejercicio
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex-shrink-0 w-[380px] h-[202px] max-h-[202px] border-box inline-flex flex-col items-center justify-center px-10 py-8 relative bg-[#eaeaea] rounded-[20px] overflow-hidden">
                                <p className="text-gray-500">No hay ejercicios disponibles</p>
                            </div>
                        )}
                    </div>
                </div>
                <Button onClick={next} className="p-2">
                    <ChevronRight />
                </Button>
            </div>
            
            {isDialogOpen && selectedExercise && (
                <Dialog
                    title={selectedExercise.name ?? "Detalles del ejercicio"}
                    onClose={handleCloseDialog}
                >
                    <div className="flex flex-col gap-4 p-4">
                        {selectedExercise.description && (
                            <div className="mb-4">
                                <h3 className="text-lg font-bold mb-1">Descripción:</h3>
                                <p>{selectedExercise.description}</p>
                            </div>
                        )}
                          {/* Media section first (image or video) */}
                        {selectedExercise.videoUrl ? (
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">Video demostrativo:</h3>
                                <div className="w-full">
                                    <iframe 
                                        src={selectedExercise.videoUrl.includes('youtube.com') ? selectedExercise.videoUrl.replace('watch?v=', 'embed/') : selectedExercise.videoUrl} 
                                        title="Video player" 
                                        allowFullScreen
                                        className="w-full h-72 rounded-lg shadow-md"
                                    ></iframe>
                                </div>
                            </div>
                        ) : selectedExercise.imageUrl ? (
                            <div className="mb-6 flex justify-center">
                                <div className="flex flex-col items-center">
                                    <h3 className="text-xl font-bold mb-2">Imagen demostrativa:</h3>
                                    <img 
                                        src={selectedExercise.imageUrl} 
                                        alt={selectedExercise.name ?? "Imagen del ejercicio"} 
                                        className="max-h-60 object-contain rounded-lg shadow-md" 
                                    />
                                </div>
                            </div>
                        ) : null}
                        
                        {/* Details section */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-bold mb-2">Detalles técnicos:</h3>
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                <div>
                                    <p><span className="font-semibold">Series:</span> {selectedExercise.sets}</p>
                                    <p><span className="font-semibold">Repeticiones:</span> {selectedExercise.repetitions}</p>
                                    <p><span className="font-semibold">Descanso:</span> {selectedExercise.restTime ?? 0} segundos</p>
                                </div>
                                <div>
                                    {selectedExercise.muscleGroup && (
                                        <p><span className="font-semibold">Grupo muscular:</span> {selectedExercise.muscleGroup}</p>
                                    )}
                                    {selectedExercise.equipment && (
                                        <p><span className="font-semibold">Equipamiento:</span> {selectedExercise.equipment}</p>
                                    )}
                                    {selectedExercise.difficulty && (
                                        <p><span className="font-semibold">Dificultad:</span> {selectedExercise.difficulty}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}
        </>
    );
};

export default ExerciseCarousel;
