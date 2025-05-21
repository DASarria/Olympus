// components/Catalogo.tsx
import { useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from 'next/router';
import Filtro from './Filtro';
import FiltroAvanzado from './FiltroAvanzado';
import ArticleService from '../services/articleService';

// Definición de la interfaz Product actualizada
interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string; // Cambiado para coincidir con el backend
  status: 'disponible' | 'mantenimiento' | 'dañado';
  horariosDisponibles?: {
    manana: boolean;
    tarde: boolean;
    noche: boolean;
  };
}

// Definición de la interfaz Article del backend
interface Article {
  id: number;
  name: string;
  description: string;
  articleStatus: string;
  imageUrl: string;
}

// Imágenes por defecto
import balonfut from '../assets/images/balonfut.png';
import balonbasquet from '../assets/images/balonbasquet.png';
import raqueta from '../assets/images/raqueta.jpg';
import pingpong from '../assets/images/pingpong.png';
import cuerda from '../assets/images/cuerda.png';

const defaultImages: Record<string, string> = {
  'Balón de Fútbol': balonfut.src,
  'Balón de Baloncesto': balonbasquet.src,
  'Raqueta de Tenis': raqueta.src,
  'Raquetas de Ping pong': pingpong.src,
  'Cuerda para Saltar': cuerda.src
};

export default function CatalogoPage() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [productosIniciales, setProductosIniciales] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articles = await ArticleService.getAvailableArticles();
        
        const mappedProducts: Product[] = articles.map((article: Article) => {
          // Mapear el estado del backend al usado en el frontend
          let status: 'disponible' | 'mantenimiento' | 'dañado';
          switch(article.articleStatus.toLowerCase()) {
            case 'disponible':
              status = 'disponible';
              break;
            case 'requiremantenimiento':
              status = 'mantenimiento';
              break;
            case 'dañado':
            case 'danado':
              status = 'dañado';
              break;
            default:
              status = 'mantenimiento'; // Valor por defecto
          }
          
          return {
            id: article.id.toString(),
            name: article.name,
            description: article.description,
            imageUrl: article.imageUrl || defaultImages[article.name] || balonfut.src,
            status,
            horariosDisponibles: {
              manana: true,
              tarde: true,
              noche: false
            }
          };
        });
        
        setProductosIniciales(mappedProducts);
        setProductos(mappedProducts);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los artículos');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchArticles();
  }, []);

  // Resto del código permanece igual...
  const handleFilter = (filteredProducts: Product[]) => {
    setProductos(filteredProducts.filter(p => p.status === 'disponible'));
  };

  const handleProductSelection = (product: Product) => {
    if (product.status !== 'disponible') return;
    
    const isSelected = selectedProducts.some(p => p.id === product.id);
    
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      if (selectedProducts.length < 3) {
        setSelectedProducts([...selectedProducts, product]);
      } else {
        alert('Solo puedes seleccionar un máximo de 3 productos');
      }
    }
  };
  
  const handleReservar = () => {
    if (selectedProducts.length === 0) {
      alert('Debes seleccionar al menos un producto para reservar');
      return;
    }
    
    localStorage.setItem('productosSeleccionados', JSON.stringify(selectedProducts));
    router.push('/prestamosDeportivos/generarReserva');
  };
  
  if (loading) return <div className="text-center py-10">Cargando catálogo...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Equipos Deportivos</h1>
      
      <Filtro 
        products={productosIniciales.filter(p => p.status === 'disponible')} 
        onFilter={handleFilter}
      />
      
      <FiltroAvanzado 
        products={productosIniciales.filter(p => p.status === 'disponible')} 
        onFilter={handleFilter} 
      />

      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          Productos seleccionados: {selectedProducts.length}/3
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Puedes seleccionar hasta 3 productos disponibles para reservar
        </p>
      </div>
      
      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {productos.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-32 w-full">
                <Image
                  src={product.imageUrl}
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
      
      <div className="h-24 md:h-16"></div>
    </div>
  );
}