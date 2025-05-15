import { useState, useEffect } from "react"
import Image from "next/image"
import { url } from "inspector"
import imagen1 from "../assets/images/1imagen.jpg";
import imagen2 from "../assets/images/2imagen.jpg";
import imagen3 from "../assets/images/3imagen.jpg";



export default function SalaDeEspera() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    {
      id: 1,
      name: "Horarios de atención.png",
      url: imagen1,
    },

    {
      id: 2,
      name: "Horarios de atención.png",
      url: imagen2,
    },

    {
      id: 3,
      name: "Horarios de atención.png",
      url: imagen3,
    },
  ]
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

    // Cambiar automáticamente la diapositiva cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-red-600 text-white p-4">
        <h1 className="text-2xl font-bold">SALA DE ESPERA</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {/* Carousel */}
        <div className="relative bg-white-100 rounded-lg mb-6 overflow-hidden">
          <div className="relative h-64 md:h-80">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={slides[currentSlide].url || "/placeholder.svg"}
                alt={slides[currentSlide].name}
                width={600}
                height={300}
                className="max-w-full h-auto"
              />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
              aria-label="Anterior"
            >
              <span className="text-xl">&lt;</span>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
              aria-label="Siguiente"
            >
              <span className="text-xl">&gt;</span>
            </button>
          </div>

          {/* Caption */}
          <div className="text-center pb-3 text-sm text-gray-600">{slides[currentSlide].name}</div>
        </div>

        {/* Turnos Section */}
        <div className="grid grid-cols-4 gap-4">
          {/* First column - Labels */}
          <div className="space-y-4">
            <div className="bg-gray-100 h-12 rounded-md"></div>
            <div className="bg-slate-600 text-white p-4 rounded-md flex items-center justify-center">
              <span className="font-medium">Turno actual</span>
            </div>
            <div className="bg-slate-600 text-white p-4 rounded-md flex items-center justify-center">
              <span className="font-medium">Próximos turnos</span>
            </div>
            <div className="bg-gray-100 h-12 rounded-md"></div>
            <div className="bg-gray-100 h-12 rounded-md"></div>
          </div>

          {/* Second column - Medicina General */}
          <div className="space-y-4">
            <div className="bg-slate-600 text-white p-3 rounded-md flex items-center justify-center">
              <span className="font-medium">Medicina General</span>
            </div>
            <div className="bg-blue-400 text-white p-3 rounded-md">
              <div className="text-center">
                <div className="text-lg font-bold">M - 001</div>
                <div>Nicolás Toro Criollo</div>
              </div>
            </div>
            <div className="bg-white border rounded-md p-3 shadow-sm">
              <div className="text-center">
                <div className="text-gray-800">Ana María Gómez</div>
                <div className="text-gray-500 text-sm">M - 002</div>
              </div>
            </div>
            <div className="bg-white border rounded-md p-3 shadow-sm">
              <div className="text-center">
                <div className="text-gray-800">Carlos Rodríguez</div>
                <div className="text-gray-500 text-sm">M - 003</div>
              </div>
            </div>
          </div>

          {/* Third column - Odontología */}
          <div className="space-y-4">
            <div className="bg-slate-600 text-white p-3 rounded-md flex items-center justify-center">
              <span className="font-medium">Odontología</span>
            </div>
            <div className="bg-blue-400 text-white p-3 rounded-md">
              <div className="text-center">
                <div className="text-lg font-bold">O - 001</div>
                <div>Laura Martínez</div>
              </div>
            </div>
            <div className="bg-white border rounded-md p-3 shadow-sm">
              <div className="text-center">
                <div className="text-gray-800">Pedro Sánchez</div>
                <div className="text-gray-500 text-sm">O - 002</div>
              </div>
            </div>
            <div className="bg-white border rounded-md p-3 shadow-sm">
              <div className="text-center">
                <div className="text-gray-800">María Fernández</div>
                <div className="text-gray-500 text-sm">O - 003</div>
              </div>
            </div>
          </div>

          {/* Fourth column - Psicología */}
          <div className="space-y-4">
            <div className="bg-slate-600 text-white p-3 rounded-md flex items-center justify-center">
              <span className="font-medium">Psicología</span>
            </div>
            <div className="bg-blue-400 text-white p-3 rounded-md">
              <div className="text-center">
                <div className="text-lg font-bold">P - 001</div>
                <div>Juan Pérez</div>
              </div>
            </div>
            <div className="bg-white border rounded-md p-3 shadow-sm">
              <div className="text-center">
                <div className="text-gray-800">Sofía López</div>
                <div className="text-gray-500 text-sm">P - 002</div>
              </div>
            </div>
            <div className="bg-white border rounded-md p-3 shadow-sm">
              <div className="text-center">
                <div className="text-gray-800">Daniel Torres</div>
                <div className="text-gray-500 text-sm">P - 003</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}