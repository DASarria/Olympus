import React from 'react';
import { classifyBMI } from '@/utils/physicalTrackingUtils';

interface BMIIndicatorProps {
  bmi: number | null;
  showLabel?: boolean;
}

const BMIIndicator: React.FC<BMIIndicatorProps> = ({ bmi, showLabel = true }) => {
  if (bmi === null) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-gray-400 text-sm">IMC no disponible</div>
      </div>
    );
  }

  const classification = classifyBMI(bmi);
  
  // Rangos de IMC para la escala visual
  const ranges = [
    { min: 0, max: 18.5, label: "Bajo peso", color: "#FFA500" },
    { min: 18.5, max: 25, label: "Peso saludable", color: "#008000" },
    { min: 25, max: 30, label: "Sobrepeso", color: "#FFD700" },
    { min: 30, max: 100, label: "Obesidad", color: "#FF0000" }
  ];
  
  // Calcular la posición del indicador en la escala (0-100%)
  const getPosition = () => {
    const minBMI = 15; // Mínimo visualizado en la escala
    const maxBMI = 40; // Máximo visualizado en la escala
    const range = maxBMI - minBMI;
    let position = ((bmi - minBMI) / range) * 100;
    
    // Limitar entre 0 y 100
    position = Math.max(0, Math.min(100, position));
    return position;
  };

  return (
    <div className="w-full p-4">
      {/* Valor de IMC y clasificación */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-bold">{bmi.toFixed(1)}</div>
        {showLabel && (
          <div 
            className="text-sm font-medium px-2 py-1 rounded-full" 
            style={{ 
              backgroundColor: `${classification.color}30`,
              color: classification.color 
            }}
          >
            {classification.label}
          </div>
        )}
      </div>
      
      {/* Escala de IMC */}
      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden flex mt-2">
        {ranges.map((range, index) => (
          <div 
            key={index} 
            className="h-full" 
            style={{ 
              backgroundColor: range.color,
              width: `${((range.max - range.min) / 25) * 100}%`
            }}
          />
        ))}
        
        {/* Indicador de posición actual */}
        <div 
          className="absolute top-0 w-4 h-4 bg-white border-2 rounded-full transform -translate-x-1/2"
          style={{ 
            left: `${getPosition()}%`,
            borderColor: classification.color 
          }}
        />
      </div>
      
      {/* Etiquetas de la escala */}
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>15</span>
        <span>20</span>
        <span>25</span>
        <span>30</span>
        <span>35</span>
        <span>40</span>
      </div>
    </div>
  );
};

export default BMIIndicator;