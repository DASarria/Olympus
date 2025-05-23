"use client"

import { useState, useEffect } from "react"
import type { StaticImageData } from "next/image"
import { ArrowLeft} from "lucide-react"
import { useRouter } from "next/router"
import Image from "next/image"
import defaultImage from "../../assets/images/1imagen.jpg"
import uno from "../../assets/images/uno.webp"
import jenga from "../../assets/images/jenga.webp"
import monos from "../../assets/images/Monos.webp"
import ajedrez from "../../assets/images/Ajedrez.jpg"
import cranium from "../../assets/images/cranium.webp"

interface Reserva {
  id: string
  userName: string
  userId: string
  role: string
  date: {
    day: string
    time: string
  }
  roomId: string
  loans: string[]
  state: string
  people: number
}

interface Elemento {
  id: string
  nombre: string
  descripcion: string
  cantidad: number
  imagen: string
}

interface ElementoUsage {
  elementId: string
  elementName: string
  usageCount: number
  lastUsed: string
  borrowers: {
    userId: string
    userName: string
    date: string
  }[]
  imagen: string
}

const SCPAdmin = () => {
  const router = useRouter()
  const [elementoUsage, setElementoUsage] = useState<ElementoUsage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedElement, setSelectedElement] = useState<ElementoUsage | null>(null)
  const [dateFilter] = useState<string>("")

  const token = sessionStorage.getItem("token")
  const url = process.env.NEXT_PUBLIC_API_URL

  const imagenesPorNombre: Record<string, StaticImageData> = {
    Uno: uno,
    Jenga: jenga,
    Ajedrez: ajedrez,
    Cranium: cranium,
    Monos: monos,
  }


  interface ElementoAPI {
    id: string
    name: string
    description?: string
    quantity?: number
  }

  const fetchData = async () => {
    try {
      const revsResponse = await fetch(`${url}/revs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        cache: "no-store",
      })
      if (!revsResponse.ok) throw new Error("Error cargando reservas")

      const revsData = await revsResponse.json()

      const elementsResponse = await fetch(`${url}/elements`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        cache: "no-store",
      })
      if (!elementsResponse.ok) throw new Error("Error cargando elementos")

      const elementsData: ElementoAPI[] = await elementsResponse.json()

      const formattedElements: Elemento[] = elementsData
        .filter((el) => el.name)
        .map((el) => ({
          id: el.id,
          nombre: el.name,
          descripcion: el.description || "Sin descripción",
          cantidad: el.quantity || 0,
          imagen: imagenesPorNombre[el.name]?.src || defaultImage.src,
        }))

      processElementUsage(revsData, formattedElements)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Error cargando datos. Por favor, intente de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token, url])

  const processElementUsage = (reservas: Reserva[], elementos: Elemento[]) => {
    const usageMap = new Map<string, ElementoUsage>()

    elementos.forEach((elemento) => {
      usageMap.set(elemento.id, {
        elementId: elemento.id,
        elementName: elemento.nombre,
        usageCount: 0,
        lastUsed: "",
        borrowers: [],
        imagen: elemento.imagen,
      })
    })

    reservas.forEach((reserva) => {
      reserva.loans.forEach((loanId) => {
        const usage = usageMap.get(loanId)
        if (usage) {
          usage.usageCount += 1
          const reservaDate = reserva.date.day
          if (!usage.lastUsed || new Date(reservaDate) > new Date(usage.lastUsed)) {
            usage.lastUsed = reservaDate
          }
          usage.borrowers.push({
            userId: reserva.userId,
            userName: reserva.userName,
            date: `${reserva.date.day} ${reserva.date.time}`,
          })
        }
      })
    })

    setElementoUsage(Array.from(usageMap.values()).sort((a, b) => b.usageCount - a.usageCount))
  }

  const filteredElements = elementoUsage.filter((elemento) => {
    const matchesSearch = elemento.elementName.toLowerCase().includes(searchTerm.toLowerCase())
    if (!dateFilter) return matchesSearch
    return matchesSearch && elemento.borrowers.some((b) => b.date.includes(dateFilter))
  })

  const handleElementClick = (elemento: ElementoUsage) => {
    setSelectedElement(elemento)
  }

  const closeModal = () => {
    setSelectedElement(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
          <p>{error}</p>
        </div>
      </div>
    )
  }
  const irAlInicio = () => {
    router.back();
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex gap-5 font-bold text-[30px] ml-6 mb-6">
  <ArrowLeft onClick={irAlInicio} className="cursor-pointer mt-3" />
  <h1>Préstamos</h1>
</div>


      <input
        type="text"
        placeholder="Buscar elemento..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-3 w-full border rounded-xl shadow-sm"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 border-b border-gray-300 text-left">Imagen</th>
              <th className="p-4 border-b border-gray-300 text-left">Nombre</th>
              <th className="p-4 border-b border-gray-300 text-left">Cantidad Uso</th>
              <th className="p-4 border-b border-gray-300 text-left">Último Uso</th>
            </tr>
          </thead>
          <tbody>
            {filteredElements.map((el) => (
              <tr
                key={el.elementId}
                onClick={() => handleElementClick(el)}
                className="hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="p-4 border-b border-gray-200">
                  <Image src={el.imagen} alt={el.elementName} width={50} height={50} className="rounded-md" />
                </td>
                <td className="p-4 border-b border-gray-200">{el.elementName}</td>
                <td className="p-4 border-b border-gray-200">{el.usageCount}</td>
                <td className="p-4 border-b border-gray-200">{el.lastUsed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedElement && (
        <div onClick={closeModal} className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">{selectedElement.elementName}</h2>
            <Image src={selectedElement.imagen} alt={selectedElement.elementName} width={150} height={150} className="rounded-md mb-4" />
            <p><strong>Uso total:</strong> {selectedElement.usageCount}</p>
            <p><strong>Último uso:</strong> {selectedElement.lastUsed}</p>
            <h3 className="mt-4 font-medium">Préstamos:</h3>
            <ul className="list-disc pl-6 max-h-40 overflow-y-auto mt-2">
              {selectedElement.borrowers.map((b, i) => (
                <li key={i}>
                  {b.userName} - {b.date}
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SCPAdmin
