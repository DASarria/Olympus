import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Only extend specific THREE objects that we need to use as JSX elements
extend({
  Vector3: THREE.Vector3,
  Box3: THREE.Box3
});

interface BodyCanvasProps {
  modelPath: string;
  onSelectZone: (zone: number) => void;
}

// Zone labels for UI display
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
};

// Exercise popup modal component
function ExercisePopup({ zoneId, onClose }: { 
  zoneId: number; 
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API loading for smoother UI
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [zoneId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{zoneLabels[zoneId]} - Ejercicios</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* We'll load exercises from the parent component */}
            <div className="flex justify-center items-center col-span-full">
              <p className="text-gray-600">Selecciona ejercicios de este grupo muscular usando el selector de arriba</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Panel of vertical buttons
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
  );
}

function Model({ modelPath }: Omit<BodyCanvasProps, 'onSelectZone'>) {
  const { scene } = useGLTF(modelPath);
  
  return (
    <primitive object={scene} />
  );
}

function CameraControls() {
  // Use any to avoid type conflicts with OrbitControls
  const orbitRef = useRef<any>(null);
  
  useFrame(() => {
    if (orbitRef.current) {
      // Since we can't directly access autoRotate properties on the Object3D type,
      // we'll type cast it when accessing those properties
      const controls = orbitRef.current as unknown as { autoRotateSpeed: number; autoRotate: boolean };
      controls.autoRotateSpeed = 0.5;
      controls.autoRotate = true;
    }
  });
  
  return <OrbitControls ref={orbitRef} enablePan={false} enableZoom={true} />;
}

export default function BodyCanvas({ modelPath, onSelectZone }: BodyCanvasProps) {
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
    // SSR-safe loading state
    return (
      <div className="h-[500px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-lg text-gray-500">Cargando modelo 3D...</div>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
      {/* 3D model canvas */}
      <Canvas shadows camera={{ position: [0, 0, 2.5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Model modelPath={modelPath} />
        <CameraControls />
      </Canvas>
      
      {/* UI layer */}
      <ZoneButtonPanel onSelectZone={handleZoneSelect} />
      
      {/* Exercise popup if a zone is selected */}
      {selectedZoneId && (
        <ExercisePopup 
          zoneId={selectedZoneId} 
          onClose={closePopup} 
        />
      )}
    </div>
  );
}
