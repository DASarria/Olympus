"use client";
import { useState, useCallback } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;  // Changed from imageSrc to imageUrl
  status: 'disponible' | 'mantenimiento' | 'dañado';
  horariosDisponibles?: {
    manana: boolean;
    tarde: boolean;
    noche: boolean;
  };
}

interface FiltroAvanzadoProps {
  products: Product[];
  onFilter: (filteredProducts: Product[]) => void;
}

export default function FiltroAvanzado({ products, onFilter }: FiltroAvanzadoProps) {
  const [idFilter, setIdFilter] = useState("");
  const [horaFilter, setHoraFilter] = useState<string>("");

  const handleFilter = useCallback(() => {
    let filtered = [...products];

    // Filtrar por ID
    if (idFilter) {
      filtered = filtered.filter(product => 
        product.id.toLowerCase().includes(idFilter.toLowerCase())
      );
    }

    // Filtrar por franja horaria (lógica a implementar según necesidades)
    if (horaFilter) {
      // Aquí iría la lógica para filtrar por franja horaria
      // Por ahora solo es un placeholder
      filtered = filtered.filter(product => true);
    }

    onFilter(filtered);
  }, [products, idFilter, horaFilter, onFilter]);

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium mb-3">Filtros avanzados</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtro por ID */}
        <div>
          <label htmlFor="id-filter" className="block text-sm font-medium text-gray-700 mb-1">
            ID del producto
          </label>
          <input
            id="id-filter"
            type="text"
            placeholder="Buscar por ID..."
            value={idFilter}
            onChange={(e) => {
              setIdFilter(e.target.value);
              handleFilter();
            }}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          />
        </div>

        {/* Filtro por franja horaria */}
        <div>
          <label htmlFor="hora-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Franja horaria
          </label>
          <select
            id="hora-filter"
            value={horaFilter}
            onChange={(e) => {
              setHoraFilter(e.target.value);
              handleFilter();
            }}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">Todas las horas</option>
            <option value="manana">Mañana (8am - 12pm)</option>
            <option value="tarde">Tarde (1pm - 5pm)</option>
            <option value="noche">Noche (6pm - 9pm)</option>
          </select>
        </div>
      </div>
    </div>
  );
}