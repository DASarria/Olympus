import { useState, useEffect } from "react";
import Image from "next/image";
import imagen1 from "../assets/images/1imagen.jpg";
import imagen2 from "../assets/images/2imagen.jpg";
import imagen3 from "../assets/images/3imagen.jpg";

export default function SalaDeEspera() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, name: "Horarios de atención", url: imagen1 },
    { id: 2, name: "Información importante", url: imagen2 },
    { id: 3, name: "Promociones de salud", url: imagen3 },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header fijo */}
      <header className="bg-red-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <h1 className="text-2xl font-bold text-center">SALA DE ESPERA</h1>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full space-y-6">
        {/* Carrusel de imágenes con fondo transparente */}
        <div className="relative rounded-lg shadow-lg overflow-hidden mt-2">
          <div className="relative h-64 md:h-96">
            <div className="absolute inset-0 flex items-center justify-center bg-transparent">
              <Image
                src={slides[currentSlide].url}
                alt={slides[currentSlide].name}
                width={800}
                height={400}
                className="object-contain w-full h-full"
                priority
              />
            </div>

            {/* Controles del carrusel */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-all z-20"
              aria-label="Anterior"
            >
              <span className="text-xl">&lt;</span>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-all z-20"
              aria-label="Siguiente"
            >
              <span className="text-xl">&gt;</span>
            </button>
          </div>
          <div className="text-center py-3 text-sm text-gray-600 bg-transparent">
            {slides[currentSlide].name}
          </div>
        </div>

        {/* Sección de turnos con scroll */}
        <div className="grid grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto pb-4">
          {/* Columna de títulos */}
          <div className="space-y-4">
            <div className="h-12"></div>
            <div className="bg-slate-700 text-white p-4 rounded-md h-[120px] flex items-center justify-center sticky top-0">
              <span className="font-medium text-center">Turno actual</span>
            </div>
            <div className="bg-slate-700 text-white p-4 rounded-md h-[120px] flex items-center justify-center sticky top-[136px]">
              <span className="font-medium text-center">Próximos turnos</span>
            </div>
          </div>

          {/* Columna Medicina General */}
          <div className="space-y-4">
            <div className="bg-slate-700 text-white p-3 rounded-md flex items-center justify-center h-12">
              <span className="font-medium">Medicina General</span>
            </div>
            <div className="bg-blue-500 text-white p-3 rounded-md h-[120px] flex flex-col justify-center items-center">
              <div className="text-lg font-bold">M - 001</div>
              <div className="text-center">Nicolás Toro Criollo</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-3 shadow-sm h-[120px] flex flex-col justify-center items-center">
              <div className="text-gray-800">Ana María Gómez</div>
              <div className="text-gray-500 text-sm">M - 002</div>
            </div>
          </div>

          {/* Columna Odontología */}
          <div className="space-y-4">
            <div className="bg-slate-700 text-white p-3 rounded-md flex items-center justify-center h-12">
              <span className="font-medium">Odontología</span>
            </div>
            <div className="bg-blue-500 text-white p-3 rounded-md h-[120px] flex flex-col justify-center items-center">
              <div className="text-lg font-bold">O - 001</div>
              <div className="text-center">Laura Martínez</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-3 shadow-sm h-[120px] flex flex-col justify-center items-center">
              <div className="text-gray-800">Pedro Sánchez</div>
              <div className="text-gray-500 text-sm">O - 002</div>
            </div>
          </div>

          {/* Columna Psicología */}
          <div className="space-y-4">
            <div className="bg-slate-700 text-white p-3 rounded-md flex items-center justify-center h-12">
              <span className="font-medium">Psicología</span>
            </div>
            <div className="bg-blue-500 text-white p-3 rounded-md h-[120px] flex flex-col justify-center items-center">
              <div className="text-lg font-bold">P - 001</div>
              <div className="text-center">Juan Pérez</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-3 shadow-sm h-[120px] flex flex-col justify-center items-center">
              <div className="text-gray-800">Sofía López</div>
              <div className="text-gray-500 text-sm">P - 002</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}