import { BMIClassification, PhysicalProgress, Weight } from "@/types/gym/physicalTracking";

/**
 * Funciones de utilidad para cálculos y transformaciones relacionadas con el seguimiento físico
 */

/**
 * Calcula el Índice de Masa Corporal (IMC/BMI) basado en el peso y la altura
 */
export function calculateBMI(
  weight: number | Weight,
  height: number
): number | null {
  if (!height || height <= 0) return null;

  // Extrae el valor numérico del peso
  const weightValue = typeof weight === 'number' 
    ? weight 
    : weight?.value;

  // Extrae la unidad del peso
  const weightUnit = typeof weight === 'number' 
    ? 'KG' 
    : weight?.unit || 'KG';

  // Valida que el peso sea positivo
  if (!weightValue || weightValue <= 0) return null;

  // Convierte libras a kilogramos si es necesario
  const weightInKg = weightUnit === 'LB' 
    ? weightValue * 0.453592 
    : weightValue;

  // Calcula el IMC: peso(kg) / altura²(m)
  const bmi = weightInKg / (height * height);
  
  // Redondea a 2 decimales
  return parseFloat(bmi.toFixed(2));
}

/**
 * Clasifica un valor de IMC en categorías estándar
 */
export function classifyBMI(bmi: number): { label: string, color: string } {
  if (bmi < 18.5) return { label: "Bajo peso", color: "#FFA500" };
  if (bmi < 25) return { label: "Peso saludable", color: "#008000" };
  if (bmi < 30) return { label: "Sobrepeso", color: "#FFD700" };
  return { label: "Obesidad", color: "#FF0000" };
}

/**
 * Convierte unidades de peso entre kilogramos y libras
 */
export function convertWeight(
  weight: Weight, 
  targetUnit: 'KG' | 'LB'
): Weight {
  if (weight.unit === targetUnit) return weight;

  let convertedValue: number;
  
  if (targetUnit === 'KG') {
    // Convertir de LB a KG
    convertedValue = weight.value * 0.453592;
  } else {
    // Convertir de KG a LB
    convertedValue = weight.value * 2.20462;
  }

  return {
    value: parseFloat(convertedValue.toFixed(2)),
    unit: targetUnit
  };
}

/**
 * Calcula el cambio porcentual entre dos valores
 */
export function calculatePercentageChange(
  oldValue: number, 
  newValue: number
): number | null {
  if (oldValue === 0 || !oldValue || !newValue) return null;
  
  const change = ((newValue - oldValue) / Math.abs(oldValue)) * 100;
  return parseFloat(change.toFixed(2));
}

/**
 * Formatea una fecha ISO a un formato legible
 */
export function formatDate(
  isoDate: string, 
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  
  if (isNaN(date.getTime())) return '';
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString();
    case 'long':
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'medium':
    default:
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
  }
}


// /**
//  * Genera datos simulados para pruebas o fallback
//  */
// export function generateMockProgressData(): PhysicalProgress[] {
//   const today = new Date();
//   const mockData: PhysicalProgress[] = [];
  
//   // Generar datos para los últimos 6 meses
//   for (let i = 5; i >= 0; i--) {
//     const date = new Date(today);
//     date.setMonth(date.getMonth() - i);
    
//     // Peso base de 75kg con pequeñas variaciones
//     const baseWeight = 75 - (i * 0.5);
//     const randomVariation = Math.random() * 0.8 - 0.4; // entre -0.4 y 0.4
    
//     const mockProgress: PhysicalProgress = {
//       id: `mock-${i}`,
//       userId: 'mock-user',
//       recordDate: date.toISOString(),
//       weight: {
//         value: parseFloat((baseWeight + randomVariation).toFixed(1)),
//         unit: 'KG'
//       },
//       measurements: {
//         height: 1.75,
//         chestCircumference: 95 + (5 - i) * 0.2,
//         waistCircumference: 82 - i * 0.4,
//         hipCircumference: 98,
//         bicepsCircumference: 32 + i * 0.1,
//         thighCircumference: 55
//       },
//       physicalGoal: i === 0 ? "Mantener peso actual y aumentar masa muscular" : undefined
//     };
    
//     // Calcular IMC
//     mockProgress.bmi = calculateBMI(mockProgress.weight, mockProgress.measurements.height);
    
//     mockData.push(mockProgress);
//   }
  
//   return mockData;
// }