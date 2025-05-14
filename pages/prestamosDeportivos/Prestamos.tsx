"use client";
import CatalogoComponent from "../../components/Catalogo";
import Layout from "@/components/Layout";

export default function Prestamos() {
    return (
        <div className="min-h-screen flex-col font-[family-name:var(--font-geist-sans)]">
            <div className="flex flex-grow">
                <Layout>
                    <main className="flex-grow p-8">
                        <h1 className="text-2xl font-bold mb-6">Préstamos Deportivos</h1>
                        <CatalogoComponent />
                    </main>
                </Layout>
            </div>
        </div>
    );
}

