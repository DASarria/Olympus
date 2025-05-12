import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
}

interface CatalogoProps {
  products: Product[];
}

const Catalogo = ({ products }: CatalogoProps) => {
  // Helper function to get the correct image path
  const getImagePath = (imageName: string) => {
    try {
      // Remove any leading slashes to prevent double slashes
      const cleanImageName = imageName.replace(/^\/+/, '');
      return require(`../assets/images/${cleanImageName}`).default;
    } catch (error) {
      console.error(`Error loading image: ${imageName}`, error);
      return '/placeholder.png'; // Fallback image
    }   
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Catálogo de Equipos Deportivos</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="relative h-32 w-full">
              <Image
                src={getImagePath(product.imageSrc)}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-2"
              />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium">{product.name}</h3>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{product.description}</p>
              <Link 
                href={`/catalogo/${product.id}`} 
                className="mt-2 text-xs text-blue-600 hover:underline inline-block"
              >
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;
