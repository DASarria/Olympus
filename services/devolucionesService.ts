const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export interface Devolucion {
    id: string;
    producto: string;
    usuario: string;
    fecha: string;
    estado: string;
    observaciones: string;
    verificado: boolean;
}

export const getDevoluciones = async (): Promise<Devolucion[]> => {
    try {
        const response = await fetch(`${API_URL}/LoanArticle?q=Devuelto`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Transformar los préstamos devueltos a devoluciones
        return data.prestamos.map((p: any) => ({
            id: p.id,
            producto: p.loanDescriptionType,
            usuario: p.nameUser,
            fecha: p.devolutionDate,
            estado: p.equipmentStatus,
            observaciones: p.devolutionRegister || "Sin observaciones",
            verificado: p.loanStatus === "Devuelto"
        }));
    } catch (error) {
        console.error("Error fetching returns:", error);
        throw new Error("No se pudieron cargar las devoluciones");
    }
};

export const createDevolucion = async (devolucion: Omit<Devolucion, "id" | "verificado">): Promise<Devolucion> => {
    try {
        const response = await fetch(`${API_URL}/LoanArticle`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nameUser: devolucion.usuario,
                loanDescriptionType: devolucion.producto,
                devolutionDate: devolucion.fecha,
                equipmentStatus: devolucion.estado,
                devolutionRegister: devolucion.observaciones,
                loanStatus: "Devuelto"
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const createdLoan = await response.json();
        
        return {
            id: createdLoan.id,
            producto: createdLoan.loanDescriptionType,
            usuario: createdLoan.nameUser,
            fecha: createdLoan.devolutionDate,
            estado: createdLoan.equipmentStatus,
            observaciones: createdLoan.devolutionRegister || "Sin observaciones",
            verificado: createdLoan.loanStatus === "Devuelto"
        };
    } catch (error) {
        console.error("Error creating return:", error);
        throw new Error("No se pudo crear la devolución");
    }
};

export const verificarDevolucion = async (id: string): Promise<Devolucion> => {
    try {
        const response = await fetch(`${API_URL}/LoanArticle/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loanStatus: "Devuelto",
                equipmentStatus: "En buen estado",
                devolutionRegister: "Verificado por administrador"
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const updatedLoan = await response.json();
        
        return {
            id: updatedLoan.id,
            producto: updatedLoan.loanDescriptionType,
            usuario: updatedLoan.nameUser,
            fecha: updatedLoan.devolutionDate,
            estado: updatedLoan.equipmentStatus,
            observaciones: updatedLoan.devolutionRegister || "Sin observaciones",
            verificado: updatedLoan.loanStatus === "Devuelto"
        };
    } catch (error) {
        console.error("Error verifying return:", error);
        throw new Error("No se pudo verificar la devolución");
    }
};