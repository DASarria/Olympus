import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '@/components/Layout';

interface Product {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  status: 'disponible' | 'mantenimiento' | 'dañado';
  estadoEquipo?: 'buen estado' | 'requiere mantenimiento' | 'dañado';
}

export default function GenerarReserva() {
  const [productosSeleccionados, setProductosSeleccionados] = useState<Product[]>([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const productosGuardados = localStorage.getItem('productosSeleccionados');
    if (productosGuardados) {
      const productos = JSON.parse(productosGuardados);
      const productosConEstado = productos.map((producto: Product) => ({
        ...producto,
        estadoEquipo: 'buen estado'
      }));
      setProductosSeleccionados(productosConEstado);
    } else {
      router.push('/catalogo');
    }
  }, [router]);

  const getImagePath = (imageName: string) => {
    try {
      const cleanImageName = imageName.replace(/^\/+/, '');
      return `/assets/images/${cleanImageName}`;
    } catch (error) {
      console.error(`Error with image path: ${imageName}`, error);
      return '/assets/images/placeholder.png';
    }   
  };

  const actualizarEstadoEquipo = (id: string, nuevoEstado: 'buen estado' | 'requiere mantenimiento' | 'dañado') => {
    setProductosSeleccionados(prevProductos => 
      prevProductos.map(producto => 
        producto.id === id ? { ...producto, estadoEquipo: nuevoEstado } : producto
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!horaInicio || !horaFin) {
      alert('Por favor completa las horas de inicio y fin');
      return;
    }
    
    const datosReserva = {
      horas: {
        inicio: horaInicio,
        fin: horaFin
      },
      productos: productosSeleccionados,
      fecha: new Date().toISOString()
    };
    
    // Guardar reserva en localStorage
    const reservasPrevias = JSON.parse(localStorage.getItem('reservas') || '[]');
    localStorage.setItem('reservas', JSON.stringify([...reservasPrevias, datosReserva]));
    
    console.log('Datos de la reserva:', datosReserva);
    alert('¡Reserva generada con éxito!');
    
    localStorage.removeItem('productosSeleccionados');
    router.push('/prestamosDeportivos/Prestamos');
};

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Generar Reserva</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Productos Seleccionados</h2>
          
          {productosSeleccionados.length > 0 ? (
            <div className="space-y-4 mb-6">
              {productosSeleccionados.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="relative h-16 w-16 mr-3">
                      <Image
                        src={getImagePath(product.imageSrc)}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-500">ID: {product.id}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <label htmlFor={`estado-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Estado del equipo
                    </label>
                    <select
                      id={`estado-${product.id}`}
                      value={product.estadoEquipo}
                      onChange={(e) => actualizarEstadoEquipo(
                        product.id, 
                        e.target.value as 'buen estado' | 'requiere mantenimiento' | 'dañado'
                      )}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="buen estado">Buen estado</option>
                      <option value="requiere mantenimiento">Requiere mantenimiento</option>
                      <option value="dañado">Dañado</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-4">No hay productos seleccionados</p>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="horaInicio" className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de inicio
                </label>
                <input
                  type="time"
                  id="horaInicio"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="horaFin" className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de fin
                </label>
                <input
                  type="time"
                  id="horaFin"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => router.push('prestamosDeportivos/catalogo')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirmar Reserva
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}