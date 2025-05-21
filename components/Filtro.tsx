// components/Filtro.tsx
import { useState } from 'react';

interface FiltroProps {
  products: any[];
  onFilter: (filteredProducts: any[]) => void;
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