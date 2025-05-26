import React from 'react';
import Layout from "@/components/Layout";

const Dashboard = () => {
    return (
        <div>
            <Layout>
                {/* Welcome Banner */}
                <div className="bg-red-500 text-white rounded-lg p-6 md:p-8 mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">ECI BIENESTAR TOTAL</h2>
                    <p className="text-base md:text-lg leading-relaxed">
                        Sistema integral para la gestión de servicios de bienestar universitario.
                        Centraliza turnos médicos, reservas de espacios, actividades extracurriculares
                        y préstamos deportivos para promover el bienestar de la comunidad académica.
                    </p>
                </div>

                {/* Project Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                    {/* About */}
                    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Sobre el Proyecto</h3>
                        <div className="space-y-3 md:space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-700 text-sm md:text-base">Universidad</h4>
                                <p className="text-gray-600 text-sm md:text-base">Escuela Colombiana de Ingeniería Julio Garavito</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 text-sm md:text-base">Programa</h4>
                                <p className="text-gray-600 text-sm md:text-base">Ingeniería de Sistemas</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 text-sm md:text-base">Asignatura</h4>
                                <p className="text-gray-600 text-sm md:text-base">Ciclos de Vida del Desarrollo de Software (CVDS)</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 text-sm md:text-base">Profesores</h4>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Ing. Rodrigo Gualtero<br/>
                                    Ing. Oscar Ospina<br/>
                                    Ing. Martin Cantor
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Información del Sistema</h3>
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm md:text-base">Módulos del Sistema</span>
                                <span className="font-bold text-xl md:text-2xl text-blue-600">7</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm md:text-base">Perfiles de Usuario</span>
                                <span className="font-bold text-xl md:text-2xl text-green-600">5</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm md:text-base">Especialidades Médicas</span>
                                <span className="font-bold text-xl md:text-2xl text-purple-600">3</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm md:text-base">Tipos de Servicios</span>
                                <span className="font-bold text-xl md:text-2xl text-orange-600">15+</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Objective */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-4 md:p-6 mb-6 md:mb-8">
                    <h3 className="text-lg md:text-xl font-bold mb-3">Objetivo del Sistema</h3>
                    <p className="text-sm md:text-base leading-relaxed">
                        Automatizar y centralizar la gestión de los servicios de bienestar universitario,
                        facilitando el acceso de los estudiantes a turnos, clases extracurriculares,
                        espacios de descanso, préstamos y estadísticas de uso. Esta solución promueve
                        hábitos saludables y una vida universitaria equilibrada, permitiendo a los
                        responsables del área de bienestar contar con información oportuna y relevante
                        para evaluar el impacto de estos servicios en la comunidad académica.
                    </p>
                </div>

                {/* User Profiles */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Perfiles de Usuario</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {[
                            { name: "Administrador del Sistema", desc: "Control total del sistema y gestión de usuarios" },
                            { name: "Estudiante", desc: "Acceso a servicios y consulta de estadísticas personales" },
                            { name: "Entrenador", desc: "Gestión de gimnasio, rutinas y planes alimenticios" },
                            { name: "Funcionario Bienestar", desc: "Supervisión de actividades y gestión de recursos" },
                            { name: "Secretaria Médica", desc: "Administración de agenda médica y coordinación de citas" }
                        ].map((profile, index) => (
                            <div key={index} className="p-3 md:p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">{profile.name}</h4>
                                <p className="text-xs md:text-sm text-gray-600">{profile.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Features */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-16 md:mb-20">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Características Principales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Servicios de Salud</h4>
                            <ul className="space-y-1 md:space-y-2 text-gray-600 text-xs md:text-sm">
                                <li>• Gestión de turnos para medicina general</li>
                                <li>• Atención odontológica especializada</li>
                                <li>• Servicios de psicología y bienestar mental</li>
                                <li>• Sistema de prioridades para casos especiales</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Espacios y Actividades</h4>
                            <ul className="space-y-1 md:space-y-2 text-gray-600 text-xs md:text-sm">
                                <li>• Reserva de salas de descanso y recreación</li>
                                <li>• Préstamo de elementos deportivos y recreativos</li>
                                <li>• Gestión de clases extracurriculares</li>
                                <li>• Control de asistencia a actividades</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Bienestar Físico</h4>
                            <ul className="space-y-1 md:space-y-2 text-gray-600 text-xs md:text-sm">
                                <li>• Reservas del gimnasio universitario</li>
                                <li>• Rutinas personalizadas por especialistas</li>
                                <li>• Seguimiento de progreso físico</li>
                                <li>• Planes alimenticios adaptados</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Administración</h4>
                            <ul className="space-y-1 md:space-y-2 text-gray-600 text-xs md:text-sm">
                                <li>• Reportes estadísticos detallados</li>
                                <li>• Gestión centralizada de usuarios</li>
                                <li>• Configuración de horarios y recursos</li>
                                <li>• Análisis de impacto de servicios</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    );
};

export default Dashboard;