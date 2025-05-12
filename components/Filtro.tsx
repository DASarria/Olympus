"use client";
import { useState, useCallback } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
}

interface FiltroProps {
  products: Product[];
  onFilter: (filteredProducts: Product[]) => void;
}

function normalizeString(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function Filtro({ products, onFilter }: FiltroProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback(
    (value: string) => {
      const normalizedSearchTerm = normalizeString(value);
      const filtered = products.filter((product) =>
        normalizeString(product.name).includes(normalizedSearchTerm)
      );
      onFilter(filtered);
    },
    [products, onFilter]
  );

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>
  );
}
