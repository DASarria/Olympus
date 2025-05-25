/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from "@/components/gym-module/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
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
    equipment: string; // Removed the question mark to make it required
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
    // For per-routine filtering by muscle group
    const [filterGroup, setFilterGroup] = useState<string>("");
    
    // Get list of unique muscle groups for filtering
    const muscleGroups = useMemo(() => {
        return [...new Set(exercises.map(e => e.muscleGroup).filter(Boolean))] as string[];
    }, [exercises]);
      // Compute the position class name dynamically based on index
    const positionClassName = useMemo(() => {
        const positionKey = `position${index}`;
        return styles[positionKey] || '';
    }, [index]);
    
    // Filter exercises by selected muscle group - make the filter more flexible
    const filtered = filterGroup
        ? exercises.filter(e => {
            const muscleGroup = e.muscleGroup?.toLowerCase() || '';
            const filter = filterGroup.toLowerCase();
            // Check if the muscle group contains the filter string or vice versa
            return muscleGroup.includes(filter) || filter.includes(muscleGroup);
        })
        : exercises;
    
    // Reset index if filtered results change
    useEffect(() => {
        setIndex(0);
    }, [filterGroup]);
    
    // Navigation
    const prev = () => {
        if (filtered.length <= 1) return; // No need to navigate with 0-1 items
        setIndex(i => i > 0 ? i - 1 : filtered.length - 1);
    };
    
    const next = () => {
        if (filtered.length <= 1) return; // No need to navigate with 0-1 items
        setIndex(i => (i + 1) % filtered.length);
    };

    const handleViewExercise = (exercise: ExerciseWithDetails) => {
        setSelectedExercise(exercise);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };    const formatYoutubeUrl = (url: string) => {
        try {
            // Handle different YouTube URL formats
            if (url.includes('youtube.com/watch?v=')) {
                // Standard youtube.com URL
                const videoId = new URL(url).searchParams.get('v');
                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}?rel=0`;
                }
            } else if (url.includes('youtu.be/')) {
                // Shortened youtu.be URL
                const videoId = url.split('youtu.be/')[1]?.split('?')[0];
                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}?rel=0`;
                }
            } else if (url.includes('youtube.com/embed/')) {
                // Already in embed format, just make sure we have rel=0
                if (!url.includes('rel=0')) {
                    return url + (url.includes('?') ? '&rel=0' : '?rel=0');
                }
                return url;
            }
        } catch (error) {
            console.error("Error formatting YouTube URL:", error);
        }
        return url; // Return original if not YouTube or already formatted
    };return (
        <div className="w-full">
            {/* Muscle group filter if there are multiple groups */}
            {muscleGroups.length > 1 && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" id="muscle-group-filter-label">
                        Filtrar por grupo muscular:
                    </label>
                    <select 
                        value={filterGroup}
                        onChange={(e) => {
                            setFilterGroup(e.target.value);
                        }}
                        className="w-full md:w-auto p-2 border border-gray-300 rounded-md"
                        aria-labelledby="muscle-group-filter-label"
                    >
                        <option value="">Todos los grupos musculares</option>
                        {muscleGroups.map((group, i) => (
                            <option key={`${group}-${i}`} value={group}>{group}</option>
                        ))}
                    </select>
                </div>
            )}

            {filtered.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-md">
                    <p className="text-gray-500">No hay ejercicios disponibles{filterGroup ? ` para el grupo muscular "${filterGroup}"` : ''}.</p>
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    <Button
                        onClick={prev}
                        className="p-2"
                        disabled={filtered.length <= 1}
                    >
                        <ChevronLeft />
                    </Button>

                    {/* Exercise Cards */}
                    <div className="flex-1 overflow-hidden relative">
                        <div className={`flex transition-transform duration-300 ${positionClassName}`}>
                            {filtered.map((exercise, i) => (                                <div
                                    key={`exercise-${exercise.baseExerciseId || i}`}
                                    className={`flex-shrink-0 w-full p-4 ${
                                        index === i ? 'block' : 'hidden'
                                    }`}
                                >
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-5">
                                            <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {exercise.name || `Ejercicio ${i + 1}`}
                                                </h3>
                                                
                                                <div className="flex flex-wrap gap-2">
                                                    {exercise.muscleGroup && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {exercise.muscleGroup}
                                                        </span>
                                                    )}
                                                    
                                                    {exercise.equipment && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            {exercise.equipment}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Description with nice styling */}
                                            {exercise.description && (
                                                <div className="mb-5 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Descripción:</h4>
                                                    <p className="text-gray-700 text-sm leading-relaxed">
                                                        {exercise.description}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {/* Exercise stats - in a card layout */}
                                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 border border-blue-100">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Detalles del ejercicio:</h4>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="rounded-lg bg-white p-3 text-center shadow-sm border border-gray-100">
                                                        <p className="text-xs text-gray-600 mb-1">Series</p>
                                                        <p className="text-lg font-bold text-blue-700">{exercise.sets || '-'}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-white p-3 text-center shadow-sm border border-gray-100">
                                                        <p className="text-xs text-gray-600 mb-1">Repeticiones</p>
                                                        <p className="text-lg font-bold text-blue-700">{exercise.repetitions || '-'}</p>
                                                    </div>
                                                    <div className="rounded-lg bg-white p-3 text-center shadow-sm border border-gray-100">
                                                        <p className="text-xs text-gray-600 mb-1">Descanso</p>
                                                        <p className="text-lg font-bold text-blue-700">{exercise.restTime ? `${exercise.restTime}s` : '-'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Media indicator */}
                                            {(exercise.imageUrl || exercise.videoUrl) && (
                                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                    {exercise.videoUrl ? 'Video disponible' : 'Imagen disponible'}
                                                </div>
                                            )}
                                            
                                            {/* Action button */}
                                            <div className="text-center mt-3">
                                                <button 
                                                    onClick={() => handleViewExercise(exercise)}
                                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                                >
                                                    {(exercise.imageUrl || exercise.videoUrl) ? (
                                                        <>Ver demostración</>
                                                    ) : (
                                                        <>Ver detalles</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={next}
                        className="p-2"
                        disabled={filtered.length <= 1}
                    >
                        <ChevronRight />
                    </Button>
                </div>
            )}        {/* Exercise Details Dialog - Only shows media content */}
            {isDialogOpen && selectedExercise && (
                <Dialog
                    title={selectedExercise.name ?? "Demostración del ejercicio"}
                    onClose={handleCloseDialog}
                >
                    <div className="flex flex-col gap-4 p-4">
                        {/* Media section - prioritize video content */}
                        <div className="flex justify-center items-center">
                            {selectedExercise.videoUrl ? (
                                <div className="w-full">
                                    <div className="mb-3 text-center font-medium text-lg">Video demostrativo</div>
                                    <div className="w-full">                                        <iframe 
                                            src={formatYoutubeUrl(selectedExercise.videoUrl)}
                                            title={`Video para ${selectedExercise.name || "ejercicio"}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen                                            className="w-full h-80 rounded-lg shadow-md"
                                            sandbox="allow-same-origin allow-scripts allow-popups"
                                        ></iframe>
                                    </div>
                                    <div className="mt-3 text-center">
                                        <a 
                                            href={selectedExercise.videoUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-600 hover:underline inline-flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            Ver video en Youtube
                                        </a>
                                    </div>
                                </div>
                            ) : selectedExercise.imageUrl ? (
                                <div className="flex flex-col items-center">
                                    <div className="mb-3 text-center font-medium text-lg">Imagen demostrativa</div>
                                    <img 
                                        src={selectedExercise.imageUrl} 
                                        alt={selectedExercise.name ?? "Imagen del ejercicio"}
                                        className="max-h-80 object-contain rounded-lg shadow-md" 
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).onerror = null;
                                            (e.target as HTMLImageElement).src = '/placeholder-exercise.png';
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="text-center p-10 bg-gray-50 rounded-lg w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-500">No hay imágenes o videos para este ejercicio.</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Add description below media */}
                        {selectedExercise.description && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-md font-semibold mb-2">Descripción:</h3>
                                <p className="text-gray-700">{selectedExercise.description}</p>
                            </div>
                        )}
                    </div>
                </Dialog>
            )}
        </div>
    );
};

export default ExerciseCarousel;
