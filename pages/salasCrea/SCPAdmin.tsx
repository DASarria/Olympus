"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, Calendar } from "lucide-react"
import { useRouter } from "next/router"
import Image from "next/image"
import defaultImage from "../../assets/images/1imagen.jpg"
import uno from "../../assets/images/uno.webp"
import jenga from "../../assets/images/jenga.webp"
import monos from "../../assets/images/Monos.webp"
import ajedrez from "../../assets/images/Ajedrez.jpg"
import cranium from "../../assets/images/cranium.webp"

// Define types for our data
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
  loans: string[] // Element IDs that were borrowed
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
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [elementos, setElementos] = useState<Elemento[]>([])
  const [elementoUsage, setElementoUsage] = useState<ElementoUsage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedElement, setSelectedElement] = useState<ElementoUsage | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "stats">("list")
  const [dateFilter, setDateFilter] = useState<string>("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const token = sessionStorage.getItem("token")
  const url = process.env.NEXT_PUBLIC_API_URL

  const imagenesPorNombre: Record<string, any> = {
    Uno: uno,
    Jenga: jenga,
    Ajedrez: ajedrez,
    Cranium: cranium,
    Monos: monos,
  }

  const handleClickBack = () => {
    router.back()
  }



  // Fetch both reservations and elements data
  const fetchData = async () => {
    try {
      console.log("SCPAdmin: Obteniendo datos...")
      // Fetch reservations
      const revsResponse = await fetch(`${url}/revs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // Evitar caché
      })

      if (!revsResponse.ok) {
        throw new Error("Error cargando reservas: " + revsResponse.statusText)
      }

      const revsData = await revsResponse.json()
      console.log("SCPAdmin: Reservas obtenidas:", revsData)

      // Verificar que las reservas tienen sus préstamos
      revsData.forEach((reserva: Reserva) => {
        console.log(`SCPAdmin: Reserva ${reserva.id} - Préstamos:`, reserva.loans)
      })

      setReservas(revsData)

      // Fetch elements
      const elementsResponse = await fetch(`${url}/elements`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // Evitar caché
      })

      if (!elementsResponse.ok) {
        throw new Error("Error cargando elementos: " + elementsResponse.statusText)
      }

      const elementsData = await elementsResponse.json()
      const formattedElements = elementsData
        .filter((el: any) => el.name)
        .map((el: any) => ({
          id: el.id,
          nombre: el.name,
          descripcion: el.description || "Sin descripción",
          cantidad: el.quantity || 0,
          imagen: imagenesPorNombre[el.name] ? imagenesPorNombre[el.name].src : defaultImage.src,
        }))

      setElementos(formattedElements)

      // Process data to get element usage statistics
      processElementUsage(revsData, formattedElements)

      // Actualizar la hora de última actualización
      setLastUpdated(new Date())
    } catch (error) {
      console.error("SCPAdmin: Error fetching data:", error)
      setError("Error cargando datos. Por favor, intente de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  // Initial data load
  useEffect(() => {
    fetchData()
  }, [])

  // Process the data to get element usage statistics
  const processElementUsage = (reservas: Reserva[], elementos: Elemento[]) => {
    console.log("SCPAdmin: Procesando uso de elementos...")
    console.log("SCPAdmin: Reservas para procesar:", reservas)
    console.log("SCPAdmin: Elementos disponibles:", elementos)

    const usageMap = new Map<string, ElementoUsage>()

    // Initialize usage map with all elements
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

    // Process each reservation to count element usage
    reservas.forEach((reserva) => {
      if (reserva.loans && reserva.loans.length > 0) {
        console.log(`SCPAdmin: Procesando préstamos de reserva ${reserva.id}:`, reserva.loans)

        reserva.loans.forEach((loanId) => {
          const usage = usageMap.get(loanId)
          if (usage) {
            // Increment usage count
            usage.usageCount += 1

            // Update last used date if this is more recent
            const reservaDate = reserva.date.day
            if (!usage.lastUsed || new Date(reservaDate) > new Date(usage.lastUsed)) {
              usage.lastUsed = reservaDate
            }

            // Add borrower info
            usage.borrowers.push({
              userId: reserva.userId,
              userName: reserva.userName,
              date: `${reserva.date.day} ${reserva.date.time}`,
            })

            usageMap.set(loanId, usage)
          } else {
            console.warn(`SCPAdmin: Elemento con ID ${loanId} no encontrado en el mapa de uso`)
          }
        })
      }
    })

    // Convert map to array and sort by usage count (descending)
    const usageArray = Array.from(usageMap.values()).sort((a, b) => b.usageCount - a.usageCount)
    console.log("SCPAdmin: Estadísticas de uso procesadas:", usageArray)

    setElementoUsage(usageArray)
  }

  // Filter elements based on search term and date
  const filteredElements = elementoUsage.filter((elemento) => {
    const matchesSearch = elemento.elementName.toLowerCase().includes(searchTerm.toLowerCase())

    if (!dateFilter) return matchesSearch

    // Filter by date if dateFilter is set
    return matchesSearch && elemento.borrowers.some((borrower) => borrower.date.includes(dateFilter))
  })

  // Handle element selection for detailed view
  const handleElementClick = (elemento: ElementoUsage) => {
    setSelectedElement(elemento)
  }

  // Close the detail modal
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex gap-5 font-bold text-[30px] ml-6 mb-6">
        <ArrowLeft onClick={handleClickBack} className="cursor-pointer mt-3" />
        <h1>Préstamos de Elementos</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar elemento..."
              className="w-full px-4 py-2 rounded-xl bg-white drop-shadow-xl pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="date"
              className="w-full px-4 py-2 rounded-xl bg-white drop-shadow-xl pl-10"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-xl ${viewMode === "list" ? "bg-red-500 text-white" : "bg-white"} drop-shadow-xl`}
          >
            Lista
          </button>
          <button
            onClick={() => setViewMode("stats")}
            className={`px-4 py-2 rounded-xl ${viewMode === "stats" ? "bg-red-500 text-white" : "bg-white"} drop-shadow-xl`}
          >
            Estadísticas
          </button>
        </div>
      </div>

      {lastUpdated && (
        <div className="text-sm text-gray-500 mb-4 text-right">
          Última actualización: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {viewMode === "list" ? (
        <div className="bg-[#EAEAEA] p-4 rounded-2xl shadow-md">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-center border-separate border-spacing-y-3 border-spacing-x-3 drop-shadow-xl">
              <thead>
                <tr className="text-sm font-semibold drop-shadow-xl">
                  <th className="bg-white rounded-xl px-4 py-2">Elemento</th>
                  <th className="bg-white rounded-xl px-4 py-2">Veces Prestado</th>
                  <th className="bg-white rounded-xl px-4 py-2">Último Préstamo</th>
                  <th className="bg-white rounded-xl px-4 py-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredElements.map((elemento) => (
                  <tr
                    key={elemento.elementId}
                    className="bg-white rounded-xl hover:bg-[#990000] hover:text-white drop-shadow-xl"
                  >
                    <td className="px-4 py-2 rounded-xl flex items-center justify-center gap-2">
                      <div className="w-8 h-8 relative overflow-hidden rounded-full">
                        <Image
                          src={elemento.imagen || "/placeholder.svg"}
                          alt={elemento.elementName}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      {elemento.elementName}
                    </td>
                    <td className="px-4 py-2 rounded-xl">{elemento.usageCount}</td>
                    <td className="px-4 py-2 rounded-xl">{elemento.lastUsed || "Nunca"}</td>
                    <td className="rounded-xl">
                      <button className="px-4 py-1 rounded-full text-sm" onClick={() => handleElementClick(elemento)}>
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#EAEAEA] p-4 rounded-2xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredElements.map((elemento) => (
              <div
                key={elemento.elementId}
                className="bg-white p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleElementClick(elemento)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 relative overflow-hidden rounded-lg">
                    <Image
                      src={elemento.imagen || "/placeholder.svg"}
                      alt={elemento.elementName}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{elemento.elementName}</h3>
                    <p className="text-gray-600">Prestado {elemento.usageCount} veces</p>
                  </div>
                </div>

                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-red-500"
                    style={{ width: `${Math.min(elemento.usageCount * 10, 100)}%` }}
                  ></div>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  <p>Último préstamo: {elemento.lastUsed || "Nunca"}</p>
                  <p>Usuarios diferentes: {new Set(elemento.borrowers.map((b) => b.userId)).size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para ver detalles del elemento */}
      {selectedElement && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[700px] shadow-2xl relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 relative overflow-hidden rounded-lg">
                <Image
                  src={selectedElement.imagen || "/placeholder.svg"}
                  alt={selectedElement.elementName}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedElement.elementName}</h2>
                <p className="text-gray-600">Prestado {selectedElement.usageCount} veces en total</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Estadísticas de Uso</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-100 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-500">{selectedElement.usageCount}</p>
                  <p className="text-sm text-gray-600">Total Préstamos</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-500">
                    {new Set(selectedElement.borrowers.map((b) => b.userId)).size}
                  </p>
                  <p className="text-sm text-gray-600">Usuarios Diferentes</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-500">{selectedElement.lastUsed || "N/A"}</p>
                  <p className="text-sm text-gray-600">Último Préstamo</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Historial de Préstamos</h3>
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Usuario</th>
                      <th className="p-2 text-left">ID Usuario</th>
                      <th className="p-2 text-left">Fecha y Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedElement.borrowers.map((borrower, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="p-2">{borrower.userName}</td>
                        <td className="p-2">{borrower.userId}</td>
                        <td className="p-2">{borrower.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SCPAdmin
