// api/gym-module/exerciseMockData.tsx
import { BaseExerciseDTO } from './excerciseService';

type ExerciseWithDetails = BaseExerciseDTO & {
  sets: number;
  repetitions: number;
  restTime: number;
};

// Mock data organized by muscle groups
const mockExercises: Record<string, ExerciseWithDetails[]> = {
  chest: [
    { 
      id: "chest-1", 
      name: "Press de Banca", 
      description: "Ejercicio compuesto para el pecho",
      muscleGroup: "chest", 
      equipment: "Barra y banco", 
      videoUrl: "https://www.youtube.com/watch?v=SCVCLChPQFY", 
      sets: 4, 
      repetitions: 12,
      restTime: 90
    },
    { 
      id: "chest-2", 
      name: "Aperturas con Mancuernas", 
      description: "Ejercicio de aislamiento para el pecho",
      muscleGroup: "chest", 
      equipment: "Mancuernas", 
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrabpVzpblaU1F6moowgaOi-fRtRtHqJX7cw&s", 
      sets: 3, 
      repetitions: 15,
      restTime: 60
    },
    { 
      id: "chest-3", 
      name: "Fondos en Paralelas", 
      description: "Ejercicio compuesto para pecho inferior y tríceps",
      muscleGroup: "chest", 
      equipment: "Barras paralelas", 
      sets: 3, 
      repetitions: 10,
      restTime: 90
    }
  ],
  back: [
    { 
      id: "back-1", 
      name: "Dominadas", 
      description: "Ejercicio compuesto para espalda y bíceps",
      muscleGroup: "back", 
      equipment: "Barra de dominadas", 
      videoUrl: "https://www.youtube.com/watch?v=vnpFhruEmsc", 
      sets: 4, 
      repetitions: 8,
      restTime: 120
    },
    { 
      id: "back-2", 
      name: "Remo con Barra", 
      description: "Ejercicio compuesto para espalda media",
      muscleGroup: "back", 
      equipment: "Barra", 
      imageUrl: "https://i.pinimg.com/736x/25/9d/02/259d026a07562252c65bcd0d74199704.jpg", 
      sets: 3, 
      repetitions: 12,
      restTime: 90
    },
    { 
      id: "back-3", 
      name: "Pulldown en Polea", 
      description: "Ejercicio para dorsales",
      muscleGroup: "back", 
      equipment: "Máquina de poleas", 
      sets: 3, 
      repetitions: 12,
      restTime: 60
    }
  ],
  biceps: [
    { 
      id: "biceps-1", 
      name: "Curl con Barra", 
      description: "Ejercicio para bíceps",
      muscleGroup: "biceps", 
      equipment: "Barra", 
      videoUrl: "https://www.youtube.com/watch?v=mFgTFstIfFs", 
      sets: 4, 
      repetitions: 12,
      restTime: 60
    },
    { 
      id: "biceps-2", 
      name: "Curl Martillo", 
      description: "Ejercicio para bíceps y braquial",
      muscleGroup: "biceps", 
      equipment: "Mancuernas", 
      sets: 3, 
      repetitions: 12,
      restTime: 60
    }
  ],
  triceps: [
    { 
      id: "triceps-1", 
      name: "Extensiones con Polea", 
      description: "Ejercicio para tríceps",
      muscleGroup: "triceps", 
      equipment: "Máquina de poleas", 
      imageUrl: "https://cdn.shopify.com/s/files/1/0269/5551/3900/files/Triceps-Pressdown_e759437b-6200-4b44-b484-14db770024a4_600x600.png?v=1612136845", 
      sets: 4, 
      repetitions: 15,
      restTime: 60
    },
    { 
      id: "triceps-2", 
      name: "Fondos en Banco", 
      description: "Ejercicio para tríceps",
      muscleGroup: "triceps", 
      equipment: "Banco", 
      sets: 3, 
      repetitions: 12,
      restTime: 60
    }
  ],
  shoulders: [
    { 
      id: "shoulders-1", 
      name: "Press Militar", 
      description: "Ejercicio compuesto para hombros",
      muscleGroup: "shoulders", 
      equipment: "Mancuernas o barra", 
      videoUrl: "https://www.youtube.com/watch?v=7x9PT6FrSLA", 
      sets: 4, 
      repetitions: 10,
      restTime: 90
    },
    { 
      id: "shoulders-2", 
      name: "Elevaciones Laterales", 
      description: "Ejercicio de aislamiento para deltoides laterales",
      muscleGroup: "shoulders", 
      equipment: "Mancuernas", 
      sets: 3, 
      repetitions: 15,
      restTime: 60
    }
  ],
  abs: [
    { 
      id: "abs-1", 
      name: "Crunches", 
      description: "Ejercicio para abdominales superiores",
      muscleGroup: "abs", 
      equipment: "Ninguno", 
      sets: 3, 
      repetitions: 20,
      restTime: 45
    },
    { 
      id: "abs-2", 
      name: "Plancha", 
      description: "Ejercicio isométrico para core",
      muscleGroup: "abs", 
      equipment: "Ninguno", 
      imageUrl: "https://hips.hearstapps.com/hmg-prod/images/mid-adult-man-doing-plank-exercise-royalty-free-image-1585917009.jpg?crop=1xw:0.84375xh;center,top&resize=1200:*", 
      sets: 3, 
      repetitions: 60,
      restTime: 30
    }
  ],
  glutes: [
    { 
      id: "glutes-1", 
      name: "Hip Thrust", 
      description: "Ejercicio para glúteos",
      muscleGroup: "glutes", 
      equipment: "Banco y barra", 
      imageUrl: "https://flex-web-media-prod.storage.googleapis.com/2024/08/hip-thust-workout-2.jpg", 
      sets: 4, 
      repetitions: 15,
      restTime: 90
    },
    { 
      id: "glutes-2", 
      name: "Sentadillas", 
      description: "Ejercicio compuesto para piernas y glúteos",
      muscleGroup: "glutes", 
      equipment: "Barra o peso corporal", 
      sets: 3, 
      repetitions: 12,
      restTime: 90
    }
  ],
  quads: [
    { 
      id: "quads-1", 
      name: "Sentadillas", 
      description: "Ejercicio compuesto para piernas",
      muscleGroup: "quads", 
      equipment: "Barra o peso corporal", 
      imageUrl: "https://eresfitness.com/wp-content/uploads/Sentadilla-con-salto.webp", 
      sets: 4, 
      repetitions: 12,
      restTime: 120
    },
    { 
      id: "quads-2", 
      name: "Prensa de Piernas", 
      description: "Ejercicio para cuádriceps",
      muscleGroup: "quads", 
      equipment: "Máquina de prensa", 
      sets: 3, 
      repetitions: 15,
      restTime: 90
    }
  ],
  hamstrings: [
    { 
      id: "hamstrings-1", 
      name: "Peso Muerto", 
      description: "Ejercicio compuesto para espalda baja e isquiotibiales",
      muscleGroup: "hamstrings", 
      equipment: "Barra", 
      videoUrl: "https://www.youtube.com/watch?v=0XL4cZR2Ink", 
      sets: 4, 
      repetitions: 10,
      restTime: 120
    },
    { 
      id: "hamstrings-2", 
      name: "Curl Femoral", 
      description: "Ejercicio para isquiotibiales",
      muscleGroup: "hamstrings", 
      equipment: "Máquina de curl femoral", 
      sets: 3, 
      repetitions: 12,
      restTime: 60
    }
  ],
  calves: [
    { 
      id: "calves-1", 
      name: "Elevaciones de Talón", 
      description: "Ejercicio para pantorrillas",
      muscleGroup: "calves", 
      equipment: "Máquina o peso corporal", 
      sets: 4, 
      repetitions: 20,
      restTime: 60
    },
    { 
      id: "calves-2", 
      name: "Prensa de Pantorrillas", 
      description: "Ejercicio para pantorrillas",
      muscleGroup: "calves", 
      equipment: "Máquina de prensa", 
      sets: 3, 
      repetitions: 15,
      restTime: 45
    }
  ]
};

export default mockExercises;
