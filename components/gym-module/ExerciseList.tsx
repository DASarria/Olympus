import React from 'react';

interface Exercise {
  name: string;
  sets: number;
  reps?: number;
  repetitions?: number; // Support both naming conventions
  videoUrl?: string;
  imageUrl?: string;
  restTime?: number; // Added rest time between sets
}

function YouTubeEmbed({ url }: { url: string }) {
  // Extract the YouTube video ID from URL
  const getYouTubeId = (youtubeUrl: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(url);
  
  if (!videoId) {
    return <div className="text-red-500">Error: URL de YouTube inválida</div>;
  }

  return (
    <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden my-4">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
}

function ExerciseList({ exercises }: { exercises: Exercise[] }) {
  if (!exercises || exercises.length === 0) {
    return <div className="text-center py-8">No hay ejercicios disponibles para esta zona</div>;
  }

  return (
    <div className="space-y-6">
      {exercises.map((exercise, index) => {
        // Support both reps and repetitions property names
        const repetitions = exercise.reps || exercise.repetitions || 0;
        
        return (
          <div key={index} className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-xl font-bold mb-2">{exercise.name}</h3>
            
            <div className="flex flex-wrap gap-4 mb-3">
              <div className="bg-blue-100 text-blue-800 rounded-full px-3 py-1">
                {exercise.sets} series
              </div>
              <div className="bg-green-100 text-green-800 rounded-full px-3 py-1">
                {repetitions} repeticiones
              </div>
              
              {/* Display rest time if available */}
              {exercise.restTime && (
                <div className="bg-purple-100 text-purple-800 rounded-full px-3 py-1">
                  Descanso: {exercise.restTime}s
                </div>
              )}
            </div>
            
            {/* YouTube video if it exists */}
            {exercise.videoUrl && (
              <YouTubeEmbed url={exercise.videoUrl} />
            )}
            
            {/* Image if it exists and there's no video */}
            {exercise.imageUrl && !exercise.videoUrl && (
              <div className="mt-4">
                <img 
                  src={exercise.imageUrl} 
                  alt={`Imagen de ${exercise.name}`}
                  className="rounded-lg max-h-64 w-auto mx-auto"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ExerciseList;
