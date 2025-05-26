import React from 'react';
import { PhysicalProgress } from '@/types/gym/physicalTracking';
import { classifyBMI, formatDate } from '@/utils/physicalTrackingUtils';

interface MeasurementDetailsProps {
  measurement: PhysicalProgress;
  showTitle?: boolean;
}

const MeasurementDetails: React.FC<MeasurementDetailsProps> = ({ 
  measurement, 
  showTitle = true 
}) => {
  const bmiClassification = measurement.bmi ? classifyBMI(measurement.bmi) : null;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {showTitle && (
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Detalle de Medición
            {measurement.recordDate && (
              <span className="ml-2 text-sm text-gray-500 font-normal">
                ({formatDate(measurement.recordDate, 'long')})
              </span>
            )}
          </h2>
        </div>
      )}
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Peso y BMI */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Datos Principales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Peso</p>
                <p className="text-xl font-bold">
                  {measurement.weight?.value} {measurement.weight?.unit || 'KG'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Altura</p>
                <p className="text-xl font-bold">
                  {measurement.measurements?.height} m
                </p>
              </div>
              
              <div className="col-span-2">
                <p className="text-sm text-gray-500">IMC</p>
                <div className="flex items-center">
                  <p className="text-xl font-bold mr-2">
                    {measurement.bmi?.toFixed(1) || 'N/A'}
                  </p>
                  {bmiClassification && (
                    <span 
                      className="text-xs px-2 py-1 rounded-full" 
                      style={{ 
                        backgroundColor: `${bmiClassification.color}30`,
                        color: bmiClassification.color 
                      }}
                    >
                      {bmiClassification.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Circunferencias */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Circunferencias</h3>
            <div className="grid grid-cols-2 gap-4">
              {measurement.measurements?.chestCircumference && (
                <div>
                  <p className="text-sm text-gray-500">Pecho</p>
                  <p className="text-xl font-bold">
                    {measurement.measurements.chestCircumference} cm
                  </p>
                </div>
              )}
              
              {measurement.measurements?.waistCircumference && (
                <div>
                  <p className="text-sm text-gray-500">Cintura</p>
                  <p className="text-xl font-bold">
                    {measurement.measurements.waistCircumference} cm
                  </p>
                </div>
              )}
              
              {measurement.measurements?.hipCircumference && (
                <div>
                  <p className="text-sm text-gray-500">Cadera</p>
                  <p className="text-xl font-bold">
                    {measurement.measurements.hipCircumference} cm
                  </p>
                </div>
              )}
              
              {measurement.measurements?.bicepsCircumference && (
                <div>
                  <p className="text-sm text-gray-500">Bíceps</p>
                  <p className="text-xl font-bold">
                    {measurement.measurements.bicepsCircumference} cm
                  </p>
                </div>
              )}
              
              {measurement.measurements?.thighCircumference && (
                <div>
                  <p className="text-sm text-gray-500">Muslo</p>
                  <p className="text-xl font-bold">
                    {measurement.measurements.thighCircumference} cm
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Medidas adicionales si existen */}
        {measurement.measurements?.additionalMeasures && (
          Object.keys(measurement.measurements.additionalMeasures).length > 0 && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Medidas Adicionales</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {measurement.measurements.additionalMeasures.calves && (
                  <div>
                    <p className="text-sm text-gray-500">Pantorrillas</p>
                    <p className="text-xl font-bold">
                      {measurement.measurements.additionalMeasures.calves} cm
                    </p>
                  </div>
                )}
                
                {measurement.measurements.additionalMeasures.shoulders && (
                  <div>
                    <p className="text-sm text-gray-500">Hombros</p>
                    <p className="text-xl font-bold">
                      {measurement.measurements.additionalMeasures.shoulders} cm
                    </p>
                  </div>
                )}
                
                {/* Mostrar otras medidas adicionales que puedan existir */}
                {Object.entries(measurement.measurements.additionalMeasures)
                  .filter(([key]) => !['calves', 'shoulders'].includes(key))
                  .map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                      <p className="text-xl font-bold">{value} cm</p>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        )}
        
        {/* Meta física si existe */}
        {measurement.physicalGoal && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Meta Física</h3>
            <p className="text-gray-700">{measurement.physicalGoal}</p>
          </div>
        )}
        
        {/* Observaciones si existen */}
        {measurement.observations && measurement.observations.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Observaciones del Entrenador</h3>
            <ul className="list-disc list-inside text-gray-700">
              {measurement.observations.map((observation, index) => (
                <li key={index}>{observation}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasurementDetails;