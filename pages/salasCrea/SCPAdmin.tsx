"use client"

import { useState, useEffect } from "react"
import type { StaticImageData } from "next/image"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation" // next/router está deprecated en Next.js 13+
import Image from "next/image"
import defaultImage from "../../assets/images/1imagen.jpg"
import uno from "../../assets/images/uno.webp"
import jenga from "../../assets/images/jenga.webp"
import monos from "../../assets/images/Monos.webp"
import ajedrez from "../../assets/images/Ajedrez.jpg"
import cranium from "../../assets/images/cranium.webp"
import { aUr } from "@/pages/api/salasCreaU"

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
  state: string
  people: number
}

interface Elemento {
  id: string
  nombre: string
  descripcion: string
  cantidad: number
  imagen: StaticImageData | string
}

interface Loan {
  id: string
  elementId: string
  state: string
  revId: string
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
  imagen: StaticImageData | string
}

const SCPAdmin = () => {
  const router = useRouter()
  const [elementoUsage, setElementoUsage] = useState<ElementoUsage[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedElement, setSelectedElement] = useState<ElementoUsage | null>(null)

  // Para crear préstamos:
  const [selectedReservaId, setSelectedReservaId] = useState<string>("")
  const [selectedElementId, setSelectedElementId] = useState<string>("")

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null
  const url = aUr

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
    if (!token) {
      setError("No hay token de autenticación.")
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)

      // Obtener reservas
      const revsResponse = await fetch(`${url}/revs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        cache: "no-store",
      })
      if (!revsResponse.ok) throw new Error("Error cargando reservas")
      const revsData: Reserva[] = await revsResponse.json()
      setReservas(revsData)

      // Obtener elementos
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

      // Obtener préstamos
      const loansResponse = await fetch(`${url}/loans`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        cache: "no-store",
      })
      if (!loansResponse.ok) throw new Error("Error cargando préstamos")
      const loansData: Loan[] = await loansResponse.json()
      setLoans(loansData)

      // Formatear elementos para uso interno
      const formattedElements: Elemento[] = elementsData
        .filter((el) => el.name)
        .map((el) => ({
          id: el.id,
          nombre: el.name,
          descripcion: el.description || "Sin descripción",
          cantidad: el.quantity || 0,
          // Pasa la importación completa de la imagen o default
          imagen: imagenesPorNombre[el.name] || defaultImage,
        }))

      processElementUsage(revsData, loansData, formattedElements)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Error cargando datos. Por favor, intente de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchData()
  }, [token, url])

  // Procesa el uso de elementos para mostrar estadísticas
  const processElementUsage = (
    reservas: Reserva[],
    loans: Loan[],
    elementos: Elemento[]
  ) => {
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

    // Filtramos loans activos (por ejemplo, que no estén en estado "PRESTAMO_DEVUELTO")
    const activeLoans = loans.filter((loan) => loan.state !== "PRESTAMO_DEVUELTO")

    // Para cada préstamo activo, buscamos la reserva correspondiente por revId
    activeLoans.forEach((loan) => {
      const reserva = reservas.find((r) => r.id === loan.revId)
      if (!reserva) return // si no hay reserva asociada, saltar

      const usage = usageMap.get(loan.elementId)
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

    setElementoUsage(Array.from(usageMap.values()).sort((a, b) => b.usageCount - a.usageCount))
  }

  // Filtra elementos según búsqueda
  const filteredElements = elementoUsage.filter((elemento) =>
    elemento.elementName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filtra reservas para mostrar solo vigentes o activas, por ejemplo estado "ACTIVA"
  const activeReservas = reservas.filter((r) => r.state === "RESERVA_CONFIRMADA")

  // Función para crear préstamo
  const handleCreateLoan = async () => {
  if (!selectedReservaId) {
    alert("Seleccione una reserva")
    return
  }
  if (!selectedElementId) {
    alert("Selecciona un elemento")
    return
  }

  console.log("Token:", token)
  console.log("URL:", `${url}/loans`)

  try {
    setLoading(true)
    const response = await fetch(`${url}/loans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        elementId: selectedElementId,
        revId: selectedReservaId,
        state: "PRESTAMO_PENDIENTE",
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Error al crear préstamo: ${text}`)
    }

    await fetchData()
    setSelectedElementId("")
    setSelectedReservaId("")
    alert("Préstamo creado exitosamente")
  } catch (error: any) {
    alert(error.message || "Error al crear préstamo")
  } finally {
    setLoading(false)
  }
}



  // Manejo para abrir modal de detalles
  const openModal = (elemento: ElementoUsage) => {
    setSelectedElement(elemento)
  }
  const closeModal = () => {
    setSelectedElement(null)
  }

  if (loading) {
    return <div className="p-6 text-center font-bold">Cargando datos...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-600 font-bold">{error}</div>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
      >
        <ArrowLeft className="inline-block mr-2" />
        Volver
      </button>

      <h1 className="text-2xl font-bold mb-4">Estadísticas de Préstamos de Elementos</h1>

      <input
        type="text"
        placeholder="Buscar elemento"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-2 border rounded w-full max-w-md"
      />

      <div className="mb-8">
        <h2 className="font-semibold mb-2">Crear nuevo préstamo</h2>
        <select
          value={selectedReservaId}
          onChange={(e) => setSelectedReservaId(e.target.value)}
          className="mr-4 p-2 border rounded"
        >
          <option value="">Selecciona una reserva activa</option>
          {activeReservas.map((reserva) => (
            <option key={reserva.id} value={reserva.id}>
              {reserva.userName} - {reserva.date.day} {reserva.date.time}
            </option>
          ))}
        </select>

        <select
          value={selectedElementId}
          onChange={(e) => setSelectedElementId(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Selecciona un elemento</option>
          {elementoUsage.map((el) => (
            <option key={el.elementId} value={el.elementId}>
              {el.elementName} (Prestados: {el.usageCount})
            </option>
          ))}
        </select>

        <button
          onClick={handleCreateLoan}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Crear préstamo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredElements.map((elemento) => (
          <div
            key={elemento.elementId}
            className="border rounded p-4 cursor-pointer hover:shadow-lg"
            onClick={() => openModal(elemento)}
          >
            <h3 className="text-lg font-semibold mb-2">{elemento.elementName}</h3>
            <Image
              src={elemento.imagen}
              alt={`Imagen de ${elemento.elementName}`}
              width={300}
              height={200}
              className="rounded"
            />
            <p>Total veces prestado: {elemento.usageCount}</p>
            <p>Último uso: {elemento.lastUsed || "Nunca"}</p>
          </div>
        ))}
      </div>

      {/* Modal detalles elemento */}
      {selectedElement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-red-600 font-bold text-xl"
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-2">{selectedElement.elementName}</h3>
            <Image
              src={selectedElement.imagen}
              width={300}
              height={200}
              alt={`Imagen de ${selectedElement.elementName}`}
              className="mb-3 rounded"
            />
            <p className="mb-2 font-medium">Total veces prestado: {selectedElement.usageCount}</p>
            <p className="mb-2 font-medium">Último uso: {selectedElement.lastUsed || "Nunca"}</p>
            <h4 className="font-semibold mt-4 mb-1">Usuarios:</h4>
            <ul className="list-disc ml-5 max-h-48 overflow-auto">
              {selectedElement.borrowers.map((b, idx) => (
                <li key={idx}>
                  {b.userName} – {b.date}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default SCPAdmin
