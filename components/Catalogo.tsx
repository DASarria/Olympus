import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import Filtro from '../components/Filtro';
import FiltroAvanzado from '../components/FiltroAvanzado';

import balonfut from '../assets/images/balonfut.png';
import balonbasquet from '../assets/images/balonbasquet.png';
import raqueta from '../assets/images/raqueta.jpg';
import pingpong from '../assets/images/pingpong.png';
import cuerda from '../assets/images/cuerda.png';

// Definición de la interfaz Product
interface Product {
  id: string;
  name: string;
  description: string;
  imageSrc: any; // TODO: Replace 'any' with proper type after importing StaticImageData from 'next/image'
  status: 'disponible' | 'mantenimiento' | 'dañado';
  horariosDisponibles?: {
    manana: boolean;
    tarde: boolean;
    noche: boolean;
  };
}

// Datos de ejemplo (reemplazar con tus datos reales)
export const productosIniciales: Product[] = [
  {
    id: "001",
    name: "Balón de Fútbol",
    description: "Balón oficial de competición",
    imageSrc: balonfut,
    status: "disponible",
    horariosDisponibles: {
      manana: true,
      tarde: true,
      noche: false
    }
  },
  {
    id: "002",
    name: "Balón de Baloncesto",
    description: "Balón profesional de baloncesto, tamaño oficial",
    imageSrc: balonbasquet,
    status: "disponible"
  },
  {
    id: "003",
    name: "Raqueta de Tenis",
    description: "Raqueta profesional con cordaje de alta tensión",
    imageSrc: raqueta,
    status: "mantenimiento"
  },
  {
    id: "003",
    name: "Raquetas de Ping pong",
    description: "Raquetas ping pong para entrenamiento",
    imageSrc: pingpong,
    status: "mantenimiento"
  },
  {
    id: "008",
    name: "Cuerda para Saltar",
    description: "Cuerda ajustable para entrenamiento cardiovascular",
    imageSrc: cuerda,
    status: "disponible"
  },
];

export default function CatalogoPage() {
  // Filtrar solo productos disponibles al inicializar
  const [productos, setProductos] = useState<Product[]>(
    productosIniciales.filter(p => p.status === 'disponible')
  );
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const router = useRouter();
  
  const handleFilter = (filteredProducts: Product[]) => {
    // Asegurar que solo se muestren productos disponibles después de filtrar
    setProductos(filteredProducts.filter(p => p.status === 'disponible'));
  };

  // Función para manejar la selección de productos
  const handleProductSelection = (product: Product) => {
    // Validación redundante (aunque ya no debería ser necesaria)
    if (product.status !== 'disponible') {
      return; // No debería ocurrir ya que solo mostramos disponibles
    }
    
    // Verificar si el producto ya está seleccionado
    const isSelected = selectedProducts.some(p => p.id === product.id);
    
    if (isSelected) {
      // Si ya está seleccionado, lo quitamos de la lista
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      // Si no está seleccionado y no hemos llegado al límite, lo añadimos
      if (selectedProducts.length < 3) {
        setSelectedProducts([...selectedProducts, product]);
      } else {
        alert('Solo puedes seleccionar un máximo de 3 productos');
      }
    }
  };
  
  // Función para ir a la página de reserva
  const handleReservar = () => {
    if (selectedProducts.length === 0) {
      alert('Debes seleccionar al menos un producto para reservar');
      return;
    }
    
    // Guardar los productos seleccionados en localStorage para accederlos en la página de reserva
    localStorage.setItem('productosSeleccionados', JSON.stringify(selectedProducts));
    
    // Navegar a la página de generación de reserva
    router.push('/prestamosDeportivos/generarReserva');
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Equipos Deportivos</h1>
      
      {/* Filtro de búsqueda por nombre */}
      <Filtro 
        products={productosIniciales.filter(p => p.status === 'disponible')} 
        onFilter={(filteredProducts) => {
          handleFilter(filteredProducts as Product[]);
        }}
      />
      {/* Filtro avanzado por ID y estado */}
      <FiltroAvanzado products={productosIniciales} onFilter={handleFilter} />

      {/* Información de selección */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          Productos seleccionados: {selectedProducts.length}/3
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Puedes seleccionar hasta 3 productos disponibles para reservar
        </p>
      </div>
      
      {/* Catálogo de productos */}
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {productos.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-32 w-full">
                <Image
                  src={product.imageSrc}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-2"
                />
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <span className="text-xs text-gray-500">ID: {product.id}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                
                {/* Etiqueta de estado y checkbox de selección */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.status === 'disponible' ? 'bg-green-100 text-green-800' :
                    product.status === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                  
                  {product.status === 'disponible' && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedProducts.some(p => p.id === product.id)}
                        onChange={() => handleProductSelection(product)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="ml-1 text-xs text-gray-600">Seleccionar</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mostrar horarios disponibles */}
              <div className="p-3 pt-0">
                <p className="text-xs font-medium mb-1">Horarios:</p>
                <div className="flex flex-wrap gap-1">
                  {product.horariosDisponibles?.manana && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Mañana</span>
                  )}
                  {product.horariosDisponibles?.tarde && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Tarde</span>
                  )}
                  {product.horariosDisponibles?.noche && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Noche</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      
      
      
      
      {/* Botón de reservar */}
      <div className="mt-8 mb-16 flex justify-center">
        <button
          onClick={handleReservar}
          disabled={selectedProducts.length === 0}
          className={`px-6 py-3 rounded-lg font-medium text-white ${
            selectedProducts.length > 0 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Reservar productos seleccionados ({selectedProducts.length})
        </button>
      </div>
      
      {/* Espacio adicional al final para permitir scroll completo */}
      <div className="h-24 md:h-16"></div>
    </div>
  );
}
