const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface Reporte {
    id: string;
    resumen: string;
    detalle: string;
    tiempo: string;
}

export const getReportes = async (): Promise<Reporte[]> => {
    try {
        const response = await fetch(`${API_URL}/LoanArticle/alerts`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.alertas.map((a: any) => ({
            id: a.id,
            resumen: a.message.length > 50 ? a.message.substring(0, 50) + "..." : a.message,
            detalle: a.message,
            tiempo: new Date(a.timestamp).toLocaleString()
        }));
    } catch (error) {
        console.error("Error fetching reports:", error);
        throw new Error("No se pudieron cargar los reportes");
    }
};