// components/Filtro.tsx
import { useState } from 'react';

// Define a proper interface for your products
interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: 'disponible' | 'mantenimiento' | 'dañado';
  horariosDisponibles?: {
    manana: boolean;
    tarde: boolean;
    noche: boolean;
  };
}

interface FiltroProps {
  products: Product[];
  onFilter: (filteredProducts: Product[]) => void;
}

export default function Filtro({ products, onFilter }: FiltroProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
    
    onFilter(filtered);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Buscar por nombre o descripción..."
        className="w-full p-2 border border-gray-300 rounded"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
}