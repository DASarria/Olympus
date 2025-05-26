/**
 * Interfaces para el módulo de seguimiento físico (Physical Tracking)
 */

// Unidad de peso (KG, LB)
export type WeightUnit = 'KG' | 'LB';

// Estructura para almacenar el peso con su unidad
export interface Weight {
  value: number;
  unit: WeightUnit;
}

// Estructura para medidas adicionales opcionales
export interface AdditionalMeasurements {
  calves?: number;
  shoulders?: number;
  [key: string]: number | undefined; // Permite otras medidas adicionales
}

// Estructura para las medidas corporales básicas
export interface BodyMeasurements {
  height: number;              // Altura en metros
  chestCircumference?: number; // Circunferencia de pecho en cm
  waistCircumference?: number; // Circunferencia de cintura en cm
  hipCircumference?: number;   // Circunferencia de cadera en cm
  bicepsCircumference?: number; // Circunferencia de bíceps en cm
  thighCircumference?: number; // Circunferencia de muslo en cm
  additionalMeasures?: AdditionalMeasurements; // Medidas adicionales opcionales
}

// Interfaz que representa un registro de progreso físico
export interface PhysicalProgress {
  id?: string;                // ID único del registro
  userId?: string;            // ID del usuario al que pertenece
  recordDate?: string;        // Fecha de registro (ISO string)
  weight?: Weight;            // Peso con unidad
  measurements?: BodyMeasurements; // Medidas corporales
  physicalGoal?: string;      // Meta física establecida
  observations?: string[];    // Observaciones del entrenador
  bmi?: number;               // Índice de masa corporal (calculado)
}

// DTO para crear un nuevo registro de medición física
export interface CreatePhysicalMeasurementDTO {
  weight: Weight;
  measurements: BodyMeasurements;
  physicalGoal?: string;
}

// DTO para actualizar medidas corporales
export interface UpdateMeasurementsDTO {
  height?: number;
  chestCircumference?: number;
  waistCircumference?: number;
  hipCircumference?: number;
  bicepsCircumference?: number;
  thighCircumference?: number;
  additionalMeasures?: AdditionalMeasurements;
}

// DTO para establecer una meta física
export interface SetGoalDTO {
  goal: string;
}

// Métricas de progreso físico
export interface ProgressMetrics {
  weightChange?: number;               // Cambio en el peso (kg)
  bmiChange?: number;                  // Cambio en el IMC
  waistCircumferenceChange?: number;   // Cambio en circunferencia de cintura (cm)
  chestCircumferenceChange?: number;   // Cambio en circunferencia de pecho (cm)
  hipCircumferenceChange?: number;     // Cambio en circunferencia de cadera (cm)
  bicepsCircumferenceChange?: number;  // Cambio en circunferencia de bíceps (cm)
  thighCircumferenceChange?: number;   // Cambio en circunferencia de muslo (cm)
  [key: string]: number | undefined;   // Otras métricas calculadas
}

// Interfaz para estudiantes (usuarios)
export interface Student {
  id: string;
  name: string;
  institutionalId: string;
  email?: string;
  role?: string;
  weight?: number;
  height?: number;
  profileImage?: string;
  isTrainer?: boolean;
}

// Clasificación de IMC
export interface BMIClassification {
  label: string;   // Etiqueta de clasificación (ej: "Peso saludable")
  color: string;   // Color para representación visual
  range?: {        // Rango opcional de valores
    min: number;
    max: number;
  };
}

// Período de tiempo para análisis
export type AnalysisPeriod = '1m' | '3m' | '6m' | '1y' | 'all';