import { Prestamo } from "@/types/prestamo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getAllPrestamos = async (): Promise<Prestamo[]> => {
    try {
        const response = await fetch(`${API_URL}/LoanArticle`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.prestamos.map((p: any) => ({
            id: p.id,
            articleIds: p.articleIds,
            nameUser: p.nameUser,
            userId: p.userId,
            userRole: p.userRole,
            loanDescriptionType: p.loanDescriptionType,
            creationDate: p.creationDate,
            loanDate: p.loanDate,
            devolutionDate: p.devolutionDate,
            loanStatus: p.loanStatus,
            equipmentStatus: p.equipmentStatus,
            devolutionRegister: p.devolutionRegister,
            startTime: p.startTime,
            endTime: p.endTime
        }));
    } catch (error) {
        console.error("Error fetching loans:", error);
        throw new Error("No se pudieron cargar los préstamos");
    }
};

export const createPrestamo = async (prestamo: Omit<Prestamo, "id">): Promise<Prestamo> => {
    try {
        const response = await fetch(`${API_URL}/LoanArticle`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...prestamo,
                loanStatus: "Prestado",
                equipmentStatus: "En buen estado"
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error creating loan:", error);
        throw new Error("No se pudo crear el préstamo");
    }
};

export const getPrestamoById = async (id: string): Promise<Prestamo> => {
    try {
        const response = await fetch(`${API_URL}/LoanArticle/${id}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error fetching loan:", error);
        throw new Error("No se pudo obtener el préstamo");
    }
};

export const updatePrestamo = async (id: string, updates: Partial<Prestamo>): Promise<Prestamo> => {
    try {
        const response = await fetch(`${API_URL}/LoanArticle/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error updating loan:", error);
        throw new Error("No se pudo actualizar el préstamo");
    }
};

export const deletePrestamo = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/LoanArticle/${id}`, {
            method: "DELETE",
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error deleting loan:", error);
        throw new Error("No se pudo eliminar el préstamo");
    }
};