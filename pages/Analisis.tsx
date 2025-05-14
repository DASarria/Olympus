"use client"

import { useRouter } from "next/router"
import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Definir interfaces para los tipos de datos
interface ReporteAnalisis {
  id: string
  actualDate: string
  actualTime: string
  initialDate: string
  finalDate: string
  userRole: string | null
  totalTurns: number
  turnsCompleted: number
  avarageWaitingTime: string
  averageTimeAttention: string
  turnPercentageByRole: Record<string, number>
  completedPercentageByRole: Record<string, number>
  disabilityPercentagesByRole: Record<string, Record<string, number>>
}

const Analisis = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const especialidades = ["Medicina", "Odontologia", "Psicologia"]
  const discapacidades = ["NoTiene", "MayorDeEdad", "DisfuncionMotriz", "Embarazo", "Otra"]

  // Datos de ejemplo basados en el modelo proporcionado
  const [reporte, setReporte] = useState<ReporteAnalisis>({
    id: "663c9f5d98a432000a4e567d",
    actualDate: "2025-05-14",
    actualTime: "12:30:16",
    initialDate: "2025-05-01",
    finalDate: "2025-05-14",
    userRole: null,
    totalTurns: 150,
    turnsCompleted: 135,
    avarageWaitingTime: "00:10:30",
    averageTimeAttention: "00:12:45",
    turnPercentageByRole: {
      Medicina: 45.0,
      Odontologia: 30.0,
      Psicologia: 25.0,
    },
    completedPercentageByRole: {
      Medicina: 92.0,
      Odontologia: 88.0,
      Psicologia: 90.0,
    },
    disabilityPercentagesByRole: {
      Medicina: {
        NoTiene: 70.0,
        MayorDeEdad: 10.0,
        DisfuncionMotriz: 8.0,
        Embarazo: 7.0,
        Otra: 5.0,
      },
      Odontologia: {
        NoTiene: 75.0,
        MayorDeEdad: 12.0,
        DisfuncionMotriz: 5.0,
        Embarazo: 3.0,
        Otra: 5.0,
      },
      Psicologia: {
        NoTiene: 65.0,
        MayorDeEdad: 15.0,
        DisfuncionMotriz: 10.0,
        Embarazo: 5.0,
        Otra: 5.0,
      },
    },
  })

  // Filtrar por rol
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role === selectedRole ? null : role)
  }

  // Preparar datos para gráficos
  const prepareRoleData = () => {
    return Object.entries(reporte.turnPercentageByRole).map(([name, value]) => ({
      name,
      value,
    }))
  }

  const prepareCompletionData = () => {
    return Object.entries(reporte.completedPercentageByRole).map(([name, value]) => ({
      name,
      value,
    }))
  }

  const prepareDisabilityData = () => {
    if (!selectedRole) return []

    return Object.entries(reporte.disabilityPercentagesByRole[selectedRole] || {}).map(([name, value]) => ({
      name: name.replace(/([A-Z])/g, " $1").trim(),
      value,
    }))
  }

  // Colores para los gráficos
  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-6 flex items-center gap-2">
        <button onClick={() => router.back()} className="text-xl">
          ←
        </button>
        <h1 className="text-2xl font-bold">Análisis</h1>
      </div>

      {/* Información del reporte */}
      <div className="bg-gray-50 p-4 rounded-lg border border-red-100 mb-6">
        <h2 className="text-xl font-semibold mb-4">Información del Reporte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded border border-red-100">
            <p className="text-sm text-gray-500">ID del Reporte</p>
            <p className="font-medium">{reporte.id}</p>
          </div>
          <div className="bg-white p-3 rounded border border-red-100">
            <p className="text-sm text-gray-500">Fecha de Generación</p>
            <p className="font-medium">{reporte.actualDate}</p>
          </div>
          <div className="bg-white p-3 rounded border border-red-100">
            <p className="text-sm text-gray-500">Hora de Generación</p>
            <p className="font-medium">{reporte.actualTime}</p>
          </div>
          <div className="bg-white p-3 rounded border border-red-100">
            <p className="text-sm text-gray-500">Fecha Inicial</p>
            <p className="font-medium">{reporte.initialDate}</p>
          </div>
          <div className="bg-white p-3 rounded border border-red-100">
            <p className="text-sm text-gray-500">Fecha Final</p>
            <p className="font-medium">{reporte.finalDate}</p>
          </div>
          <div className="bg-white p-3 rounded border border-red-100">
            <p className="text-sm text-gray-500">Rol Filtrado</p>
            <p className="font-medium">{reporte.userRole || "Todos"}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Filtrar por Especialidad</h2>
        <div className="flex flex-wrap gap-2">
          {especialidades.map((esp) => (
            <button
              key={esp}
              onClick={() => handleRoleFilter(esp)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedRole === esp ? "bg-red-500 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {esp}
            </button>
          ))}
          {selectedRole && (
            <button
              onClick={() => setSelectedRole(null)}
              className="px-4 py-2 rounded-full text-sm bg-gray-800 text-white"
            >
              Limpiar filtro
            </button>
          )}
        </div>
      </div>

      {/* Pestañas */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "general" ? "border-b-2 border-red-500 text-red-500" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Resumen General
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "roles" ? "border-b-2 border-red-500 text-red-500" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Análisis por Roles
          </button>
          <button
            onClick={() => setActiveTab("discapacidades")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "discapacidades"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Discapacidades
          </button>
        </div>
      </div>

      {/* Contenido de las pestañas */}
      <div className="mb-6">
        {activeTab === "general" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow border border-red-100">
                <p className="text-sm text-gray-500">Total de Turnos</p>
                <p className="text-2xl font-bold">{reporte.totalTurns}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border border-red-100">
                <p className="text-sm text-gray-500">Turnos Completados</p>
                <p className="text-2xl font-bold">{reporte.turnsCompleted}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border border-red-100">
                <p className="text-sm text-gray-500">Tiempo Promedio de Espera</p>
                <p className="text-2xl font-bold">{reporte.avarageWaitingTime}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border border-red-100">
                <p className="text-sm text-gray-500">Tiempo Promedio de Atención</p>
                <p className="text-2xl font-bold">{reporte.averageTimeAttention}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-red-100 mb-6">
              <h3 className="text-lg font-semibold mb-4">Distribución de Turnos por Especialidad</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareRoleData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {prepareRoleData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-red-100">
              <h3 className="text-lg font-semibold mb-4">Porcentaje de Turnos Completados por Especialidad</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareCompletionData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="value" name="Porcentaje Completado" fill="#FF6384" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "roles" && (
          <div>
            <div className="bg-white p-4 rounded-lg shadow border border-red-100 mb-6">
              <h3 className="text-lg font-semibold mb-4">Distribución de Turnos por Especialidad</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Especialidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Porcentaje de Turnos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Porcentaje Completados
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(reporte.turnPercentageByRole).map(([role, percentage]) => (
                      <tr key={role}>
                        <td className="px-6 py-4 whitespace-nowrap">{role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{percentage}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">{reporte.completedPercentageByRole[role]}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "discapacidades" && (
          <div>
            {selectedRole ? (
              <div className="bg-white p-4 rounded-lg shadow border border-red-100">
                <h3 className="text-lg font-semibold mb-4">Distribución de Discapacidades en {selectedRole}</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareDisabilityData()}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {prepareDisabilityData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center border border-red-100">
                <p className="text-lg text-gray-500">
                  Selecciona una especialidad para ver la distribución de discapacidades
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Analisis
