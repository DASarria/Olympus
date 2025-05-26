// ✅ Archivo: SCPAdmin.tsx
"use client"

import { useState, useEffect } from "react"
import type { StaticImageData } from "next/image"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
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
  state: "PRESTAMO_PENDIENTE" | "PRESTAMO_DEVUELTO" | "DAMAGE_LOAN"
  revId: string
}

const SCPAdmin = () => {
  const router = useRouter()
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [elementos, setElementos] = useState<Elemento[]>([])
  const [prestamos, setPrestamos] = useState<Loan[]>([])
  const [selectedReservaId, setSelectedReservaId] = useState("")
  const [selectedElementId, setSelectedElementId] = useState("")
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null
  const url = aUr

  const imagenesPorNombre: Record<string, StaticImageData> = {
    Uno: uno,
    Jenga: jenga,
    Ajedrez: ajedrez,
    Cranium: cranium,
    Monos: monos,
  }

  const fetchData = async () => {
    if (!token) return
    const headers = {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    }
    const [resvRes, elemRes, loanRes] = await Promise.all([
      fetch(`${url}/revs`, { headers }),
      fetch(`${url}/elements`, { headers }),
      fetch(`${url}/loans`, { headers }),
    ])
    const resvs: Reserva[] = await resvRes.json()
    const elemsData = await elemRes.json()
    const loans: Loan[] = await loanRes.json()
    const formattedElems: Elemento[] = elemsData.map((el: { id: string; name: string; description?: string; quantity?: number }) => ({
      id: el.id,
      nombre: el.name,
      descripcion: el.description || "Sin descripción",
      cantidad: el.quantity ?? 0,
      imagen: imagenesPorNombre[el.name] || defaultImage,
    }))
    setReservas(resvs)
    setElementos(formattedElems)
    setPrestamos(loans)
  }

  

  const getDisponibles = (elementId: string) => {
    const total = elementos.find((e) => e.id === elementId)?.cantidad || 0
    return total
  }

  const handleCreateLoan = async () => {
    if (!selectedReservaId || !selectedElementId) return alert("Selecciona reserva y elemento")
    const disponibles = getDisponibles(selectedElementId)
    if (disponibles <= 0) return alert("No hay unidades disponibles de ese elemento")

    await fetch(`${url}/loans`, {
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

    // await updateElementoCantidad(selectedElementId, -1)
    setSelectedElementId("")
    setSelectedReservaId("")
    await fetchData()
    alert("Préstamo creado exitosamente")
  }

  const updateLoanState = async (loanId: string, newState: Loan["state"]) => {
    await fetch(`${url}/loans/state/${loanId}/${newState}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })


    await fetchData()
  }

  useEffect(() => {
    fetchData()

    const channel = new BroadcastChannel("reservas_channel")
    channel.onmessage = (event) =>{
      if(event.data === "reservas_actualizadas" || event.data === "estado_reservas_actualizadas"){
        fetchData()
      }
    }
    return () => {
    channel.close()
  }
  }, [])

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex gap-5 font-bold text-[30px] ml-6">
        <ArrowLeft onClick={() => router.back()} className="cursor-pointer mt-3" />
        <h1>Gestión de Préstamos</h1>
      </div>

      <div className="mb-4 col-2 flex gap-4">
        <div>
          <label>Reserva:</label>
          <select 
              value={selectedReservaId} 
              onChange={(e) => setSelectedReservaId(e.target.value)} 
              className="w-full p-2 bg-[#EAEAEA] rounded-xl">
            <option value="">Seleccione una reserva</option>
            {reservas.filter((r)=> r.state === "RESERVA_CONFIRMADA")
              .map((r) => (
              <option key={r.id} value={r.id}>
                {r.userName.toUpperCase()} - {r.userId}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Elemento:</label>
        <select 
          value={selectedElementId} 
          onChange={(e) => setSelectedElementId(e.target.value)} 
          className="w-full p-2 bg-[#EAEAEA] rounded-xl">
          <option value="">Seleccione un elemento</option>
          {elementos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre} (Cantidad total: {e.cantidad})
            </option>
          ))}
        </select>
        </div>
        
      </div>

      

      <button onClick={handleCreateLoan} className="bg-[#990000] text-white px-4 py-2 rounded-md hover:bg-[#b30000] transition-colors">
        Crear préstamo
      </button>

      <h2 className="text-xl font-bold mt-8 mb-2">Todos los préstamos</h2>
      <ul className="bg-[#EAEAEA] p-4 rounded-2xl shadow-md w-[60vw] overflow-y-auto max-h-[27vh] 2xl:max-h-[50vh]">
        {prestamos.map((p) => {
          const el = elementos.find((e) => e.id === p.elementId)
          const res = reservas.find((r) => r.id === p.revId)
          return (
            <li key={p.id} className="bg-white p-4 rounded-xl gap-4 mb-4 shadow-md flex items-center justify-between">
              <p>
                <strong>{el?.nombre || "Elemento Eliminado"}</strong><br /> {res?.userName.toUpperCase()}<br />
                Estado: <span className="font-semibold">{p.state}</span>
              </p>
              {p.state === "PRESTAMO_PENDIENTE" && (
                <div className="flex items-center justify-center gap-4">
                  <p className="flex-1"></p>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => updateLoanState(p.id, "PRESTAMO_DEVUELTO")} className="bg-[#990000] hover:bg-[#b30000] text-white px-2 py-1 rounded-md">
                      Devolver
                    </button>
                    <button onClick={() => updateLoanState(p.id, "DAMAGE_LOAN")} className="bg-[#990000] hover:bg-[#b30000] text-white px-2 py-1 rounded-md">
                      Reportar Daño
                    </button>
                  </div>
                </div>
              )}

            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SCPAdmin
