import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';
import { withRoleProtection } from '@/hoc/withRoleProtection';
import { Return } from '@/components/Return';
import { PhysicalProgress } from '@/types/gym/physicalTracking';
import MeasurementDetails from '@/components/gym-module/MeasurementDetails';
import { formatDate } from '@/utils/physicalTrackingUtils';
import { getPhysicalMeasurementHistory } from '@/api/gym-module/physicalProgressService';

const MeasurementDetailsPage = () => {
  const router = useRouter();
  const { id: measurementId, studentId } = router.query;
  
  const [measurement, setMeasurement] = useState<PhysicalProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (measurementId) {
      loadMeasurement(measurementId as string);
    }
  }, [measurementId, studentId]);
  
  const loadMeasurement = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Determinar qué ID usar para cargar las mediciones
      const targetUserId = studentId ? studentId as string : sessionStorage.getItem('gymId');
      
      if (!targetUserId) {
        setError('No se pudo determinar el ID de usuario');
        return;
      }
      
      console.log(`Cargando medición con ID: ${id} para usuario: ${targetUserId}`);
      
      // Obtener todas las mediciones
      const history = await getPhysicalMeasurementHistory(targetUserId);
      
      console.log(`Mediciones cargadas: ${history.length}`);
      
      // Encontrar la medición específica
      const found = history.find(m => m.id === id);
      
      if (found) {
        console.log(`Medición encontrada:`, found);
        setMeasurement(found);
      } else {
        console.warn(`No se encontró la medición ${id} en el historial de ${targetUserId}`);
        
        // Si no se encontró pero hay mediciones, mostrar la primera como fallback
        if (history.length > 0) {
          console.log('Usando la primera medición del historial como fallback');
          setMeasurement(history[0]);
        } else {
          setError('No se encontró la medición solicitada');
        }
      }
    } catch (error) {
      console.error('Error al cargar la medición:', error);
      setError('Error al cargar los detalles de la medición');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <PageTransitionWrapper>
      <div className="container mx-auto max-w-5xl px-4 py-6">
        <Return 
          className="mb-6"
          text="Progreso Físico"
          returnPoint={studentId ? `/gym-module/physical-progress?studentId=${studentId}&tab=history` : '/gym-module/physical-progress?tab=history'}
        />
        
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Detalles de Medición
          {measurement?.recordDate && (
            <span className="text-lg font-normal text-gray-500 ml-3">
              {formatDate(measurement.recordDate, 'long')}
            </span>
          )}
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : measurement ? (
          <MeasurementDetails measurement={measurement} showTitle={false} />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
            No se encontró información para esta medición.
          </div>
        )}
      </div>
    </PageTransitionWrapper>
  );
};

export default withRoleProtection(["STUDENT", "TRAINER"], "/gym-module")(MeasurementDetailsPage);