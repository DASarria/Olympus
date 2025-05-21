/* eslint-disable @typescript-eslint/no-explicit-any */
/* components/gym-module/BodyCanvasInteractive.tsx */
'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, useGLTF} from '@react-three/drei'
import * as THREE from 'three'
import mockExercises from '@/api/gym-module/exerciseMockData'
import ExerciseList from './ExerciseList'

// Only extend specific THREE objects that you need to use as JSX elements
extend({
  Vector3: THREE.Vector3,
  Box3: THREE.Box3
})

interface BodyCanvasProps {
  modelPath: string
  onSelectZone: (zone: number) => void
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  repetitions?: number;
  reps?: number;
  videoUrl?: string;
  imageUrl?: string;
  restTime?: number;
  description?: string;
  muscleGroup: string;
  equipment: string;
}

const zoneLabels: Record<number, string> = {
  1: 'Pecho',
  2: 'Espalda',
  3: 'Bíceps',
  4: 'Tríceps',
  5: 'Hombros',
  6: 'Abdomen',
  7: 'Glúteos',
  8: 'Cuádriceps',
  9: 'Isquiotibiales',
  10: 'Pantorrillas',
}

// Exercise popup modal component with mock data
function ExercisePopup({ zoneId, onClose }: { zoneId: number; onClose: () => void }) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const zoneKey: Record<number, string> = {
    1: 'chest',
    2: 'back',
    3: 'biceps',
    4: 'triceps',
    5: 'shoulders',
    6: 'abs',
    7: 'glutes',
    8: 'quads',
    9: 'hamstrings',
    10: 'calves',
  }

  useEffect(() => {
    // Simulate API loading with mock data
    setLoading(true)
    setTimeout(() => {
      const muscleGroup = zoneKey[zoneId];
      setExercises(mockExercises[muscleGroup] || [])
      setLoading(false)
    }, 500) // Simulated 500ms delay
  }, [zoneId])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white text-black rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">
          Ejercicios: {zoneLabels[zoneId]}
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ExerciseList exercises={exercises} />
        )}
      </div>
    </div>
  )
}

// Panel de botones verticales
function ZoneButtonPanel({ onSelectZone }: { onSelectZone: (zone: number) => void }) {
  return (
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-lg p-2 space-y-2 z-10">
      {Object.entries(zoneLabels).map(([zoneId, label]) => (
        <button
          key={zoneId}
          onClick={() => onSelectZone(parseInt(zoneId))}
          className="flex items-center justify-center bg-blue-600 text-white rounded-md w-10 h-10 text-sm font-bold hover:bg-blue-500 transition-colors border border-white group relative"
          title={label}
        >
          {zoneId}
          <span className="absolute left-full ml-2 whitespace-nowrap bg-black bg-opacity-75 text-white text-xs rounded px-2 py-1 hidden group-hover:block">
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}

function Model({ modelPath }: Omit<BodyCanvasProps, 'onSelectZone'>) {
  const { scene } = useGLTF(modelPath)
  
  // Ajustar la escala para que el modelo se vea más pequeño
  scene.scale.set(0.75, 0.75, 0.75)
  
  // Ajustar la posición vertical para que esté un poco más abajo
  scene.position.x = -0.3
  scene.position.y = -0.8
  
  return (
    <primitive object={scene} />
  );
}

function CameraControls() {
  const orbitRef = useRef<any>(null);
  
  useEffect(() => {
    if (orbitRef.current) {
      // Establecer los límites de zoom para evitar acercarse o alejarse demasiado
      orbitRef.current.minDistance = 2;
      orbitRef.current.maxDistance = 6;
      
      // Establecer límites de inclinación para una mejor visualización
      orbitRef.current.minPolarAngle = Math.PI / 4; // 45 grados desde arriba
      orbitRef.current.maxPolarAngle = Math.PI / 1.5; // Hasta ~120 grados  
    }
  }, []);
  
  useFrame(() => {
    if (orbitRef.current) {
      // Slow rotation to help see all buttons
      orbitRef.current.autoRotateSpeed = 0.5;
      orbitRef.current.autoRotate = true;
    }
  });
  
  return <OrbitControls ref={orbitRef} enablePan={false} enableZoom={true} />;
}

export default function BodyCanvasInteractive({ modelPath, onSelectZone }: BodyCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);

  // Custom handler for zone selection that shows popup
  const handleZoneSelect = (zoneId: number) => {
    setSelectedZoneId(zoneId);
    // Also call the parent component's handler
    onSelectZone(zoneId);
  };

  const closePopup = () => {
    setSelectedZoneId(null);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="relative h-full w-full bg-gray-100 flex items-center justify-center">
      <div className="text-lg">Cargando modelo 3D...</div>
    </div>;
  }
  return (
    <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
      {/* Instrucciones */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded z-10">
        Selecciona el número para ver ejercicios de acuerdo a la zona
      </div>
      
      {/* Panel de botones vertical */}
      {selectedZoneId === null && (
        <ZoneButtonPanel onSelectZone={handleZoneSelect} />
      )}
        {/* Canvas con modelo 3D */}
      <Canvas shadows camera={{ position: [0, 0.5, 4], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <Model modelPath={modelPath} />
        <CameraControls />
      </Canvas>
      
      {/* Exercise popup when a zone is selected */}
      {selectedZoneId !== null && (
        <ExercisePopup zoneId={selectedZoneId} onClose={closePopup} />
      )}
    </div>
  );
}
