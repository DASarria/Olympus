import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MuscleGroupSelectorProps {
  onSelect: (zoneId: number) => void;
  selectedMuscleGroup: number | null;
  zoneMap: Record<number, string>;
}

const MuscleGroupSelector: React.FC<MuscleGroupSelectorProps> = ({ 
  onSelect,
  selectedMuscleGroup,
  zoneMap
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleSelect = (zoneId: number) => {
    onSelect(zoneId);
    setIsOpen(false);
  };
  
  // Handle showing all muscle groups
  const handleShowAll = () => {
    onSelect(null as unknown as number); // Cast to meet the interface requirements
    setIsOpen(false);
  };

  return (
    <div className="relative w-full mb-4" ref={dropdownRef}>      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <span>
          {selectedMuscleGroup ? 
            `Grupo muscular seleccionado: ${zoneMap[selectedMuscleGroup]}` : 
            'Selecciona un grupo muscular'}
        </span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2 bg-gray-100 border-b border-gray-200">
            <p className="text-sm text-gray-600">Selecciona el número para ver ejercicios de acuerdo a la zona muscular</p>
          </div>
          <div className="max-h-60 overflow-y-auto">
            <ul>
              {Object.entries(zoneMap).map(([zoneId, label]) => (
                <li key={zoneId}>
                  <button
                    onClick={() => handleSelect(parseInt(zoneId))}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      selectedMuscleGroup === parseInt(zoneId) ? 'bg-purple-100 font-medium' : ''
                    }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>          {selectedMuscleGroup && (
            <div className="p-2 border-t border-gray-200">
              <button 
                onClick={handleShowAll}
                className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
              >
                Mostrar todos los grupos musculares
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MuscleGroupSelector;
