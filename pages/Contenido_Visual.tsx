"use client"

import { useRouter } from "next/router"
import { useState } from "react"

const Contenido_Visual = () => {
    const router = useRouter()
    const [files, setFiles] = useState([
        { id: 1, name: "GYM.png" },
        { id: 2, name: "Bienestar.png" },
        { id: 3, name: "Eficiencia.png" },
        { id: 4, name: "GYM-02.png" },
        { id: 5, name: "GYM-02.png" },
        { id: 6, name: "GYM-02.png" },
        { id: 7, name: "GYM-02.png" },
        { id: 8, name: "GYM-02.png" },
        { id: 9, name: "GYM-02.png" },
        { id: 10, name: "GYM-02.png" },
        { id: 11, name: "GYM-02.png" },
        { id: 12, name: "GYM-02.png" },
    ])

    const handleDelete = (id: number) => {
        setFiles(files.filter((file) => file.id !== id))
    }

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="mb-6 flex items-center gap-2">
                <button onClick={() => router.back()} className="text-xl">
                    ←
                </button>
                <h1 className="text-2xl font-bold">Contenido Visual</h1>
            </div>

            <div className="border-t border-b border-gray-300">
                <div className="grid grid-cols-2 bg-gray-200 py-3">
                    <div className="text-center font-medium">Archivo</div>
                    <div className="text-center font-medium">Eliminar</div>
                </div>

                {files.map((file) => (
                    <div key={file.id} className="grid grid-cols-2 border-b border-gray-200 py-3">
                        <div className="pl-4">{file.name}</div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => handleDelete(file.id)}
                                className="bg-red-600 text-white px-4 py-1 rounded-full text-sm"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-10">
                <button
                    onClick={() => router.push("/Anadir")}
                    className="bg-blue-400 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl shadow-md"
                >
                    +
                </button>
            </div>
        </div>
    )
}

export default Contenido_Visual;

