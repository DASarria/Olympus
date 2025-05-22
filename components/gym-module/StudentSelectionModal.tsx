import React, { useState, useEffect } from 'react';
import { Student } from '@/types/gym/physicalTracking';
import { getAllUsers, getMockStudents, getAllStudents } from '@/api/gym-module/userService';

interface StudentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (student: Student) => void;
}

const StudentSelectionModal: React.FC<StudentSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectStudent 
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Cargar la lista de estudiantes cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  // Función para obtener estudiantes
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Intentar obtener el ID del trainer actual
      const trainerId = typeof window !== 'undefined' ? sessionStorage.getItem("id") : null;
      
      let studentsList: Student[] = [];
      
      if (trainerId) {
        // Primero intentar obtener estudiantes asignados al entrenador
        try {
          studentsList = await getAllStudents();
        } catch (err) {
          console.warn("No se pudieron obtener estudiantes del entrenador, intentando con todos los usuarios");
          studentsList = await getAllUsers();
          // Filtrar solo estudiantes (no entrenadores)
          studentsList = studentsList.filter((user: Student) => user.role !== 'TRAINER' && !user.isTrainer);
        }
      } else {
        // Si no hay trainerId, obtener todos los usuarios
        studentsList = await getAllUsers();
        // Filtrar solo estudiantes (no entrenadores)
        studentsList = studentsList.filter(user => user.role !== 'TRAINER' && !user.isTrainer);
      }
      
      // Si no se obtuvieron estudiantes, usar datos simulados
      if (studentsList.length === 0) {
        console.warn("No se encontraron estudiantes reales, usando datos simulados");
        studentsList = getMockStudents().filter(user => user.role !== 'TRAINER' && !user.isTrainer);
      }
      
      setStudents(studentsList);
    } catch (err) {
      console.error('Error al cargar estudiantes:', err);
      setError('No se pudieron cargar los estudiantes. Intente de nuevo más tarde.');
      
      // Datos simulados para fallback
      setStudents(getMockStudents().filter((user: Student) => user.role !== 'TRAINER' && !user.isTrainer));
    } finally {
      setLoading(false);
    }
  };

  // Filtrar estudiantes según término de búsqueda
  const filteredStudents = students.filter(student => 
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.institutionalId?.includes(searchTerm)
  );

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#eaeaea] px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Seleccionar Estudiante</h2>
        </div>
        
        {/* Search Bar */}
        <div className="px-6 pt-4">
          <input
            type="text"
            placeholder="Buscar por nombre o ID institucional..."
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Student List */}
        <div className="px-6 py-4 h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-10 h-10 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No se encontraron estudiantes</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map(student => (
                <div 
                  key={student.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelectStudent(student)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{student.name}</h3>
                      <p className="text-sm text-gray-600">ID: {student.institutionalId}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg mr-2 hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSelectionModal;