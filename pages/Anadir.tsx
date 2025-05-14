"use client"

import { useRouter } from "next/router"
import { useState, type ChangeEvent } from "react"

const Anadir = () => {
    const router = useRouter()
    // Update the state type to accept File or null
    const [file, setFile] = useState<File | null>(null)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = () => {
        // Here you would handle the file upload
        // Then navigate back or to another page
        router.push("/Contenido_Visual")
    }

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="mb-6 flex items-center gap-2">
                <button onClick={() => router.back()} className="text-xl">
                    ←
                </button>
                <h1 className="text-2xl font-bold">Añadir</h1>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg max-w-md mx-auto mt-8">
                <div className="text-center mb-8">
                    <p className="text-lg">
                        Agregue archivos multimedia para poder visualizarlos en la pantalla de sala de espera
                    </p>
                </div>

                <div className="flex justify-center mb-10">
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="bg-white border border-gray-300 py-2 px-6 rounded text-center">ARCHIVO</div>
                        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                </div>

                <div className="flex justify-between mt-8">
                    <button onClick={() => router.back()} className="bg-gray-400 text-black px-6 py-2 rounded">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="bg-blue-500 text-white px-6 py-2 rounded" disabled={!file}>
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Anadir;


