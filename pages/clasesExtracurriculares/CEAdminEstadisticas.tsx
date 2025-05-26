import React, { useState, useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js/auto';

interface ActivityData {
  [key: string]: number;
}

interface SemesterData {
  totalAsistencias: number;
  totalActividades: number;
  actividades: ActivityData;
  tendenciaSemanal?: number[];
}

interface AttendanceData {
  [semester: string]: SemesterData;
}

const AttendanceStatistics: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>('2024-2');
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const [isChartReady, setIsChartReady] = useState<boolean>(false);
  
  // Datos de ejemplo - reemplazar con datos del backend
  const mockData: AttendanceData = {
    '2024-1': {
      totalAsistencias: 87,
      totalActividades: 6,
      actividades: {
        basketball: 19,
        tenis: 16,
        futbol: 15,
        taekwondo: 12,
        pingpong: 8,
        aerobicos: 7,
        zumba: 6,
        tecvocal: 4
      },
      tendenciaSemanal: [55, 62, 68, 75, 82, 87, 84, 87]
    },
    '2024-2': {
      totalAsistencias: 95,
      totalActividades: 8,
      actividades: {
        basketball: 21,
        tenis: 18,
        futbol: 17,
        taekwondo: 11,
        pingpong: 9,
        aerobicos: 8,
        zumba: 7,
        tecvocal: 4
      },
      tendenciaSemanal: [65, 72, 78, 85, 88, 92, 89, 95]
    }
  };

  const currentData: SemesterData = mockData[selectedSemester] || { 
    totalAsistencias: 0, 
    totalActividades: 0, 
    actividades: {} 
  };
  
  const activityLabels: Record<string, string> = {
    basketball: 'Basketball',
    tenis: 'Tenis',
    futbol: 'Fútbol',
    taekwondo: 'Taekwondo',
    pingpong: 'Ping Pong',
    aerobicos: 'Aeróbicos',
    zumba: 'Zumba',
    tecvocal: 'Téc. Vocal'
  };

  useEffect(() => {
    // Delay inicial para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      setIsChartReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isChartReady) {
      createChart();
    }
    
    // Cleanup function para destruir el chart cuando el componente se desmonte
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
        setChartInstance(null);
      }
    };
  }, [selectedSemester, isChartReady]);

  useEffect(() => {
    // Cleanup al desmontar el componente
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  const createChart = async (): Promise<void> => {
    if (!chartRef.current || !isChartReady) return;
    
    // Destruir instancia anterior si existe
    if (chartInstance) {
      chartInstance.destroy();
      setChartInstance(null);
    }

    // Pequeño delay adicional para asegurar cleanup completo
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Obtener actividades ordenadas para la gráfica
    const sortedActivities = getSortedActivities();
    const labels = sortedActivities.map(([activity]) => activityLabels[activity] || activity);
    const data = sortedActivities.map(([, count]) => count);
    
    // Paleta de colores aesthetic
    const aestheticColors = [
      '#FF6B9D', // Rosa vibrante
      '#4ECDC4', // Verde menta
      '#45B7D1', // Azul cielo
      '#96CEB4', // Verde sage
      '#FFEAA7', // Amarillo suave
      '#DDA0DD', // Lila
      '#98D8C8', // Verde agua
      '#F7DC6F', // Amarillo dorado
      '#BB8FCE', // Púrpura suave
      '#85C1E9'  // Azul claro
    ];
    
    // Asignar colores a cada barra
    const backgroundColors = data.map((_, index) => aestheticColors[index % aestheticColors.length]);
    
    const chartData: ChartData<'bar'> = {
      labels: labels,
      datasets: [{
        label: 'Número de Asistencias',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color), // Mismo color para el borde
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }]
    };

    const chartOptions: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.08)'
          },
          ticks: {
            color: '#6B7280',
            stepSize: 1,
            font: {
              size: 12
            }
          },
          title: {
            display: true,
            text: 'Número de Asistencias',
            color: '#374151',
            font: {
              size: 14,
              weight: '600'
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#374151',
            maxRotation: 30,
            minRotation: 0,
            font: {
              size: 13,
              weight: '500'
            },
            padding: 8
          },
          title: {
            display: true,
            text: 'Actividades Extracurriculares',
            color: '#374151',
            font: {
              size: 14,
              weight: '600'
            },
            padding: {
              top: 15
            }
          }
        }
      }
    };

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: chartData,
      options: chartOptions
    };
    
    const newChart = new Chart(ctx, config);
    setChartInstance(newChart);
  };

  const getSortedActivities = (): [string, number][] => {
    return Object.entries(currentData.actividades)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8);
  };

  const generateReport = (): void => {
    alert('Generando reporte en PDF...');
  };

  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedSemester(event.target.value);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="w-full" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold" style={{ color: '#990000' }}>
            Estadísticas Asistencias a las Clases
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <select
                value={selectedSemester}
                onChange={handleSemesterChange}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:border-red-500"
                style={{ focusRingColor: '#990000' }}
              >
                <option value="2024-1">2024-1</option>
                <option value="2024-2">2024-2</option>
                <option value="2025-1">2025-1</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Ranking de Actividades - A la izquierda */}
          <div className="xl:col-span-1 rounded-lg p-6" style={{ backgroundColor: '#F5F5F5' }}>
            <div className="flex flex-col mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Clases con más Asistencias
              </h2>
              <button
                onClick={generateReport}
                className="text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: '#990000' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7,10 12,15 17,10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Generar Reporte
              </button>
            </div>
            
            <div className="space-y-4">
              {getSortedActivities().map(([activity, count], index) => {
                const maxCount = Math.max(...Object.values(currentData.actividades));
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                
                return (
                  <div key={activity} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {activityLabels[activity] || activity}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {count.toString().padStart(2, '0')}
                        </span>
                      </div>
                      <div className="w-full bg-white rounded-full h-3 border border-gray-200">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: '#8595C9'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gráfico de Barras - A la derecha */}
          <div className="xl:col-span-4 rounded-lg p-6" style={{ backgroundColor: '#F5F5F5' }}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Asistencias por Actividad
            </h2>
            <div className="h-96 mb-6">
              {isChartReady ? (
                <canvas ref={chartRef} key={`chart-${selectedSemester}`}></canvas>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Cargando gráfico...
                </div>
              )}
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="text-center p-4 rounded-md" style={{ backgroundColor: '#8595C9', color: 'white' }}>
                <div className="text-sm mb-1 font-medium">Total Asistencias</div>
                <div className="text-3xl font-bold">
                  {currentData.totalAsistencias}
                </div>
              </div>
              <div className="text-center p-4 rounded-md" style={{ backgroundColor: '#990000', color: 'white' }}>
                <div className="text-sm mb-1 font-medium">Total Actividades</div>
                <div className="text-3xl font-bold">
                  {currentData.totalActividades}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStatistics;