import React, { useState, useEffect } from 'react';

interface ActivityData {
  name: string;
  confirmed: number;
  total: number;
  rejected: number;
}

const CEAdminEstadisticas: React.FC = () => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BASE_URL = 'https://hadesback-app-c5fwbybjd0gnf0fx.canadacentral-01.azurewebsites.net';
  const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInVzZXJOYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGVzY3VlbGFpbmcuZWR1LmNvIiwibmFtZSI6ImVsIGFkbWluIiwicm9sZSI6IkFETUlOIiwic3BlY2lhbHR5IjoibnVsbCIsImV4cCI6MTc0ODI2MzYzOH0.-gs2BDUAUi-ZKx3paLTQ8Qe04ccP10s9JEXTioNECCc';

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Cargando datos del endpoint...');
      
      const response = await fetch(`${BASE_URL}/api/activity/stadistics`, {
        method: 'GET',
        headers: { 
          'Authorization': TOKEN,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Datos recibidos:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        const processedActivities = data.map(item => ({
          name: item.activityType || 'Sin nombre',
          confirmed: Number(item.capacityConfirmated) || 0,
          total: Number(item.capacityTotal) || 0,
          rejected: Number(item.capacityRejected) || 0
        }));
        
        console.log('✅ Actividades procesadas:', processedActivities);
        setActivities(processedActivities);
      } else {
        setError('No se encontraron datos válidos');
      }
      
    } catch (err) {
      console.error('❌ Error:', err);
      setError(`Error al cargar datos: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const colors = ['#FF6B8A', '#4ECDC4', '#45B7D1', '#96CEB4'];
  const maxValue = activities.length > 0 ? Math.max(...activities.map(a => a.confirmed)) : 10;
  const totalConfirmed = activities.reduce((sum, act) => sum + act.confirmed, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Estadísticas Asistencias a las Clases</h1>
          <div className="flex items-center gap-4">
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>2025-1</option>
            </select>
            <button 
              onClick={loadData}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? '🔄 Cargando...' : '📊 Generar Reporte'}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Cargando datos de la base de datos...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
            <button 
              onClick={loadData}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Sin datos */}
        {!loading && !error && activities.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No hay datos disponibles. Haz clic en &quot;Generar Reporte&quot; para cargar.</p>
          </div>
        )}

        {/* Content - Solo mostrar si hay datos */}
        {!loading && activities.length > 0 && (
          <div>
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Left Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-700 mb-4">Clases con más Asistencias</h3>
                  <div className="space-y-3">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{activity.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{activity.confirmed}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${(activity.confirmed / maxValue) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Chart Area */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-6 text-center">Asistencias por Actividad (Datos Reales)</h3>
                  
                  {/* Simple Bar Chart with CSS */}
                  <div className="flex items-end justify-center space-x-8 h-64 mb-4">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="text-xs mb-2 font-medium">{activity.confirmed}</div>
                        <div
                          className="w-16 rounded-t-lg transition-all duration-700 ease-out"
                          style={{
                            height: `${(activity.confirmed / maxValue) * 200}px`,
                            backgroundColor: colors[index % colors.length],
                            minHeight: '20px'
                          }}
                        />
                        <div className="text-xs mt-2 text-center text-gray-600 max-w-16">
                          {activity.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center space-x-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-300 rounded"></div>
                      <span>Actividades Extracurriculares</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              
              {/* Stats Cards */}
              <div className="flex gap-4">
                <div className="bg-blue-500 text-white rounded-lg p-6 text-center flex-1">
                  <div className="text-3xl font-bold">{totalConfirmed}</div>
                  <div className="text-sm opacity-90">Total Asistencias</div>
                </div>
                <div className="bg-red-600 text-white rounded-lg p-6 text-center flex-1">
                  <div className="text-3xl font-bold">{activities.length}</div>
                  <div className="text-sm opacity-90">Total Actividades</div>
                </div>
              </div>

              {/* Simple Pie Chart with CSS */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold text-gray-700 mb-4 text-center">Distribución de Asistencias</h3>
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-8">
                      {/* Simple circular progress */}
                      <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8"/>
                          {activities.map((activity, index) => {
                            const percentage = totalConfirmed > 0 ? (activity.confirmed / totalConfirmed) * 100 : 0;
                            const circumference = 2 * Math.PI * 40;
                            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                            const rotation = activities.slice(0, index).reduce((sum, act) => sum + (totalConfirmed > 0 ? (act.confirmed / totalConfirmed) * 360 : 0), 0);
                            
                            return (
                              <circle
                                key={index}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke={colors[index % colors.length]}
                                strokeWidth="8"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset="0"
                                transform={`rotate(${rotation} 50 50)`}
                              />
                            );
                          })}
                        </svg>
                      </div>
                      
                      {/* Legend */}
                      <div className="space-y-2">
                        {activities.map((activity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: colors[index % colors.length] }}
                            />
                            <span className="text-sm">{activity.name}</span>
                            <span className="text-sm text-gray-500">
                              ({totalConfirmed > 0 ? ((activity.confirmed / totalConfirmed) * 100).toFixed(1) : '0'}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Table */}
            <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700">Detalle por Actividad</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actividad</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Confirmadas</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rechazadas</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">% Ocupación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activities.map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{activity.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-green-600 font-semibold">{activity.confirmed}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{activity.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-red-500">{activity.rejected}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {activity.total > 0 ? ((activity.confirmed / activity.total) * 100).toFixed(1) : '0'}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CEAdminEstadisticas;