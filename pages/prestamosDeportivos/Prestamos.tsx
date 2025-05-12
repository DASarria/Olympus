"use client";
import { useState } from "react";
import Catalogo from "../../components/Catalogo";
import Layout from "@/components/Layout";
import Filtro from "../../components/Filtro";

// Renamed to avoid naming conflict with component
export default function CatalogoPage() {
    // Example product data with images from public folder
    const products = [
        {
            id: "1",
            name: "Balón de Fútbol",
            description: "Balón oficial para partidos de fútbol.",
            imageSrc: "/balonfut.png",
        },
        {
            id: "2",
            name: "Balón de Básquet",
            description: "Balón oficial para partidos de básquetbol.",
            imageSrc: "/balonbasquet.png",
        },
    ];

    const [filteredProducts, setFilteredProducts] = useState(products);

    return (
        <div className="min-h-[200px] h-[160px] flex-col font-[family-name:var(--font-geist-sans)]">
            <div className="flex flex-grow">
               <Layout>
                    <main className="flex-grow p-8">
                        <Filtro products={products} onFilter={setFilteredProducts} />
                        <Catalogo products={filteredProducts} />
                    </main>
                    
                </Layout>
            </div>
        </div>
        
    );
}
