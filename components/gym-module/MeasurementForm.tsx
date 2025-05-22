import React, { useState, useEffect } from 'react';
import { CreatePhysicalMeasurementDTO, Weight, PhysicalProgress } from '@/types/gym/physicalTracking';
import { calculateBMI, classifyBMI } from '@/utils/physicalTrackingUtils';

interface MeasurementFormProps {
  userId: string;
  initialData?: PhysicalProgress | null;
  onSubmit: (userId: string, data: CreatePhysicalMeasurementDTO) => Promise<void>;
  isTrainerMode?: boolean;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ 
  userId, 
  initialData, 
  onSubmit,
  isTrainerMode = false
}) => {
  const [formData, setFormData] = useState<CreatePhysicalMeasurementDTO>({
    weight: { value: 0, unit: 'KG' },
    measurements: {
      height: 0,
      chestCircumference: 0,
      waistCircumference: 0,
      hipCircumference: 0,
      bicepsCircumference: 0,
      thighCircumference: 0,
      additionalMeasures: {
        calves: 0,
        shoulders: 0
      }
    },
    physicalGoal: ''
  });

  const [calculatedBMI, setCalculatedBMI] = useState<number | null>(null);
  const [bmiClassification, setBmiClassification] = useState<{ label: string, color: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdditionalMeasures, setShowAdditionalMeasures] = useState(false);

  // Cargar datos iniciales si están disponibles
  useEffect(() => {
    if (initialData) {
      const formattedData: CreatePhysicalMeasurementDTO = {
        weight: initialData.weight || { value: 0, unit: 'KG' },
        measurements: {
          height: initialData.measurements?.height || 0,
          chestCircumference: initialData.measurements?.chestCircumference || 0,
          waistCircumference: initialData.measurements?.waistCircumference || 0,
          hipCircumference: initialData.measurements?.hipCircumference || 0,
          bicepsCircumference: initialData.measurements?.bicepsCircumference || 0,
          thighCircumference: initialData.measurements?.thighCircumference || 0,
          additionalMeasures: initialData.measurements?.additionalMeasures || {
            calves: 0,
            shoulders: 0
          }
        },
        physicalGoal: initialData.physicalGoal || ''
      };
      setFormData(formattedData);
      
      // Mostrar medidas adicionales si existen en los datos iniciales
      if (initialData.measurements?.additionalMeasures && 
         (initialData.measurements.additionalMeasures.calves || 
          initialData.measurements.additionalMeasures.shoulders)) {
        setShowAdditionalMeasures(true);
      }
      
      // Calcular BMI con los datos iniciales
      updateBMI(formattedData.weight, formattedData.measurements.height);
    }
  }, [initialData]);

  // Calcular BMI cada vez que cambie el peso o altura
  const updateBMI = (weight: Weight, height: number) => {
    if (weight.value > 0 && height > 0) {
      const bmi = calculateBMI(weight, height);
      setCalculatedBMI(bmi);
      
      if (bmi !== null) {
        setBmiClassification(classifyBMI(bmi));
      }
    } else {
      setCalculatedBMI(null);
      setBmiClassification(null);
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const updatedWeight = { ...formData.weight, value: isNaN(value) ? 0 : value };
    setFormData(prev => ({ ...prev, weight: updatedWeight }));
    updateBMI(updatedWeight, formData.measurements.height);
  };

  const handleWeightUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const unit = e.target.value as 'KG' | 'LB';
    const updatedWeight = { ...formData.weight, unit };
    setFormData(prev => ({ ...prev, weight: updatedWeight }));
    updateBMI(updatedWeight, formData.measurements.height);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseFloat(e.target.value);
    const updatedMeasurements = { 
      ...formData.measurements, 
      height: isNaN(height) ? 0 : height 
    };
    setFormData(prev => ({ ...prev, measurements: updatedMeasurements }));
    updateBMI(formData.weight, height);
  };

  const handleMeasurementChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    
    if (field.includes('.')) {
      // Para medidas adicionales (contiene un punto en el nombre del campo)
      const [parent, child] = field.split('.');
      const updatedMeasurements = { 
        ...formData.measurements,
        additionalMeasures: {
          ...formData.measurements.additionalMeasures,
          [child]: isNaN(value) ? 0 : value
        }
      };
      setFormData(prev => ({ ...prev, measurements: updatedMeasurements }));
    } else {
      // Para medidas principales
      const updatedMeasurements = { 
        ...formData.measurements, 
        [field]: isNaN(value) ? 0 : value 
      };
      setFormData(prev => ({ ...prev, measurements: updatedMeasurements }));
    }
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, physicalGoal: e.target.value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.weight.value <= 0) {
      newErrors.weight = 'El peso debe ser mayor que 0';
    }
    
    if (formData.measurements.height <= 0) {
      newErrors.height = 'La altura debe ser mayor que 0';
    } else if (formData.measurements.height > 3) {
      newErrors.height = 'La altura debe estar en metros (ej: 1.75)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(userId, formData);
      // El manejo post-éxito se hace en el componente padre
    } catch (error) {
      console.error('Error al enviar medición:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      {isTrainerMode && (
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <p className="text-blue-700 font-medium">
            Registrando medición para estudiante con ID: {userId}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Peso y Unidad */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Peso <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <input
              type="number"
              step="0.1"
              min="0"
              className={`flex-grow p-2 border rounded-l-md ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.weight.value || ''}
              onChange={handleWeightChange}
              required
            />
            <select
              className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-2"
              value={formData.weight.unit}
              onChange={handleWeightUnitChange}
            >
              <option value="KG">KG</option>
              <option value="LB">LB</option>
            </select>
          </div>
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
        </div>
        
        {/* Altura */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Altura (m) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className={`w-full p-2 border rounded-md ${errors.height ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.measurements.height || ''}
            onChange={handleHeightChange}
            required
          />
          {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
        </div>
        
        {/* IMC Calculado */}
        {calculatedBMI !== null && (
          <div className="md:col-span-2 p-4 rounded-md" style={{ backgroundColor: bmiClassification?.color ? `${bmiClassification.color}20` : '#f3f4f6' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">IMC Calculado</h3>
                <p className="text-3xl font-bold">{calculatedBMI.toFixed(1)}</p>
                {bmiClassification && (
                  <p className="mt-1 font-medium" style={{ color: bmiClassification.color }}>
                    {bmiClassification.label}
                  </p>
                )}
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center" 
                style={{ backgroundColor: bmiClassification?.color || '#e5e7eb' }}>
                <span className="text-white font-bold text-xl">
                  {calculatedBMI.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Circunferencias principales */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Circunferencia de Pecho (cm)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formData.measurements.chestCircumference || ''}
            onChange={(e) => handleMeasurementChange('chestCircumference', e)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Circunferencia de Cintura (cm)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formData.measurements.waistCircumference || ''}
            onChange={(e) => handleMeasurementChange('waistCircumference', e)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Circunferencia de Cadera (cm)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formData.measurements.hipCircumference || ''}
            onChange={(e) => handleMeasurementChange('hipCircumference', e)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Circunferencia de Bíceps (cm)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formData.measurements.bicepsCircumference || ''}
            onChange={(e) => handleMeasurementChange('bicepsCircumference', e)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Circunferencia de Muslo (cm)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formData.measurements.thighCircumference || ''}
            onChange={(e) => handleMeasurementChange('thighCircumference', e)}
          />
        </div>
        
        {/* Toggle para mostrar medidas adicionales */}
        <div className="md:col-span-2">
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            onClick={() => setShowAdditionalMeasures(!showAdditionalMeasures)}
          >
            <span className="mr-1">{showAdditionalMeasures ? '▼' : '►'}</span>
            {showAdditionalMeasures ? 'Ocultar medidas adicionales' : 'Mostrar medidas adicionales'}
          </button>
        </div>
        
        {/* Medidas adicionales */}
        {showAdditionalMeasures && (
          <>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Circunferencia de Pantorrillas (cm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.measurements.additionalMeasures?.calves || ''}
                onChange={(e) => handleMeasurementChange('additionalMeasures.calves', e)}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Circunferencia de Hombros (cm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.measurements.additionalMeasures?.shoulders || ''}
                onChange={(e) => handleMeasurementChange('additionalMeasures.shoulders', e)}
              />
            </div>
          </>
        )}
        
        {/* Meta física */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Meta Física</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md h-24"
            value={formData.physicalGoal || ''}
            onChange={handleGoalChange}
            placeholder="Describe tu meta física (ej: Reducir grasa corporal, ganar masa muscular, mejorar resistencia...)"
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Medición'}
        </button>
      </div>
    </form>
  );
};

export default MeasurementForm;