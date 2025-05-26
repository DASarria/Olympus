import React, { useState } from 'react';
import { PhysicalProgress } from '@/types/gym/physicalTracking';
import { formatDate } from '@/utils/physicalTrackingUtils';

interface ProgressHistoryProps {
  measurements: PhysicalProgress[];
  onSelectMeasurement?: (measurement: PhysicalProgress) => void;
}

const ProgressHistory: React.FC<ProgressHistoryProps> = ({ 
  measurements, 
  onSelectMeasurement 
}) => {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const handleItemClick = (measurement: PhysicalProgress) => {
    if (onSelectMeasurement) {
      onSelectMeasurement(measurement);
    } else if (measurement.id) {
      setExpandedItemId(expandedItemId === measurement.id ? null : measurement.id);
    }
  };

  // Ordenar mediciones por fecha (más reciente primero)
  const sortedMeasurements = [...measurements].sort((a, b) => {
    return new Date(b.recordDate || '').getTime() - new Date(a.recordDate || '').getTime();
  });

  if (sortedMeasurements.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No hay mediciones registradas.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Historial de Mediciones</h3>
        <p className="text-sm text-gray-500">Selecciona una medición para ver detalles</p>
      </div>
      <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
        {sortedMeasurements.map((measurement) => (
          <div 
            key={measurement.id} 
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              expandedItemId === measurement.id ? 'bg-gray-50' : ''
            }`}
            onClick={() => handleItemClick(measurement)}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">
                  {formatDate(measurement.recordDate || '', 'medium')}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {measurement.weight && (
                    <span className="mr-3">
                      Peso: {measurement.weight.value} {measurement.weight.unit}
                    </span>
                  )}
                  {measurement.bmi && (
                    <span>IMC: {measurement.bmi.toFixed(1)}</span>
                  )}
                </div>
              </div>
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
            
            {expandedItemId === measurement.id && (
              <div className="mt-3 pl-3 border-l-2 border-blue-500">
                {measurement.measurements && (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {measurement.measurements.height && (
                      <div className="text-sm">Altura: {measurement.measurements.height} m</div>
                    )}
                    {measurement.measurements.chestCircumference && (
                      <div className="text-sm">Pecho: {measurement.measurements.chestCircumference} cm</div>
                    )}
                    {measurement.measurements.waistCircumference && (
                      <div className="text-sm">Cintura: {measurement.measurements.waistCircumference} cm</div>
                    )}
                    {measurement.measurements.hipCircumference && (
                      <div className="text-sm">Cadera: {measurement.measurements.hipCircumference} cm</div>
                    )}
                    {measurement.measurements.bicepsCircumference && (
                      <div className="text-sm">Bíceps: {measurement.measurements.bicepsCircumference} cm</div>
                    )}
                    {measurement.measurements.thighCircumference && (
                      <div className="text-sm">Muslo: {measurement.measurements.thighCircumference} cm</div>
                    )}
                  </div>
                )}
                
                {measurement.physicalGoal && (
                  <div className="text-sm text-blue-700 mb-2">
                    <span className="font-medium">Meta:</span> {measurement.physicalGoal}
                  </div>
                )}
                
                <div className="flex justify-end mt-2">
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectMeasurement) {
                        onSelectMeasurement(measurement);
                      }
                    }}
                  >
                    Ver detalles completos
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressHistory;