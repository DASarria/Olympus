"use client"
import CatalogoComponent from "@/components/Catalogo";
import Layout from "@/components/Layout";

export default function Prestamos() {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Préstamos Deportivos</h1>
        <CatalogoComponent />
      </div>
    </Layout>
  );
}