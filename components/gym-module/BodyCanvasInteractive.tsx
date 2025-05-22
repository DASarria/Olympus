/* eslint-disable @typescript-eslint/no-explicit-any */
/* components/gym-module/BodyCanvasInteractive.tsx */
'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, useGLTF} from '@react-three/drei'
import * as THREE from 'three'

// Only extend specific THREE objects that you need to use as JSX elements
extend({
  Vector3: THREE.Vector3,
  Box3: THREE.Box3
})

interface BodyCanvasProps {
  modelPath: string
  onSelectZone?: (zone: number) => void // Made optional since we're not using it directly in this component anymore
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

// We're not using these components anymore with the new design approach
// Export zoneLabels for use in the MuscleGroupSelector component
export const muscleZoneLabels = zoneLabels;

function Model({ modelPath }: Readonly<Omit<BodyCanvasProps, 'onSelectZone'>>) {
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

export default function BodyCanvasInteractive({ modelPath }: Readonly<BodyCanvasProps>) {
  const [mounted, setMounted] = useState(false);
  
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
      <div className="absolute bottom-4 left-20 bg-black bg-opacity-50 text-white p-2 rounded z-10">
        Modelo anatómico 3D
      </div>
      
      {/* Canvas con modelo 3D */}
      <Canvas shadows camera={{ position: [0, 0.5, 4], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <Model modelPath={modelPath} />
        <CameraControls />
      </Canvas>
    </div>
  );
}
