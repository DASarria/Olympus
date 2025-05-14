"use client";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import Catalogo from "../../components/Catalogo";

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

    return (
        <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)]">
            <Sidebar role="user" />
            <div className="flex flex-col flex-grow">
                <Header role="Usuario" initials="US" showBackButton />
                <main className="flex-grow p-8">
                    <Catalogo products={products} />
                </main>
                <Footer />
            </div>
        </div>
    );
}